// Chart.js Configuration for Editorial Theme
// Color palette matching the new design system

const chartColors = {
    primary: '#2E5A3A',      // Deep forest green
    secondary: '#5B8A5F',    // Medium green
    tertiary: '#8CB892',     // Light green
    accent: '#5C2E0B',       // Warm brown
    accentLight: '#D4A574',  // Warm amber
    text: '#4A4A4A',
    textMuted: '#6B6B6B',
    grid: 'rgba(26, 26, 26, 0.08)',
    background: '#F8F5F1'
};

// Set global Chart.js defaults
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = chartColors.text;

// Revenue comparison chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: '2023 Revenue',
                data: [3.19, 3.90, 5.56, 4.95, 4.19, 28.78, 14.72, 109.02, 26.35, 7.82, 5.14, 2.57],
                backgroundColor: chartColors.primary,
                borderColor: chartColors.primary,
                borderWidth: 0,
                borderRadius: 4
            },
            {
                label: '2024 Revenue',
                data: [10.59, 1.72, 4.32, 7.06, 16.48, 4.96, 2.73, 9.33, 0, 0, 0, 0],
                backgroundColor: chartColors.secondary,
                borderColor: chartColors.secondary,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toFixed(2)} per kW-month`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '$/kW-month',
                        font: { size: 11, weight: '500' }
                    },
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Price chart
function createPriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jun-23', 'Jul-23', 'Aug-23', 'Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24', 'May-24', 'Jun-24', 'Jul-24', 'Aug-24'],
            datasets: [{
                label: 'ECRS',
                data: [88.90, 32.77, 228.33, 40.10, 12.40, 9.35, 2.98, 18.80, 2.37, 5.67, 9.56, 29.72, 9.13, 3.27, 9.21],
                backgroundColor: chartColors.primary,
                borderColor: chartColors.primary,
                borderWidth: 0,
                borderRadius: 4
            },
            {
                label: 'RRS',
                data: [37.14, 16.99, 122.11, 31.10, 11.23, 7.87, 2.52, 17.85, 1.75, 4.02, 6.56, 12.42, 3.30, 2.68, 8.25],
                backgroundColor: chartColors.secondary,
                borderColor: chartColors.secondary,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toFixed(2)} per MWh`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '$/MWh',
                        font: { size: 11, weight: '500' }
                    },
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Battery comparison chart
function createBattCompChart() {
    const ctx = document.getElementById('battcompChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: '2-Hour BESS',
                data: [11.53, 2.11, 5.56, 8.81, 19.79, 5.99, 3.14, 10.46],
                backgroundColor: chartColors.primary,
                borderColor: chartColors.primary,
                borderWidth: 0,
                borderRadius: 4
            },
            {
                label: '1-Hour BESS',
                data: [9.61, 1.31, 3.07, 5.55, 13.45, 3.96, 2.22, 7.75],
                backgroundColor: chartColors.secondary,
                borderColor: chartColors.secondary,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw.toFixed(2)} per kW-month`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '$/kW-month',
                        font: { size: 11, weight: '500' }
                    },
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Stacked bar chart for revenue composition
function createStackedBarChart() {
    const ctx = document.getElementById('stackedBarChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan-23', 'Feb-23', 'Mar-23', 'Apr-23', 'May-23', 'Jun-23', 'Jul-23', 'Aug-23',
                     'Sep-23', 'Oct-23', 'Nov-23', 'Dec-23', 'Jan-24', 'Feb-24', 'Mar-24', 'Apr-24',
                     'May-24', 'Jun-24', 'Jul-24', 'Aug-24'],
            datasets: [{
                label: 'Energy Revenue',
                data: [18.6, 10.8, 30.2, 30.6, 35.2, 16.6, 16.8, 16.2, 27.4, 2.9, 13.4, 43.7,
                       12.5, 49.4, 45.3, 50.4, 29.7, 35.9, 53.6, 62.9],
                backgroundColor: chartColors.accent,
                borderRadius: 0
            }, {
                label: 'Ancillary Revenue',
                data: [81.4, 89.2, 69.8, 69.4, 64.8, 83.4, 83.2, 83.8, 72.6, 97.1, 86.6, 56.3,
                       87.5, 50.6, 54.7, 49.6, 70.3, 64.1, 46.4, 37.1],
                backgroundColor: chartColors.accentLight,
                borderRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: {
                        font: { size: 10 },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage (%)',
                        font: { size: 11, weight: '500' }
                    },
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

// Monthly demand chart with data fetch
function prepareMonthlyData(data) {
    const dailyData = {};
    const monthlyMax = {};

    data.forEach(entry => {
        const date = new Date(entry.date);
        const day = date.toISOString().split('T')[0];
        const load = entry.load;

        if (!dailyData[day]) {
            dailyData[day] = { total: 0, count: 0 };
        }
        dailyData[day].total += load;
        dailyData[day].count += 1;

        const month = date.getMonth();
        const year = date.getFullYear();
        const monthKey = `${year}-${month}`;

        if (!monthlyMax[monthKey]) {
            monthlyMax[monthKey] = load;
        } else {
            monthlyMax[monthKey] = Math.max(monthlyMax[monthKey], load);
        }
    });

    const monthlyData = {};
    for (const day in dailyData) {
        const date = new Date(day);
        const month = date.getMonth();
        const year = date.getFullYear();

        if (!monthlyData[year]) {
            monthlyData[year] = {
                monthly_avg: Array(12).fill(0),
                counts: Array(12).fill(0)
            };
        }

        const dailyAvg = dailyData[day].total / dailyData[day].count;
        monthlyData[year].monthly_avg[month] += dailyAvg;
        monthlyData[year].counts[month] += 1;
    }

    for (const year in monthlyData) {
        monthlyData[year].monthly_max = Array(12).fill(0);
        for (let month = 0; month < 12; month++) {
            if (monthlyData[year].counts[month] > 0) {
                monthlyData[year].monthly_avg[month] /= monthlyData[year].counts[month];
            }
            monthlyData[year].monthly_max[month] = monthlyMax[`${year}-${month}`] || 0;
        }
    }

    return monthlyData;
}

async function fetchDataAndCreateChart() {
    const ctx = document.getElementById('monthlyDemandChart');
    if (!ctx) return;

    try {
        const response23 = await fetch('./chartdata/loaddata_2023.json');
        const response24 = await fetch('./chartdata/loaddata_2024.json');

        const df23 = await response23.json();
        const df24 = await response24.json();

        const monthlyData23 = prepareMonthlyData(df23);
        const monthlyData24 = prepareMonthlyData(df24);

        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const avg23 = monthlyData23[2023]?.monthly_avg || Array(12).fill(0);
        const avg24 = monthlyData24[2024]?.monthly_avg || Array(12).fill(0);
        const max23 = monthlyData23[2023]?.monthly_max || Array(12).fill(0);
        const max24 = monthlyData24[2024]?.monthly_max || Array(12).fill(0);

        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: allMonths,
                datasets: [
                    {
                        label: '2023 Avg',
                        data: avg23,
                        backgroundColor: chartColors.primary,
                        borderRadius: 4
                    },
                    {
                        label: '2024 Avg',
                        data: avg24,
                        backgroundColor: chartColors.secondary,
                        borderRadius: 4
                    },
                    {
                        label: '2023 Max',
                        data: max23,
                        type: 'line',
                        borderColor: chartColors.primary,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: chartColors.primary,
                        tension: 0.3
                    },
                    {
                        label: '2024 Max',
                        data: max24,
                        type: 'line',
                        borderColor: chartColors.secondary,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: chartColors.secondary,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleFont: { size: 13, weight: '600' },
                        bodyFont: { size: 12 },
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} GW`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Demand (GW)',
                            font: { size: 11, weight: '500' }
                        },
                        grid: {
                            color: chartColors.grid
                        },
                        ticks: { font: { size: 11 } }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching demand data:', error);
    }
}

// Initialize all charts when the document loads
document.addEventListener('DOMContentLoaded', () => {
    createRevenueChart();
    createPriceChart();
    createBattCompChart();
    createStackedBarChart();
    fetchDataAndCreateChart();
});
