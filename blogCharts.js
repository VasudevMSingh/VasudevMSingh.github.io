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

// Initialize all charts when the document loads
document.addEventListener('DOMContentLoaded', () => {
    createRevenueChart();
});