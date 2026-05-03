# What a Battery Actually Does on the Grid

**Series:** Why Batteries Matter - And How They Make Money | Article 2 of 6

---

> **About This Series**
>
> *Why Batteries Matter - And How They Make Money* is a 6-part series covering battery energy storage systems (BESS) from first principles to full project economics.
>
> - Article 1: Why the grid needs batteries
> - **Article 2 (this one):** What a battery actually does on the grid
> - Article 3: How a battery makes money - energy arbitrage
> - Article 4: How a battery makes money - ancillary services
> - Article 5: The hidden cost - degradation
> - Article 6: The full picture - does it actually work?
>
> *All examples use a Li-Ion BESS operating as a merchant in the ERCOT grid. The economics and principles apply broadly to any BESS in any market. This series does not cover battery chemistry, construction, or raw materials.*

---

In Article 1, we established why the grid needs batteries: the mismatch between when renewable energy is generated and when people actually need it creates a structural problem that only storage can solve. Batteries reduce curtailment, displace peaker plants, and stabilise frequency faster than any other technology on the grid.

Before we get to the economics - how a battery actually earns money - we need to understand what it is doing, hour by hour, when it is connected to the grid. Two functions drive the revenue: shifting energy in time, and providing the reliability services that grid operators have always needed to keep the system balanced. Understanding both - and the constraint they share - is the foundation for everything that follows.


## Energy Shifting: The Charge-Discharge Cycle

The most intuitive function is energy shifting, and the duck curve (see Article 1) is an operating manual for it.

A battery operator looking at the Texas day-ahead market on a summer Tuesday sees the same shape every day: prices collapse in the midday hours as solar floods the grid, then spike in the evening as solar disappears and demand climbs. The spread between the midday trough and the evening peak is the arbitrage opportunity that a battery can capture.

In practice, this means the battery begins charging in the late morning as prices fall. It absorbs power from the grid - converting electrical energy into stored chemical energy - and its state of charge rises. At some point in the afternoon, with state of charge near its operational maximum, the operator issues a discharge instruction. The battery reverses direction, releasing stored energy back to the grid at the higher evening price. State of charge falls.

State of charge - expressed as a percentage of the battery's total energy capacity - is the operating variable that governs everything. It is the battery's fuel gauge. A 200 MWh battery at 80% state of charge has 160 MWh available to discharge. The same battery at 20% state of charge has 40 MWh. Operators and optimization algorithms watch it continuously, because running the battery to 0% or 100% carries both technical and economic costs.

**[CHART 1: Single BESS dispatch day. Three panels stacked vertically, same x-axis (hour of day, 24 hours). Panel 1: ERCOT day-ahead LMP price ($/MWh). Panel 2: Charge/discharge rate (MW) - positive = charging, negative = discharging. Panel 3: State of charge (%). Source: LP model output from battery dispatch article, one representative spring day Q1 2025.]**

But storing and retrieving energy is not lossless. For a lithium-ion BESS, round-trip efficiency is typically around 85% - the figure used across NREL's Annual Technology Baseline and confirmed in repeated field deployments.[[1]](#ref-1) That means for every 100 MWh charged into the battery, only 85 MWh comes back out. The remaining 15% is lost as heat during the charge and discharge process.

This efficiency loss sets the minimum spread the battery needs to capture before a cycle is profitable. If round-trip efficiency is 85%, and the battery charges at $20/MWh, it needs to discharge at more than $23.50/MWh just to break even on that cycle - before accounting for any other costs. The spread has to be wide enough to cover that efficiency loss and then some.[[2]](#ref-2)

## Ancillary Services: Speed Was Already Being Paid For

Energy shifting is the job most people picture when they think about batteries. Ancillary services are the job that actually defined the early BESS business case - and they existed long before a single battery was connected to the grid.

Every grid operator procures a set of products designed to keep the system in real-time balance. They run continuously, every hour of every day, invisibly, as the margin between what generators produce and what customers consume shifts by the second. For decades, thermal generators provided them. A gas plant running at partial load could hold spare capacity in reserve - available to ramp up or absorb within seconds if the grid needed it. That reserve was paid for by the market as an ancillary service.[[3]](#ref-3)

The product stack differs in name across markets but is structurally the same everywhere: services organised by speed, each tier faster than the last.

The slowest tier is **non-spinning reserve** - resources that are offline but can be started and delivering power within ten minutes. Thermal assets have always owned this tier; the response window is wide enough for their longer startup sequence.

The middle tier is **spinning or synchronised reserve** - resources already online and synchronized to the grid, holding spare capacity that can be deployed within ten minutes of a contingency event. When a large generator trips unexpectedly, spinning reserve is the first committed response. In the thermal era, partial-load operation was the standard way to provide it: keep the turbine running, keep the shaft spinning, hold back some output in reserve for which the market would pay. It is important to note that the market pays not for the energy actually deployed but rather for the ability to deploy that energy when needed.

The fastest tier is **regulation** - the continuous, automatic product. A grid operator's automatic generation control system sends a dispatch signal every few seconds, instructing resources to increase or decrease output to follow real-time load fluctuations. A resource providing regulation up holds spare upward capacity and tracks that signal upward. Regulation down tracks it down. This continuous, automatic control is the grid's fine-tuning, running around the clock, rebalancing the system in real time as demand shifts by the minute.

Beyond regulation sits a product tier that did not exist until recently: **fast frequency response**. When frequency deviates sharply from its nominal value - 60 Hz in the US - the grid needs a response in hundreds of milliseconds, not minutes. No combustion turbine can do this - their physics related to thermal ramp rates makes it impossible. Fast frequency response is a product that markets had no way to procure until an asset class arrived that could actually deliver it.[[4]](#ref-4) Batteries are essentially the only technology in that category.

Regulation, spinning reserve, and non-spinning reserve all predate batteries. Thermal assets provided them, imperfectly, for decades. Batteries entered a market that was already paying for speed and found that they were simply better at it - faster response, symmetric in both directions, no fuel cost while holding reserve, no startup sequence required. And then, at the extreme end of the speed spectrum, they enabled a product tier that had no prior analogue.

The operational consequence is the same across all tiers. To respond in either direction - inject or absorb - a battery cannot be at the extremes of its state of charge. A fully discharged battery cannot inject power. A fully charged battery cannot absorb power. Providing ancillary services requires maintaining headroom: keeping state of charge within a band that preserves response capability in both directions, for the duration of the commitment. That reserved capacity cannot simultaneously be used for energy arbitrage. This is the first point of tension between the two functions.


## The Tension That Defines the Problem

Both Energy Arbitrage and Ancillary Services draw on the same physical resource, and herein lies the opportunity as well as the challenge for a BESS operator. 

Energy Arbitrage wants the battery to discharge deeply during the evening ramp to maximise arbitrage revenue. Ancillary services want the battery to stay mid-range - preserving headroom at both ends of the state of charge range for upward and downward response capability. A battery committed to regulation cannot simultaneously use that reserved capacity for energy trades. A battery discharged to 10% to capture an evening price spike cannot provide upward contingency reserve.

**[CHART 2: State of charge bands over 24 hours. Show three zones: the band reserved for upward ancillary response (top), the operational window available for energy arbitrage (middle), and the band reserved for downward ancillary response (bottom). Illustrate how the usable window for energy arbitrage narrows when ancillary service obligations are stacked on top.]**

The question of how to resolve this tension - when to hold reserve, when to trade energy, how much headroom to preserve - is the battery dispatch problem. Most organised markets handle it through real-time co-optimisation: the market-clearing engine simultaneously optimises energy dispatch and ancillary service commitments, accounting for the battery's state of charge in every settlement interval. PJM, MISO, and CAISO have all operated this way for years.[[5]](#ref-5) ERCOT was the notable exception - its prior market design cleared energy and ancillary services separately, and did not model battery state of charge in its dispatch engine. That changed in December 2025 with the introduction of RTC+B, which brought ERCOT's treatment of storage in line with what other markets had already been doing.[[6]](#ref-6)

The co-optimisation model changes the nature of the problem. A battery no longer commits to an ancillary service position for the day and works around it, re-optimising every few minutes, dynamically switching between energy and ancillary service positions as prices and system conditions evolve. The reserved headroom is not fixed - it shifts in real time based on what the market is willing to pay for each service at each moment. Although this increases flexibility, it also raises the bar for the optimization team running the battery. Static day-ahead bidding strategies leave significant revenue on the table, and the spread between a well-optimised and a poorly-optimised BESS has widened, not narrowed.

<em> The best will make more, the rest will make less.</em>

Some markets add a third layer on top of all of this: a formal capacity market, where generators and storage bid into an annual or multi-year auction and receive a payment simply for committing to be available during peak demand periods. PJM and MISO both operate capacity markets; batteries are eligible participants.[[7]](#ref-7) ERCOT does not - it is an energy-only market, where the equivalent value of being available at peak has historically been embedded in scarcity pricing. The revenue mechanics differ, but the underlying principle is the same: a battery that is available, charged, and positioned correctly when the grid is under maximum stress earns more than one that is not.

Research on grid storage dispatch modelling suggests that using suboptimal optimization approaches can reduce overall profit by 30–50% relative to the best achievable outcome - a range that reflects genuine operational differentiation between operators running sophisticated real-time systems and those that are not.[[8]](#ref-8)

The hardware is a commodity. The optimization is the differentiator. That has always been true. The move to real-time co-optimisation across markets has made it more true, not less.

---

## What Comes Next

We now know what a battery does and where the difficulty lies. Energy shifting captures the price spread between cheap and expensive hours. Ancillary services capture payments for speed and availability that the grid has always needed and only recently found a better supplier for. Both functions compete for the same state of charge, and the dispatch engine that resolves that competition in real time is what separates high-performing BESS assets from average ones.

The next two articles turn to the numbers. Article 3 focuses on energy arbitrage: how the charge-discharge cycle translates into a P&L, what the real spreads look like in ERCOT, and why round-trip efficiency determines the floor below which a cycle is not worth executing. Article 4 covers ancillary services: what markets pay for each tier, how stacking those payments changes the project economics, and what a full revenue stack actually looks like in practice.

By the end of Article 4, you will have both revenue-side inputs needed to evaluate whether a BESS project works. Article 5 adds the cost side - degradation - and Article 6 builds the full model.

---

## References

1. <a name="ref-1"></a>NREL Annual Technology Baseline 2024 - [Utility-Scale Battery Storage](https://atb.nrel.gov/electricity/2024/utility-scale_battery_storage)
2. <a name="ref-2"></a>Lazard - [Levelized Cost of Storage Analysis, Version 8.0](https://www.lazard.com/research-insights/2023-levelized-cost-of-energyplus/)
3. <a name="ref-3"></a>NERC - [Balancing and Frequency Control: A Technical Document](https://www.nerc.com/docs/oc/rs/NERC%20Balancing%20and%20Frequency%20Control%20040520111.pdf)
4. <a name="ref-4"></a>Oxford Academic / Clean Energy Journal - [Integrating Fast Frequency Response Ancillary Services: A Global Review](https://academic.oup.com/ce/article/9/2/204/7950656)
5. <a name="ref-5"></a>FERC - [Order No. 841: Electric Storage Participation in Markets Operated by Regional Transmission Organizations and Independent System Operators](https://www.ferc.gov/media/order-no-841)
6. <a name="ref-6"></a>Energy Storage News - [What to know about ERCOT's new RTC+B program](https://www.ess-news.com/2025/12/10/what-to-know-about-ercots-new-rtcb-program/)
7. <a name="ref-7"></a>Modo Energy - [ERCOT's Ancillary Services: A Beginner's Guide](https://modoenergy.com/research/en/ercot-ancillary-services-explainer)
8. <a name="ref-8"></a>Kumtepeli et al. (2024) - [Depreciation Cost is a Poor Proxy for Revenue Lost to Aging in Grid Storage Optimization](https://arxiv.org/pdf/2403.10617)

---

*Previous: [Article 1 - Why the Grid Needs Batteries](bess-why-grid-needs-batteries.html)*
*Next: [Article 3 - How a Battery Makes Money: Energy Arbitrage →](bess-energy-arbitrage.html)*