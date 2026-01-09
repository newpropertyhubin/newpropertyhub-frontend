console.log("main.js loaded");

/* -------------------------------
   Global Notification Function
--------------------------------*/
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    // You need to add styles for .notification in your CSS
    notification.className = `notification ${type}`; 
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function shareProperty() {
  if (navigator.share) {
    navigator.share({ title: 'Property from NewPropertyHub', url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => showNotification('Link copied to clipboard!', 'success'));
  }
}
window.shareProperty = shareProperty;

/* -------------------------------
   About Page Functions
--------------------------------*/
async function loadAboutContent() {
  try {
    const res = await fetch('/api/cms/about');
    if (!res.ok) throw new Error('Backend not connected');
    const data = await res.json();
    document.getElementById('aboutContent').innerHTML = data.content;
  } catch (err) {
    console.error("Failed to load 'About Us' content:", err);
    const fallbackContent = "<p><b>Welcome to NewPropertyHub!</b><br>We connect builders, brokers, and customers with transparency and trust.</p>";
    document.getElementById('aboutContent').innerHTML = fallbackContent;
  }
}

/* -------------------------------
   Contact Page Functions
--------------------------------*/
function initializeContactPage() {
  // This data could eventually be fetched from a settings API endpoint
  const contactPhoneForWhatsapp = "+917828289433";
  const contactEmail = "support@newpropertyhub.in";
  
  document.getElementById('contactEmail').textContent = contactEmail;
  document.getElementById('whatsappLink').href = "https://wa.me/" + contactPhoneForWhatsapp.replace(/\D/g, '');

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }
}

async function handleContactFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/cms/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    showNotification(result.message || 'Message sent successfully!', 'success');
    form.reset();
  } catch (error) {
    console.error(error);
    showNotification('Failed to send message. Please try again later.', 'error');
  }
}

// Run page-specific initializers
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('aboutContent')) {
    loadAboutContent();
  }
  if (document.getElementById('contactForm')) {
    initializeContactPage();
  }
});