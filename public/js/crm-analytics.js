document.addEventListener('DOMContentLoaded', () => {
    // Note: You might need to adjust this URL based on your production environment
    // Using a relative URL is better practice as it works for both development and production.
    const API_URL = '/api/crm/analytics';

    async function loadAnalyticsData() {
        try {
            // It's a good practice to include headers, especially if you add authentication later
            const token = localStorage.getItem('authToken'); // Get auth token for protected routes
            const response = await fetch(API_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if the endpoint is protected
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
            }
            const data = await response.json();

            renderKPIs(data.kpis);
            renderLeadsByStatusChart(data.leadsByStatus);
            renderLeadsBySourceChart(data.leadsBySource);
            renderStaffPerformanceChart(data.staffPerformance);

        } catch (error) {
            console.error('Error loading analytics:', error);
            const dashboard = document.getElementById('analyticsDashboard');
            if (dashboard) {
                dashboard.innerHTML = 
                    '<p class="error">Could not load analytics data. Please try again later.</p>';
            }
        }
    }

    function renderKPIs(kpis) {
        const kpiContainer = document.getElementById('kpiContainer');
        if (!kpiContainer) return;
        kpiContainer.innerHTML = `
            <div class="kpi-card">
                <h3>Total Leads</h3>
                <p class="kpi-value">${kpis.totalLeads || 0}</p>
            </div>
            <div class="kpi-card">
                <h3>Converted Leads</h3>
                <p class="kpi-value">${kpis.convertedLeads || 0}</p>
            </div>
            <div class="kpi-card">
                <h3>Conversion Rate</h3>
                <p class="kpi-value">${kpis.conversionRate || 0}%</p>
            </div>
        `;
    }

    function renderLeadsByStatusChart(data) {
        const ctx = document.getElementById('leadsByStatusChart')?.getContext('2d');
        if (!ctx || !data) return;
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Leads by Status',
                    data: Object.values(data),
                    backgroundColor: ['#007BFF', '#28a745', '#ffc107', '#dc3545', '#6c757d'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Leads Distribution by Status' }
                }
            }
        });
    }

    function renderLeadsBySourceChart(data) {
        const ctx = document.getElementById('leadsBySourceChart')?.getContext('2d');
        if (!ctx || !data) return;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Number of Leads',
                    data: Object.values(data),
                    backgroundColor: '#17a2b8'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Leads by Source' } }, scales: { y: { beginAtZero: true } } }
        });
    }

    function renderStaffPerformanceChart(data) {
        const ctx = document.getElementById('staffPerformanceChart')?.getContext('2d');
        if (!ctx || !data) return;
        
        const labels = data.map(staff => staff.staffName);
        const chartData = data.map(staff => staff.convertedLeads);

        new Chart(ctx, {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Converted Leads', data: chartData, backgroundColor: '#28a745', borderColor: '#218838', borderWidth: 1 }] },
            options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Staff Performance (Converted Leads)' } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
    }

    loadAnalyticsData();
});