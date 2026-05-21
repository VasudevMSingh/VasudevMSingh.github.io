/**
 * BESS Project Finance Model
 * All financial calculations for the BESS Project Finance Calculator.
 * Runs entirely client-side — no external dependencies.
 *
 * Exposed as window.BESSModel (classic script, no modules).
 */
(function (global) {
  'use strict';

  var CYCLES_PER_DAY = 1.0;
  var DAYS_PER_YEAR = 365;

  // ─────────────────────────────────────────────────
  // DERIVED INPUT HELPERS
  // ─────────────────────────────────────────────────

  function totalCapexPerKWh(inp) {
    return inp.capexCells + inp.capexEPC + inp.capexGrid + inp.capexDev + inp.capexContingency;
  }

  // Total project capex in AUD — capex (AUD/kWh) × energy (MWh) × 1000 kWh/MWh
  function totalCapexAUD(capexKWh, energyMWh) {
    return capexKWh * energyMWh * 1000;
  }

  // ─────────────────────────────────────────────────
  // ANNUAL CASH FLOW SCHEDULE
  // ─────────────────────────────────────────────────

  /**
   * Build the full year-by-year cash flow schedule.
   *
   * @param {object} inp          - model input parameters
   * @param {object} [overrides]  - { totalRevenueOverride: number, totalCapexOverride: number }
   *                                Sensitivity / reverse-solve pass overrides here to avoid
   *                                modifying the canonical inputs object.
   * @returns {Array<object>}     - rows indexed 0 … projectLife
   */
  function buildCashFlows(inp, overrides) {
    overrides = overrides || {};

    var capexKWh = overrides.totalCapexOverride !== undefined
      ? overrides.totalCapexOverride
      : totalCapexPerKWh(inp);

    var energyMWh = inp.powerMW * inp.durationHrs;
    var capexAUD = totalCapexAUD(capexKWh, energyMWh);

    // Straight-line depreciation over project life
    var annualDeprec = capexAUD / inp.projectLife;

    // Augmentation lump-sum costs as % of original capex
    var aug1Cost = (inp.aug1CostPct / 100) * capexAUD;
    var aug2Cost = (inp.aug2CostPct / 100) * capexAUD;

    // For sensitivity testing: if total revenue override is provided, scale all components
    var revScaleFactor = 1.0;
    if (overrides.totalRevenueOverride !== undefined) {
      var baseRevKW = inp.revenueArbitrage + inp.revenueFCAS + inp.revenueContract;
      revScaleFactor = baseRevKW > 0 ? overrides.totalRevenueOverride / baseRevKW : 1.0;
    }

    var rows = [];

    // ── Year 0: capex outflow only ─────────────────
    rows.push({
      year: 0,
      revenueArbitrage: 0,
      revenueFCAS: 0,
      revenueContract: 0,
      revenue: 0,
      opexFixedOM: 0,
      opexInsurance: 0,
      opexLandLease: 0,
      opexVariable: 0,
      fixedOpex: 0,
      variableOpex: 0,
      opex: 0,
      EBITDA: 0,
      depreciation: 0,
      EBIT: 0,
      tax: 0,
      NOPAT: 0,
      DnAAddback: 0,
      operatingCF: 0,
      initialCapex: -capexAUD,
      augmentation: 0,
      FCF: -capexAUD,
      cumulativeFCF: -capexAUD,
      effectiveCapMW: inp.powerMW,
      isAugYear: false,
    });

    var cumFCF = -capexAUD;

    // ── Years 1 … N ───────────────────────────────
    for (var yr = 1; yr <= inp.projectLife; yr++) {
      // Capacity degrades by degradationPct% each year (compound)
      var effectiveCapMW = inp.powerMW * Math.pow(1 - inp.degradationPct / 100, yr);
      var effectiveCapKW = effectiveCapMW * 1000;

      // Revenue components: $/kW/yr × effective kW × escalation (scaled if override)
      var escalation = Math.pow(1 + inp.revenueEscalator / 100, yr - 1);
      var revenueArbitrage = (inp.revenueArbitrage * revScaleFactor) * effectiveCapKW * escalation;
      var revenueFCAS = (inp.revenueFCAS * revScaleFactor) * effectiveCapKW * escalation;
      var revenueContract = (inp.revenueContract * revScaleFactor) * effectiveCapKW * escalation;
      var revenue = revenueArbitrage + revenueFCAS + revenueContract;

      // Opex components
      // Variable O&M: $/MWh × energy dispatched (MWh/yr)
      // Energy dispatched = effective MW × duration hrs × 365 days × 1 cycle/day
      var energyDispatched = effectiveCapMW * inp.durationHrs * DAYS_PER_YEAR * CYCLES_PER_DAY;
      var opexVariable = inp.opexVariable * energyDispatched;

      // Fixed O&M uses nameplate (not degraded) capacity — these costs don't track degradation
      var opexFixedOM = inp.opexFixedOM * inp.powerMW * 1000;
      var opexInsurance = inp.opexInsurance * inp.powerMW * 1000;
      var opexLandLease = inp.opexLandLease;
      var fixedOpex = opexFixedOM + opexInsurance + opexLandLease;
      var variableOpex = opexVariable;

      var opex = fixedOpex + variableOpex;
      var EBITDA = revenue - opex;
      var EBIT = EBITDA - annualDeprec;

      // Tax shield: tax is only payable on positive EBIT (no negative tax refund)
      var tax = Math.max(0, EBIT * (inp.taxRate / 100));
      var NOPAT = EBIT - tax;

      // Free cash flow = NOPAT + D&A addback (D&A is non-cash, so add back)
      var FCF = NOPAT + annualDeprec;

      // Augmentation capex outflows in the specified years
      var augmentation = 0;
      if (yr === inp.aug1Year) augmentation += aug1Cost;
      if (yr === inp.aug2Year) augmentation += aug2Cost;
      FCF -= augmentation;

      cumFCF += FCF;

      var operatingCF = NOPAT + annualDeprec;

      rows.push({
        year: yr,
        revenueArbitrage: revenueArbitrage,
        revenueFCAS: revenueFCAS,
        revenueContract: revenueContract,
        revenue: revenue,
        opexFixedOM: opexFixedOM,
        opexInsurance: opexInsurance,
        opexLandLease: opexLandLease,
        opexVariable: opexVariable,
        fixedOpex: fixedOpex,
        variableOpex: variableOpex,
        opex: opex,
        EBITDA: EBITDA,
        depreciation: annualDeprec,
        EBIT: EBIT,
        tax: tax,
        NOPAT: NOPAT,
        DnAAddback: annualDeprec,
        operatingCF: operatingCF,
        initialCapex: 0,
        augmentation: augmentation,
        FCF: FCF,
        cumulativeFCF: cumFCF,
        effectiveCapMW: effectiveCapMW,
        isAugYear: (yr === inp.aug1Year || yr === inp.aug2Year),
      });
    }

    return rows;
  }

  // ─────────────────────────────────────────────────
  // NPV
  // ─────────────────────────────────────────────────

  /**
   * Net Present Value of a cash flow series.
   * NPV = Σ FCF_t / (1 + r)^t
   *
   * @param {Array<object>} cashFlows
   * @param {number} rate - discount rate as decimal (e.g. 0.12 for 12%)
   */
  function calcNPV(cashFlows, rate) {
    return cashFlows.reduce(function (sum, row) {
      return sum + row.FCF / Math.pow(1 + rate, row.year);
    }, 0);
  }

  /**
   * Derivative of NPV with respect to r.
   * dNPV/dr = Σ [ -t × FCF_t / (1+r)^(t+1) ]
   * Used as the Newton-Raphson step denominator.
   */
  function calcNPVPrime(cashFlows, rate) {
    return cashFlows.reduce(function (sum, row) {
      if (row.year === 0) return sum;
      return sum + (-row.year * row.FCF) / Math.pow(1 + rate, row.year + 1);
    }, 0);
  }

  // ─────────────────────────────────────────────────
  // IRR — Newton-Raphson
  // ─────────────────────────────────────────────────

  /**
   * Internal Rate of Return via Newton-Raphson iteration.
   *
   * Newton-Raphson finds the zero of a function by iterating:
   *   r_{n+1} = r_n - NPV(r_n) / NPV'(r_n)
   *
   * This converges quadratically for well-behaved cash flows.
   * We start at 10% (a reasonable IRR prior for BESS projects).
   *
   * Convergence: |Δr| < 0.00001 (0.001%)
   * Fallback: if derivative is near zero (flat NPV curve) or max
   * iterations reached, return null → displayed as "No solution".
   *
   * @param {Array<object>} cashFlows
   * @returns {number|null} IRR as decimal, or null if no convergence
   */
  function calcIRR(cashFlows) {
    // Quick feasibility check — if there are no positive cash flows, IRR is undefined
    var hasPositive = false;
    for (var i = 0; i < cashFlows.length; i++) {
      if (cashFlows[i].FCF > 0) { hasPositive = true; break; }
    }
    if (!hasPositive) return null;

    var r = 0.10; // starting guess: 10%

    for (var iter = 0; iter < 1000; iter++) {
      var npv = calcNPV(cashFlows, r);
      var npvp = calcNPVPrime(cashFlows, r);

      // Guard: if derivative is too small, Newton step is unreliable
      if (Math.abs(npvp) < 1e-12) break;

      var delta = npv / npvp; // Newton-Raphson step
      r = r - delta;

      // Clamp to avoid divergence into nonsensical territory
      if (r < -0.999) r = -0.999;
      if (r > 100) r = 100;

      // Convergence check: step size fell below tolerance
      if (Math.abs(delta) < 0.00001) return r;
    }

    // If Newton-Raphson failed (pathological shape), try bisection as fallback
    return bisectionIRR(cashFlows);
  }

  /**
   * Bisection fallback for IRR when Newton-Raphson doesn't converge.
   * Searches for sign change in NPV between -50% and +200%.
   */
  function bisectionIRR(cashFlows) {
    var lo = -0.5, hi = 2.0;
    var fLo = calcNPV(cashFlows, lo);
    var fHi = calcNPV(cashFlows, hi);
    if (fLo * fHi > 0) return null; // no sign change in this range

    for (var i = 0; i < 100; i++) {
      var mid = (lo + hi) / 2;
      var fMid = calcNPV(cashFlows, mid);
      if (Math.abs(fMid) < 1e-6 || (hi - lo) < 1e-6) return mid;
      if (fLo * fMid < 0) hi = mid;
      else { lo = mid; fLo = fMid; }
    }

    return (lo + hi) / 2;
  }

  // ─────────────────────────────────────────────────
  // SIMPLE PAYBACK
  // ─────────────────────────────────────────────────

  /**
   * Simple payback: first year cumulative undiscounted FCF turns positive.
   * Linearly interpolated to one decimal place between the crossing years.
   *
   * @param {Array<object>} cashFlows
   * @returns {number|null} payback in years (1 d.p.), or null if investment never recovered
   */
  function calcPayback(cashFlows) {
    for (var i = 1; i < cashFlows.length; i++) {
      if (cashFlows[i].cumulativeFCF >= 0) {
        var prev = cashFlows[i - 1].cumulativeFCF; // negative
        var curr = cashFlows[i].cumulativeFCF;     // positive
        // Interpolation: fraction of year i where the line crosses zero
        return (i - 1) + Math.abs(prev) / (Math.abs(prev) + curr);
      }
    }
    return null; // cumulative FCF never turns positive within project life
  }

  // ─────────────────────────────────────────────────
  // LCOS — Levelised Cost of Storage
  // ─────────────────────────────────────────────────

  /**
   * LCOS = PV(all costs) / PV(energy discharged)   [AUD/MWh]
   *
   * Costs: capex (t=0) + opex + augmentation + tax (all years 1-N, discounted)
   * Energy: effective MWh dispatched per year, discounted at same rate.
   *
   * @param {object} inp
   * @param {Array<object>} cashFlows
   * @param {number} rate - discount rate as decimal
   */
  function calcLCOS(inp, cashFlows, rate) {
    var pvCosts = 0;
    var pvEnergy = 0;

    cashFlows.forEach(function (row) {
      if (row.year === 0) {
        // Capex at t=0: PV factor = 1, so PV cost = capex
        pvCosts += Math.abs(row.FCF);
      } else {
        var df = Math.pow(1 + rate, row.year);
        pvCosts += row.opex / df;
        pvCosts += row.tax / df;
        pvCosts += row.augmentation / df;

        // Energy dispatched: effective MW × duration hrs × 365 days × 1 cycle/day
        var mwhYear = row.effectiveCapMW * inp.durationHrs * DAYS_PER_YEAR * CYCLES_PER_DAY;
        pvEnergy += mwhYear / df;
      }
    });

    return pvEnergy > 0 ? pvCosts / pvEnergy : null;
  }

  // ─────────────────────────────────────────────────
  // SENSITIVITY TABLE
  // ─────────────────────────────────────────────────

  var SENSITIVITY_REVENUE = [120, 140, 160, 180, 200]; // AUD/kW/yr (rows)
  var SENSITIVITY_CAPEX = [400, 450, 500, 550, 600];   // AUD/kWh  (cols)

  /**
   * Build the 5×5 IRR sensitivity grid.
   * Each cell is a full independent model run with overridden revenue and capex.
   * 25 cells × ~15 Newton-Raphson iterations each ≈ comfortably under 200 ms.
   *
   * @param {object} inp - base inputs (project life, degradation, opex, etc. held constant)
   * @returns {{ revenueAxis, capexAxis, results: object }} results keyed "rev_capex"
   */
  function calcSensitivity(inp) {
    var results = {};

    SENSITIVITY_REVENUE.forEach(function (rev) {
      SENSITIVITY_CAPEX.forEach(function (capex) {
        var flows = buildCashFlows(inp, {
          totalRevenueOverride: rev,
          totalCapexOverride: capex,
        });
        results[rev + '_' + capex] = calcIRR(flows);
      });
    });

    return {
      revenueAxis: SENSITIVITY_REVENUE,
      capexAxis: SENSITIVITY_CAPEX,
      results: results,
    };
  }

  // ─────────────────────────────────────────────────
  // BINARY SEARCH — generic root-finding
  // ─────────────────────────────────────────────────

  /**
   * Binary search for the zero of a monotone function f in [lo, hi].
   *
   * At each iteration we halve the search interval by testing the midpoint:
   *   - if f(mid) has the same sign as f(lo), the root is in [mid, hi]
   *   - otherwise the root is in [lo, mid]
   *
   * Convergence: |f(mid)| < irrTol  OR  interval width < xTol.
   *
   * @param {function} f       - monotone function whose zero we seek
   * @param {number}   lo      - lower bound of search range
   * @param {number}   hi      - upper bound of search range
   * @param {number}   irrTol  - function value tolerance (IRR units, decimal)
   * @param {number}   xTol    - x value tolerance (AUD/kWh)
   * @param {number}   maxIter - max iterations
   * @returns {number|null}    - solution, or null if no sign change detected
   */
  function binarySearch(f, lo, hi, irrTol, xTol, maxIter) {
    irrTol = irrTol !== undefined ? irrTol : 0.00001; // 0.001% IRR
    xTol = xTol !== undefined ? xTol : 0.01;           // AUD 0.01/kWh
    maxIter = maxIter !== undefined ? maxIter : 200;

    var fLo = f(lo);
    var fHi = f(hi);

    // Require opposite signs to guarantee a root in interval
    if (fLo * fHi > 0) return null;

    // Determine direction so we know which half contains the root
    var increasing = (fHi > fLo);

    for (var i = 0; i < maxIter; i++) {
      var mid = (lo + hi) / 2;
      var fMid = f(mid);

      // Converged: function value small enough, or interval too thin to matter
      if (Math.abs(fMid) < irrTol || (hi - lo) < xTol) return mid;

      // Narrow the interval toward the root
      if (increasing) {
        if (fMid < 0) lo = mid; else hi = mid;
      } else {
        if (fMid > 0) lo = mid; else hi = mid;
      }
    }

    return (lo + hi) / 2; // best estimate after exhausting iterations
  }

  // ─────────────────────────────────────────────────
  // REVERSE SOLVE 1: Maximum capex for target IRR
  // ─────────────────────────────────────────────────

  /**
   * Find the maximum total capex (AUD/kWh) that still achieves the target IRR
   * at the specified revenue level.
   *
   * Relationship: as capex increases, IRR decreases → f is monotone decreasing.
   * Binary search on capex in [100, 2000] AUD/kWh.
   *
   * @param {object} inp          - base inputs
   * @param {number} targetIRR   - target IRR as decimal (e.g. 0.12)
   * @param {number} totalRevenue - AUD/kW/year
   * @returns {object|null}
   */
  function solveMaxCapex(inp, targetIRR, totalRevenue) {
    // f(capex) = IRR at this capex − target IRR
    // We seek f = 0, i.e. IRR = targetIRR
    var f = function (capex) {
      var flows = buildCashFlows(inp, {
        totalRevenueOverride: totalRevenue,
        totalCapexOverride: capex,
      });
      var irr = calcIRR(flows);
      return (irr !== null ? irr : -1.0) - targetIRR;
    };

    var result = binarySearch(f, 100, 2000);
    if (result === null) return null;

    var energyMWh = inp.powerMW * inp.durationHrs;
    var currentCapex = totalCapexPerKWh(inp);

    return {
      maxCapexKWh: result,
      maxCapexAUDm: totalCapexAUD(result, energyMWh) / 1e6,
      currentCapexKWh: currentCapex,
      headroomPct: ((result - currentCapex) / currentCapex) * 100,
    };
  }

  // ─────────────────────────────────────────────────
  // REVERSE SOLVE 2: Minimum revenue for target IRR
  // ─────────────────────────────────────────────────

  /**
   * Find the minimum total revenue (AUD/kW/year) needed to achieve the target IRR
   * at the specified capex level.
   *
   * Relationship: as revenue increases, IRR increases → f is monotone increasing.
   * Binary search on total revenue in [0, 500] AUD/kW/year.
   *
   * @param {object} inp          - base inputs (arbitrage and contract held at inp values)
   * @param {number} targetIRR   - target IRR as decimal
   * @param {number} totalCapex  - AUD/kWh
   * @returns {object|null}
   */
  function solveMinRevenue(inp, targetIRR, totalCapex) {
    var f = function (revenue) {
      var flows = buildCashFlows(inp, {
        totalRevenueOverride: revenue,
        totalCapexOverride: totalCapex,
      });
      var irr = calcIRR(flows);
      return (irr !== null ? irr : -1.0) - targetIRR;
    };

    var result = binarySearch(f, 0, 500);
    if (result === null) return null;

    // Residual that must come from FCAS, given arbitrage and contract at current values
    var impliedFCAS = result - inp.revenueArbitrage - inp.revenueContract;

    return {
      minRevenue: result,
      impliedFCAS: Math.max(0, impliedFCAS),
      fcasAggressive: impliedFCAS > 120,
    };
  }

  // ─────────────────────────────────────────────────
  // REVERSE SOLVE 3: Minimum FCAS for target IRR
  // ─────────────────────────────────────────────────

  /**
   * Find the minimum FCAS revenue (AUD/kW/year) needed to achieve the target IRR,
   * holding all other revenue streams at current input values.
   *
   * Binary search on FCAS in [0, 300] AUD/kW/year.
   *
   * @param {object} inp        - base inputs (arbitrage and contract NOT overridden)
   * @param {number} targetIRR - target IRR as decimal
   * @returns {object|null}
   */
  function solveMinFCAS(inp, targetIRR) {
    var f = function (fcas) {
      // Only FCAS changes; all other inputs (including arbitrage, contract, capex) stay as-is
      var modInp = {};
      for (var k in inp) { if (inp.hasOwnProperty(k)) modInp[k] = inp[k]; }
      modInp.revenueFCAS = fcas;
      var flows = buildCashFlows(modInp);
      var irr = calcIRR(flows);
      return (irr !== null ? irr : -1.0) - targetIRR;
    };

    var result = binarySearch(f, 0, 300);
    if (result === null) return null;

    return { minFCAS: result };
  }

  // ─────────────────────────────────────────────────
  // LEVERED (PROJECT FINANCE) MODEL
  // ─────────────────────────────────────────────────

  /**
   * Calculate Cash Flow Available for Debt Service (CFADS).
   * CFADS = EBITDA - tax (on EBIT basis, no interest tax shield in v1)
   *
   * @param {Array<object>} projectFlows - from buildCashFlows
   * @returns {Array<number>} CFADS by year [0..projectLife]
   */
  function calculateCFADS(projectFlows) {
    return projectFlows.map(function (row) {
      return row.EBITDA - row.tax;
    });
  }

  /**
   * Build debt schedule using annuity method (equal total debt service).
   *
   * Annual debt service = debt × r / (1 - (1+r)^-tenor)
   * where r = interest rate, tenor = loan duration in years
   *
   * @param {number} debt        - total debt in AUD
   * @param {number} rate        - annual interest rate as decimal (e.g. 0.065)
   * @param {number} tenor       - loan duration in years
   * @returns {Array<object>}    - debt schedule rows [0..tenor]
   */
  function calculateDebtScheduleAnnuity(debt, rate, tenor) {
    if (debt <= 0 || tenor <= 0) return [];

    // Annual debt service (annuity formula)
    var annualDS = rate === 0
      ? debt / tenor  // Special case: no interest
      : debt * rate / (1 - Math.pow(1 + rate, -tenor));

    var schedule = [];
    var balance = debt;

    // Year 0: no debt service
    schedule.push({
      year: 0,
      openingBalance: debt,
      interest: 0,
      principal: 0,
      closingBalance: debt,
      debtService: 0,
    });

    // Years 1 to tenor
    for (var yr = 1; yr <= tenor; yr++) {
      var interest = balance * rate;
      var principal = annualDS - interest;

      // Handle rounding in final year: repay remaining balance
      if (yr === tenor) {
        principal = balance;
      }

      balance -= principal;

      schedule.push({
        year: yr,
        openingBalance: schedule[yr - 1].closingBalance,
        interest: interest,
        principal: principal,
        closingBalance: Math.max(0, balance),
        debtService: interest + principal,
      });
    }

    return schedule;
  }

  /**
   * Build debt schedule using sculpted method (DSCR-based).
   *
   * Debt service each year is sized so DSCR = CFADS / debt service = minDSCR
   * Sculpted debt service = CFADS / minDSCR (clamped to ≥ interest)
   *
   * The schedule is iterated so total principal equals total debt by year tenor.
   *
   * @param {Array<number>} cfadsByYear - CFADS each year [0..projectLife]
   * @param {number} debt               - total debt in AUD
   * @param {number} rate               - annual interest rate as decimal
   * @param {number} tenor              - loan duration in years
   * @param {number} minDSCR            - minimum DSCR covenant (e.g. 1.30)
   * @returns {Array<object>}           - debt schedule with dscr, flags
   */
  function calculateDebtScheduleSculpted(cfadsByYear, debt, rate, tenor, minDSCR) {
    if (debt <= 0 || tenor <= 0 || minDSCR <= 0) return [];

    var schedule = [];
    var balance = debt;
    var breaches = []; // Track DSCR breaches

    // Year 0
    schedule.push({
      year: 0,
      openingBalance: debt,
      interest: 0,
      principal: 0,
      closingBalance: debt,
      debtService: 0,
      DSCR: null,
      dscrbreach: false,
    });

    // Years 1 to tenor: iteratively sculpt
    var targetTotal = 0;
    var cumulativePrincipal = 0;

    for (var yr = 1; yr <= tenor; yr++) {
      var openBal = schedule[yr - 1].closingBalance;
      var cfads = cfadsByYear[yr] || 0;
      var interest = openBal * rate;

      // Sculpted debt service: CFADS / minDSCR
      // But must be at least interest (no negative principal)
      var debtService = cfads > 0 ? cfads / minDSCR : interest;
      debtService = Math.max(debtService, interest);

      var principal = debtService - interest;
      var closeBal = openBal - principal;
      var dscr = debtService > 0 ? cfads / debtService : null;

      var dscrbreach = (dscr !== null && dscr < minDSCR - 0.001); // tolerance
      if (dscrbreach) breaches.push(yr);

      cumulativePrincipal += principal;
      targetTotal += debtService;

      schedule.push({
        year: yr,
        openingBalance: openBal,
        interest: interest,
        principal: principal,
        closingBalance: Math.max(0, closeBal),
        debtService: debtService,
        DSCR: dscr,
        dscrbreach: dscrbreach,
      });
    }

    // Adjust final year so total principal = total debt (handle rounding)
    if (schedule[tenor]) {
      var remainingPrincipal = debt - (cumulativePrincipal - schedule[tenor].principal);
      schedule[tenor].principal = remainingPrincipal;
      schedule[tenor].closingBalance = 0;
      schedule[tenor].debtService = schedule[tenor].interest + remainingPrincipal;
      var finalDSCR = schedule[tenor].debtService > 0
        ? (cfadsByYear[tenor] || 0) / schedule[tenor].debtService
        : null;
      schedule[tenor].DSCR = finalDSCR;
    }

    return schedule;
  }

  /**
   * Calculate Debt Service Reserve Account (DSRA) mechanics.
   *
   * DSRA is funded at financial close (Year 0) from equity.
   * Target = months of debt service / 12
   * Movements: funded/released to maintain target in operating years
   * Released fully in first year after loan maturity
   *
   * @param {Array<object>} debtSchedule  - from calculateDebtSchedule*
   * @param {number} monthsCover         - months of DS to reserve (e.g. 6)
   * @returns {Array<object>}            - DSRA rows [0..projectLife]
   */
  function calculateDSRA(debtSchedule, monthsCover) {
    if (!debtSchedule || debtSchedule.length === 0) return [];

    var dsra = [];
    var tenor = Math.max.apply(null, debtSchedule.map(function(r) { return r.year; }));

    for (var yr = 0; yr <= Math.max(tenor + 1, debtSchedule.length - 1); yr++) {
      var ds = debtSchedule[yr] || { debtService: 0 };

      if (yr === 0) {
        // Year 0: fund initial balance
        var initialTarget = (ds.debtService * (monthsCover / 12)) || 0;
        dsra.push({
          year: 0,
          targetBalance: initialTarget,
          openingBalance: 0,
          movement: initialTarget, // funded from equity
          closingBalance: initialTarget,
          isRelease: false,
        });
      } else if (yr > tenor) {
        // After loan maturity: release full balance
        var prev = dsra[dsra.length - 1];
        dsra.push({
          year: yr,
          targetBalance: 0,
          openingBalance: prev.closingBalance,
          movement: -prev.closingBalance, // release
          closingBalance: 0,
          isRelease: true,
        });
      } else {
        // During operations: maintain target
        var prev = dsra[dsra.length - 1];
        var nextDS = debtSchedule[yr + 1]
          ? debtSchedule[yr + 1].debtService
          : 0;
        var target = nextDS * (monthsCover / 12);
        var movement = target - prev.closingBalance;
        dsra.push({
          year: yr,
          targetBalance: target,
          openingBalance: prev.closingBalance,
          movement: movement,
          closingBalance: prev.closingBalance + movement,
          isRelease: false,
        });
      }
    }

    return dsra;
  }

  /**
   * Calculate total debt and equity in levered mode.
   *
   * Total debt = leverage × total capex
   * Equity = total capex + DSRA funding + arrangement fee - debt
   *
   * @param {object} inp - inputs with debtInputs sub-object
   * @returns {object}   - { totalDebt, totalEquity, dsraFunding, arrangementFee }
   */
  function calculateTotalDebtAndEquity(inp) {
    var debtInp = inp.debtInputs || {};
    var leverage = debtInp.leverage !== undefined ? debtInp.leverage / 100 : 0.65;

    var energyMWh = inp.powerMW * inp.durationHrs;
    var capexKWh = inp.debtInputs && inp.debtInputs.capexOverride
      ? inp.debtInputs.capexOverride
      : totalCapexPerKWh(inp);
    var totalCapex = totalCapexAUD(capexKWh, energyMWh);

    var totalDebt = totalCapex * leverage;

    var tenor = debtInp.loanTenor || 12;
    var rate = (debtInp.interestRate || 6.5) / 100;
    var monthsCover = debtInp.dsraMonths || 6;
    var arrangementFeeRate = (debtInp.arrangementFeePct || 1.0) / 100;

    // Approx debt service for DSRA (use annuity as proxy)
    var approxDS = rate === 0
      ? totalDebt / tenor
      : totalDebt * rate / (1 - Math.pow(1 + rate, -tenor));
    var dsraFunding = approxDS * (monthsCover / 12);
    var arrangementFee = totalDebt * arrangementFeeRate;

    var totalEquity = totalCapex + dsraFunding + arrangementFee - totalDebt;

    return {
      totalDebt: totalDebt,
      totalEquity: totalEquity,
      dsraFunding: dsraFunding,
      arrangementFee: arrangementFee,
      totalCapex: totalCapex,
    };
  }

  /**
   * Calculate equity cash flows in levered mode.
   *
   * Year 0: negative equity outflow (funding the project)
   * Years 1-tenor: CFADS - debt service ± DSRA movement
   * Years > tenor: CFADS (+ DSRA release in first post-maturity year)
   *
   * @param {Array<object>} projectFlows  - from buildCashFlows
   * @param {Array<object>} debtSchedule  - from calculateDebtSchedule*
   * @param {Array<object>} dsra          - from calculateDSRA
   * @param {number} totalEquity         - total equity funding required
   * @returns {Array<object>}            - equity cash flow rows
   */
  function calculateEquityCashFlows(projectFlows, debtSchedule, dsra, totalEquity) {
    if (!projectFlows || !debtSchedule || !dsra) return [];

    var tenor = Math.max.apply(null, debtSchedule.map(function(r) { return r.year; }));
    var cfads = calculateCFADS(projectFlows);
    var equityFlows = [];

    for (var yr = 0; yr < projectFlows.length; yr++) {
      if (yr === 0) {
        equityFlows.push({
          year: 0,
          CFADS: 0,
          debtService: 0,
          DSRAmovement: dsra[0] ? dsra[0].movement : 0,
          equityFCF: -totalEquity,
          cumulativeEquityFCF: -totalEquity,
        });
      } else if (yr <= tenor) {
        // During debt service period
        var ds = debtSchedule[yr] || { debtService: 0 };
        var dsraMov = dsra[yr] ? dsra[yr].movement : 0;
        var equityFCF = cfads[yr] - ds.debtService - dsraMov;
        var cumEq = equityFlows[yr - 1].cumulativeEquityFCF + equityFCF;

        equityFlows.push({
          year: yr,
          CFADS: cfads[yr],
          debtService: ds.debtService,
          DSRAmovement: dsraMov,
          equityFCF: equityFCF,
          cumulativeEquityFCF: cumEq,
        });
      } else {
        // After loan maturity
        var dsraMov = dsra[yr] ? dsra[yr].movement : 0;
        var equityFCF = cfads[yr] - dsraMov; // no debt service
        var cumEq = equityFlows[yr - 1].cumulativeEquityFCF + equityFCF;

        equityFlows.push({
          year: yr,
          CFADS: cfads[yr],
          debtService: 0,
          DSRAmovement: dsraMov,
          equityFCF: equityFCF,
          cumulativeEquityFCF: cumEq,
        });
      }
    }

    return equityFlows;
  }

  /**
   * Calculate levered model metrics (IRR, NPV, payback, DSCR).
   *
   * @param {object} inp                  - full inputs
   * @param {Array<object>} equityFlows  - from calculateEquityCashFlows
   * @param {Array<object>} debtSchedule - from calculateDebtSchedule*
   * @returns {object}                   - { leveredIRR, equityNPV, payback, minDSCR, peakDSyear, ... }
   */
  function calculateLeveredMetrics(inp, equityFlows, debtSchedule) {
    var rate = (inp.discountRate || 12) / 100;

    // IRR on equity cash flows
    var leveredIRR = calcIRR(equityFlows.map(function(e) {
      return { year: e.year, FCF: e.equityFCF };
    }));

    // NPV on equity cash flows
    var equityNPV = equityFlows.reduce(function(sum, e) {
      return sum + e.equityFCF / Math.pow(1 + rate, e.year);
    }, 0);

    // Payback on equity basis (cumulative turns positive)
    var payback = null;
    for (var i = 1; i < equityFlows.length; i++) {
      if (equityFlows[i].cumulativeEquityFCF >= 0) {
        var prev = equityFlows[i - 1].cumulativeEquityFCF;
        var curr = equityFlows[i].cumulativeEquityFCF;
        payback = (i - 1) + Math.abs(prev) / (Math.abs(prev) + curr);
        break;
      }
    }

    // Min DSCR and peak debt service year
    var minDSCR = null;
    var peakDSyear = null;
    var peakDS = 0;

    debtSchedule.forEach(function(ds) {
      if (ds.year > 0 && ds.DSCR !== null && (minDSCR === null || ds.DSCR < minDSCR)) {
        minDSCR = ds.DSCR;
      }
      if (ds.debtService > peakDS) {
        peakDS = ds.debtService;
        peakDSyear = ds.year;
      }
    });

    return {
      leveredIRR: leveredIRR,
      equityNPV: equityNPV,
      payback: payback,
      minDSCR: minDSCR,
      peakDSyear: peakDSyear,
      peakDS: peakDS,
    };
  }

  /**
   * Build full levered model (debt schedule + equity cash flows + metrics).
   *
   * @param {object} inp - full inputs including debtInputs
   * @returns {object}   - { debtSchedule, equityFlows, metrics, errors, warnings }
   */
  function buildLeveredModel(inp) {
    var projectFlows = buildCashFlows(inp);
    var debtInp = inp.debtInputs || {};

    // Bail out if leverage is 0
    var leverage = debtInp.leverage || 65;
    if (leverage <= 0.01) {
      return {
        debtSchedule: [],
        equityFlows: [],
        metrics: null,
        dsra: [],
        errors: [],
        warnings: ['Leverage ≤ 0% — levered model degenerates to unlevered'],
      };
    }

    var debtEquity = calculateTotalDebtAndEquity(inp);
    var cfads = calculateCFADS(projectFlows);

    // Choose debt method
    var method = debtInp.sculptingMethod || 'annuity';
    var rate = (debtInp.interestRate || 6.5) / 100;
    var tenor = debtInp.loanTenor || 12;
    var minDSCR = (debtInp.minDSCR || 1.30);

    var debtSchedule = method === 'sculpted'
      ? calculateDebtScheduleSculpted(cfads, debtEquity.totalDebt, rate, tenor, minDSCR)
      : calculateDebtScheduleAnnuity(debtEquity.totalDebt, rate, tenor);

    var dsra = calculateDSRA(debtSchedule, debtInp.dsraMonths || 6);
    var equityFlows = calculateEquityCashFlows(projectFlows, debtSchedule, dsra, debtEquity.totalEquity);
    var metrics = calculateLeveredMetrics(inp, equityFlows, debtSchedule);

    var errors = [];
    var warnings = [];

    if (tenor > inp.projectLife) {
      warnings.push('Loan tenor exceeds project life');
    }

    // Check DSCR breaches in sculpted method
    if (method === 'sculpted') {
      debtSchedule.forEach(function(ds) {
        if (ds.dscrbreach) {
          warnings.push('DSCR breach in Year ' + ds.year + ' (DSCR: ' + (ds.DSCR || 0).toFixed(2) + ')');
        }
      });
    }

    return {
      debtSchedule: debtSchedule,
      equityFlows: equityFlows,
      dsra: dsra,
      metrics: metrics,
      debtAndEquity: debtEquity,
      errors: errors,
      warnings: warnings,
    };
  }

  /**
   * Calculate levered IRR sensitivity (same axes as unlevered).
   *
   * @param {object} inp - inputs
   * @returns {object}   - { revenueAxis, capexAxis, results }
   */
  function calcSensitivityLevered(inp) {
    var results = {};

    SENSITIVITY_REVENUE.forEach(function (rev) {
      SENSITIVITY_CAPEX.forEach(function (capex) {
        var modInp = {};
        for (var k in inp) { if (inp.hasOwnProperty(k)) modInp[k] = inp[k]; }
        // Override revenue and capex
        modInp.revenueArbitrage = rev * (inp.revenueArbitrage / (inp.revenueArbitrage + inp.revenueFCAS + inp.revenueContract || 1));
        modInp.revenueFCAS = rev * (inp.revenueFCAS / (inp.revenueArbitrage + inp.revenueFCAS + inp.revenueContract || 1));
        modInp.revenueContract = rev * (inp.revenueContract / (inp.revenueArbitrage + inp.revenueFCAS + inp.revenueContract || 1));

        if (modInp.debtInputs) {
          modInp.debtInputs = {};
          for (var dk in inp.debtInputs) { if (inp.debtInputs.hasOwnProperty(dk)) modInp.debtInputs[dk] = inp.debtInputs[dk]; }
          modInp.debtInputs.capexOverride = capex;
        }

        var levered = buildLeveredModel(modInp);
        results[rev + '_' + capex] = levered.metrics ? levered.metrics.leveredIRR : null;
      });
    });

    return {
      revenueAxis: SENSITIVITY_REVENUE,
      capexAxis: SENSITIVITY_CAPEX,
      results: results,
    };
  }

  // ─────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────

  global.BESSModel = {
    totalCapexPerKWh: totalCapexPerKWh,
    totalCapexAUD: totalCapexAUD,
    buildCashFlows: buildCashFlows,
    calcNPV: calcNPV,
    calcIRR: calcIRR,
    calcPayback: calcPayback,
    calcLCOS: calcLCOS,
    calcSensitivity: calcSensitivity,
    SENSITIVITY_REVENUE: SENSITIVITY_REVENUE,
    SENSITIVITY_CAPEX: SENSITIVITY_CAPEX,
    solveMaxCapex: solveMaxCapex,
    solveMinRevenue: solveMinRevenue,
    solveMinFCAS: solveMinFCAS,
    calculateCFADS: calculateCFADS,
    calculateDebtScheduleAnnuity: calculateDebtScheduleAnnuity,
    calculateDebtScheduleSculpted: calculateDebtScheduleSculpted,
    calculateDSRA: calculateDSRA,
    calculateTotalDebtAndEquity: calculateTotalDebtAndEquity,
    calculateEquityCashFlows: calculateEquityCashFlows,
    calculateLeveredMetrics: calculateLeveredMetrics,
    buildLeveredModel: buildLeveredModel,
    calcSensitivityLevered: calcSensitivityLevered,
  };

})(window);
