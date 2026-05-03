// Chart.js Interop for Advanced Visualizations
// Requires Chart.js library

window.chartInterop = {
    charts: {},

    // Create a line chart
    createLineChart: function (canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error('Canvas element not found:', canvasId);
            return false;
        }

        // Destroy existing chart if it exists
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(ctx, {
                type: 'line',
                data: config.data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: config.showLegend !== false,
                            position: config.legendPosition || 'top'
                        },
                        title: {
                            display: !!config.title,
                            text: config.title || ''
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: !!config.xAxisTitle,
                                text: config.xAxisTitle || ''
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: !!config.yAxisTitle,
                                text: config.yAxisTitle || ''
                            },
                            beginAtZero: config.beginAtZero !== false
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
            return true;
        } catch (error) {
            console.error('Error creating line chart:', error);
            return false;
        }
    },

    // Create a bar chart
    createBarChart: function (canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error('Canvas element not found:', canvasId);
            return false;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(ctx, {
                type: 'bar',
                data: config.data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: config.showLegend !== false,
                            position: config.legendPosition || 'top'
                        },
                        title: {
                            display: !!config.title,
                            text: config.title || ''
                        }
                    },
                    scales: {
                        x: {
                            stacked: config.stacked || false,
                            title: {
                                display: !!config.xAxisTitle,
                                text: config.xAxisTitle || ''
                            }
                        },
                        y: {
                            stacked: config.stacked || false,
                            title: {
                                display: !!config.yAxisTitle,
                                text: config.yAxisTitle || ''
                            },
                            beginAtZero: config.beginAtZero !== false
                        }
                    }
                }
            });
            return true;
        } catch (error) {
            console.error('Error creating bar chart:', error);
            return false;
        }
    },

    // Create a pie/doughnut chart
    createPieChart: function (canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error('Canvas element not found:', canvasId);
            return false;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(ctx, {
                type: config.isDoughnut ? 'doughnut' : 'pie',
                data: config.data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: config.showLegend !== false,
                            position: config.legendPosition || 'right'
                        },
                        title: {
                            display: !!config.title,
                            text: config.title || ''
                        }
                    }
                }
            });
            return true;
        } catch (error) {
            console.error('Error creating pie chart:', error);
            return false;
        }
    },

    // Create a radar chart
    createRadarChart: function (canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error('Canvas element not found:', canvasId);
            return false;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(ctx, {
                type: 'radar',
                data: config.data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: config.showLegend !== false,
                            position: config.legendPosition || 'top'
                        },
                        title: {
                            display: !!config.title,
                            text: config.title || ''
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true
                        }
                    }
                }
            });
            return true;
        } catch (error) {
            console.error('Error creating radar chart:', error);
            return false;
        }
    },

    // Create a scatter plot
    createScatterChart: function (canvasId, config) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) {
            console.error('Canvas element not found:', canvasId);
            return false;
        }

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        try {
            this.charts[canvasId] = new Chart(ctx, {
                type: 'scatter',
                data: config.data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: config.showLegend !== false,
                            position: config.legendPosition || 'top'
                        },
                        title: {
                            display: !!config.title,
                            text: config.title || ''
                        }
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: !!config.xAxisTitle,
                                text: config.xAxisTitle || ''
                            }
                        },
                        y: {
                            title: {
                                display: !!config.yAxisTitle,
                                text: config.yAxisTitle || ''
                            }
                        }
                    }
                }
            });
            return true;
        } catch (error) {
            console.error('Error creating scatter chart:', error);
            return false;
        }
    },

    // Update chart data
    updateChart: function (canvasId, newData) {
        if (!this.charts[canvasId]) {
            console.error('Chart not found:', canvasId);
            return false;
        }

        try {
            this.charts[canvasId].data = newData;
            this.charts[canvasId].update();
            return true;
        } catch (error) {
            console.error('Error updating chart:', error);
            return false;
        }
    },

    // Destroy chart
    destroyChart: function (canvasId) {
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
            delete this.charts[canvasId];
            return true;
        }
        return false;
    },

    // Destroy all charts
    destroyAllCharts: function () {
        Object.keys(this.charts).forEach(canvasId => {
            this.charts[canvasId].destroy();
        });
        this.charts = {};
    }
};
