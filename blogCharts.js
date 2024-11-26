// Revenue comparison chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
            datasets: [{
                label: '2023 Revenue',
                data: [3.1859,
                    3.9015,
                    5.5568,
                    4.9535,
                    4.1949,
                    28.7787,
                    14.7204,
                    109.0192,
                    26.3488,
                    7.8159,
                    5.1369,
                    2.5706,
                    ],
                backgroundColor: '#45913F',
                borderColor: '#45913F',
                borderWidth: 0.5
            },
            {
                label: '2024 Revenue',
                data: [10.5913,
                    1.72,
                    4.3189,
                    7.0643,
                    16.4758,
                    4.9586,
                    2.7254,
                    9.3342,
                    0.0,
                    0.0,
                    0.0,
                    0.0,                    
                    ],
                borderColor: '#8ebd9e',
                backgroundColor: '#8ebd9e',
                borderWidth: 0.5

            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw} per kW-month`;
                        }
                    }
                },
                title: {
                    display: false,
                    text: 'Revenue Comparison ($/kW-month)'
                }
            },
            scales: {
                x:{
                    stacked: false,
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    min:0,
                    title: {
                        display: true,
                        text: '$/kW-month'
                    },
                    grid:{
                        display:false
                    }
                }
            }
        }
    });
}

//Function to create Price chart
function createPriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
            datasets: [{
                label: 'ECRS',
                data: [88.90,
                    32.77,
                    228.33,
                    40.10,
                    12.40,
                    9.35,
                    2.98,
                    18.80,
                    2.37,
                    5.67,
                    9.56,
                    29.72,
                    9.13,
                    3.27,
                    9.21,
                    2.04,
                    4.42,
                    
                    ],
                backgroundColor: '#45913F',
                borderColor: '#45913F',
                borderWidth: 0.5
            },
            {
                label: 'RRS',
                data: [37.14,
                    16.99,
                    122.11,
                    31.10,
                    11.23,
                    7.87,
                    2.52,
                    17.85,
                    1.75,
                    4.02,
                    6.56,
                    12.42,
                    3.30,
                    2.68,
                    8.25,
                    2.13,
                    4.55,
                                     
                    ],
                borderColor: '#8ebd9e',
                backgroundColor: '#8ebd9e',
                borderWidth: 0.5

            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw} per MWh`;
                        }
                    }
                },
                title: {
                    display: false,
                    text: 'Price Comparison ($/MWh)'
                }
            },
            scales: {
                x:{
                    stacked: false,
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    min:0,
                    title: {
                        display: true,
                        text: '$/MWh'
                    },
                    grid:{
                        display:false
                    }
                }
            }
        }
    });
}

//Function to create Price chart
function createBattCompChart() {
    const ctx = document.getElementById('battcompChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
                label: '2H BESS',
                data: [11.53,
                    2.11,
                    5.56,
                    8.81,
                    19.79,
                    5.99,
                    3.14,
                    10.46,                    
                    ],
                backgroundColor: '#45913F',
                borderColor: '#45913F',
                borderWidth: 0.5
            },
            {
                label: '1H BESS',
                data: [9.61,
                    1.31,
                    3.07,
                    5.55,
                    13.45,
                    3.96,
                    2.22,
                    7.75,         
                    ],
                borderColor: '#8ebd9e',
                backgroundColor: '#8ebd9e',
                borderWidth: 0.5

            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.raw} per KW-mo`;
                        }
                    }
                },
                title: {
                    display: false,
                    text: 'Revenue Comparison ($/KW-mo)'
                }
            },
            scales: {
                x:{
                    stacked: false,
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    min:0,
                    title: {
                        display: true,
                        text: '$/KW-mo'
                    },
                    grid:{
                        display:false
                    }
                }
            }
        }
    });
}


// Function to create a 100% stacked bar chart
function createStackedBarChart() {
    const ctx = document.getElementById('stackedBarChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan-2023', 'Feb-2023', 'Mar-2023', 'Apr-2023', 'May-2023', 'Jun-2023', 'Jul-2023', 'Aug-2023', 
                     'Sep-2023', 'Oct-2023', 'Nov-2023', 'Dec-2023', 'Jan-2024', 'Feb-2024', 'Mar-2024', 'Apr-2024', 
                     'May-2024', 'Jun-2024', 'Jul-2024', 'Aug-2024'],
            datasets: [{
                label: 'Energy Revenue',
                data: [18.6,
                    10.8,
                    30.2,
                    30.6,
                    35.2,
                    16.6,
                    16.8,
                    16.2,
                    27.4,
                    2.9,
                    13.4,
                    43.7,
                    12.5,
                    49.4,
                    45.3,
                    50.4,
                    29.7,
                    35.9,
                    53.6,
                    62.9,
                    ],
                backgroundColor: '#45913F',
            }, {
                label: 'Ancillary Revenue',
                data: [81.4,
                    89.2,
                    69.8,
                    69.4,
                    64.8,
                    83.4,
                    83.2,
                    83.8,
                    72.6,
                    97.1,
                    86.6,
                    56.3,
                    87.5,
                    50.6,
                    54.7,
                    49.6,
                    70.3,
                    64.1,
                    46.4,
                    37.1,
                    ],
                backgroundColor: '#8ebd9e',
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(2);
                            return `${context.dataset.label}: ${percentage}%`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: '100% Stacked Bar Chart'
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false,
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Function to prepare monthly data from hourly data
function prepareMonthlyData(data) {
    const dailyData = {};
    const monthlyMax = {};

    // First, aggregate hourly data to daily averages and track monthly max
    data.forEach(entry => {
        const date = new Date(entry.date);
        const day = date.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
        const load = entry.load;

        // Track daily data
        if (!dailyData[day]) {
            dailyData[day] = { total: 0, count: 0 };
        }
        dailyData[day].total += load; // Sum loads for the day
        dailyData[day].count += 1; // Count the number of entries for averaging

        // Track monthly max
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();
        const monthKey = `${year}-${month}`;

        if (!monthlyMax[monthKey]) {
            monthlyMax[monthKey] = load; // Initialize with the first load value
        } else {
            monthlyMax[monthKey] = Math.max(monthlyMax[monthKey], load); // Update max if current load is greater
        }
    });

    // Now, calculate monthly averages
    const monthlyData = {};
    for (const day in dailyData) {
        const date = new Date(day);
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();

        if (!monthlyData[year]) {
            monthlyData[year] = {
                monthly_avg: Array(12).fill(0),
                counts: Array(12).fill(0) // To count the number of days for averaging
            };
        }

        const dailyAvg = dailyData[day].total / dailyData[day].count; // Calculate daily average
        monthlyData[year].monthly_avg[month] += dailyAvg; // Sum daily averages for the month
        monthlyData[year].counts[month] += 1; // Count the number of days
    }
    // Calculate final monthly averages and add max values
    for (const year in monthlyData) {
        monthlyData[year].monthly_max = Array(12).fill(0); // Initialize max array
        for (let month = 0; month < 12; month++) {
            if (monthlyData[year].counts[month] > 0) {
                monthlyData[year].monthly_avg[month] /= monthlyData[year].counts[month]; // Average
            }
            // Set the max value for the month from the monthlyMax object
            monthlyData[year].monthly_max[month] = monthlyMax[`${year}-${month}`] || 0; // Default to 0 if no data
        }
    }

    return monthlyData;
}
// Function to fetch data and create the chart
async function fetchDataAndCreateChart() {
    try {
        // Fetch data for both years
        const response23 = await fetch('./chartdata/loaddata_2023.json');
        const response24 = await fetch('./chartdata/loaddata_2024.json');
        
        const df23 = await response23.json();
        const df24 = await response24.json();

        // Prepare monthly data for both years
        const monthlyData23 = prepareMonthlyData(df23);
        const monthlyData24 = prepareMonthlyData(df24);

        // Prepare x-axis labels and data arrays
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'];

        const avg23 = monthlyData23[2023].monthly_avg;
        const avg24 = monthlyData24[2024].monthly_avg;
        const max23 = monthlyData23[2023].monthly_max; // Ensure this is an array
        const max24 = monthlyData24[2024].monthly_max; // Ensure this is an array

        // Create Chart.js figure
        const ctx = document.getElementById('monthlyDemandChart').getContext('2d');

        const monthlyDemandChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: allMonths,
                datasets: [
                    {
                        label: '2023 Avg',
                        data: avg23,
                        backgroundColor: 'rgba(69, 145, 63, 0.7)',
                        borderColor: 'rgba(69, 145, 63, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: '2024 Avg',
                        data: avg24,
                        backgroundColor: 'rgba(142, 189, 158, 0.7)',
                        borderColor: 'rgba(142, 189, 158, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: '2023 Max',
                        data: max23,
                        type: 'line', // Change to line chart
                        borderColor: 'rgba(69, 145, 63, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
                        fill: false,
                        tension: 0.1,
                        borderWidth: 1,
                        pointRadius: 1, // Show markers
                    },
                    {
                        label: '2024 Max',
                        data: max24,
                        type: 'line', // Change to line chart
                        borderColor: 'rgba(142, 189, 158, 1)',
                        backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
                        fill: false,
                        tension: 0.05,
                        borderWidth: 1,
                        pointRadius: 1, // Show markers
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} GW`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Monthly Demand Comparison: 2023 vs 2024'
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        grid: {
                            display: false,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Demand (GW)'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to fetch data and create the chart

// Initialize all charts when the document loads
document.addEventListener('DOMContentLoaded', () => {
    createRevenueChart();
    createPriceChart();
    createBattCompChart();
    createStackedBarChart();
    fetchDataAndCreateChart();
});