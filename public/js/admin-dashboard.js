document.addEventListener("DOMContentLoaded", () => {
    console.log("Admin Dashboard JS Loaded");

    // --- Load Initial Data ---
    async function loadDashboardData() {
        try {
            // Fetch real data from the backend
            const response = await fetch('/api/admin/dashboard-summary');
            if (!response.ok) throw new Error('Failed to fetch dashboard summary');
            const summaryData = await response.json();

            document.getElementById('totalUsers').textContent = summaryData.totalUsers;
            document.getElementById('totalProperties').textContent = summaryData.totalProperties;
            document.getElementById('pendingApprovals').textContent = summaryData.pendingApprovals;
            document.getElementById('totalLeads').textContent = summaryData.totalLeads;

            if (summaryData.userRegistrations) {
                renderUserRegistrationChart(summaryData.userRegistrations);
            }
            if (summaryData.propertyTypes) {
                renderPropertyTypeChart(summaryData.propertyTypes);
            }

        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        }
    }

    // --- Chart Rendering ---
    function renderUserRegistrationChart(data) {
        const ctx = document.getElementById('userRegistrationChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'User Types',
                    data: Object.values(data),
                    backgroundColor: ['#3949ab', '#1e88e5', '#039be5']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    function renderPropertyTypeChart(data) {
        const ctx = document.getElementById('propertyTypeChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: 'Listings',
                    data: Object.values(data),
                    backgroundColor: '#7cb342'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // --- Settings Form ---
    const settingsForm = document.getElementById('settingsForm');
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const settings = {
            siteName: document.getElementById('siteName').value,
            primaryColor: document.getElementById('primaryColor').value,
            razorpay: {
                key_id: document.getElementById('razorpayKey').value,
                key_secret: document.getElementById('razorpaySecret').value
            },
            maps: {
                provider: document.getElementById('mapProvider').value,
                google: document.getElementById('googleMapsKey').value,
                mapbox: document.getElementById('mapboxKey').value,
                ola: document.getElementById('olaMapsKey').value
            }
        };

        try {
            // This would be a new API endpoint, e.g., /api/admin/settings
            const response = await fetch('/api/admin/settings', { // This should match your adminRoutes.js
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to save settings');
            
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Error saving settings. Please check the console.');
        }
    });

    // --- Initial Load ---
    loadDashboardData();
});