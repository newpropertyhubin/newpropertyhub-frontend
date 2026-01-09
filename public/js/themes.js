function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("selectedTheme", theme);

  // Optional backend call to track popularity
  /*
  fetch("/api/user/theme", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ theme })
  });
  */
}
window.changeTheme = changeTheme;

function toggleTheme() {
    const currentTheme = localStorage.getItem('selectedTheme') || 'light';
    const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    setTheme(newTheme);
}
window.toggleTheme = toggleTheme;

function setTheme(themeName) {
    localStorage.setItem('selectedTheme', themeName);
    document.documentElement.setAttribute('data-theme', themeName);

    // Update theme selector dropdown if it exists
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.value = themeName;
    }

    // Update toggle button icon if it exists
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        const icon = themeToggleButton.querySelector('i');
        if (icon) {
            if (themeName === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    }
}

function loadSiteSettings() {
    fetch('/api/settings')
        .then(res => res.json())
        .then(settings => {
            const websiteName = settings.name || 'NewPropertyHub';
            document.querySelectorAll('#website-name, #footer-website-name').forEach(el => el.innerText = websiteName);
            
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor || '#007bff');
            document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor || '#f4f4f4');
        })
        .catch(err => console.error('Failed to load settings:', err));
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("selectedTheme") || "light";
    setTheme(savedTheme);
    loadSiteSettings();
});

// ====== ADMIN CUSTOMIZATION ======
function updateSiteSettings({ siteName, logoUrl, primaryColor }) {
  if (siteName) document.getElementById("siteTitle").textContent = siteName;
  if (logoUrl) document.getElementById("siteLogo").src = logoUrl;
  if (primaryColor) {
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--header-bg-color", primaryColor);
  }

  // Optional: Save these settings to backend
  /*
  fetch("/api/admin/settings", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ siteName, logoUrl, primaryColor })
  });
  */
}
window.updateSiteSettings = updateSiteSettings;