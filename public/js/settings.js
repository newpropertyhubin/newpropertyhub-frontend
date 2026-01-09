document.addEventListener('DOMContentLoaded', () => {
    console.log("Settings page loaded");

    // HTML Elements
    const settingsForm = document.getElementById('settingsForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const themeSelect = document.getElementById('themeSelect');

    // --- 1. Load User Settings ---
    async function loadSettings() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Agar login nahi hai to login page par bhejein
                window.location.href = '/login';
                return;
            }

            const res = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const user = await res.json();
                // Form fields fill karein
                if (profileName) profileName.value = user.name || '';
                if (profileEmail) profileEmail.value = user.email || '';
                if (profilePhone) profilePhone.value = user.phone || '';
                if (themeSelect) themeSelect.value = user.theme || 'light';
                
                // Theme apply karein
                document.documentElement.setAttribute('data-theme', user.theme || 'light');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    if (settingsForm || themeSelect) {
        loadSettings();
    }

    // --- 2. Update Profile Handler ---
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const updatedData = {
                name: profileName.value,
                phone: profilePhone.value,
                // Email usually update nahi hota direct API se security reasons ke liye
            };

            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/users/profile', {
                    method: 'PUT', // Make sure backend has this route
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                const data = await res.json();
                if (res.ok) {
                    alert('Profile updated successfully!');
                } else {
                    alert(data.message || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Error updating settings:', error);
                alert('An error occurred while updating profile.');
            }
        });
    }

    // --- 3. Theme Change Handler ---
    if (themeSelect) {
        themeSelect.addEventListener('change', async (e) => {
            const newTheme = e.target.value;
            
            // Frontend par turant change dikhayein
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('selectedTheme', newTheme);

            // Backend par save karein
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await fetch('/api/users/theme', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ theme: newTheme })
                    });
                }
            } catch (error) {
                console.error('Error saving theme:', error);
            }
        });
    }
});