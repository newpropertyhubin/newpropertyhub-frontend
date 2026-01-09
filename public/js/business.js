document.addEventListener("DOMContentLoaded", () => {
  console.log("Business Link page loaded");

  const businessContainer = document.getElementById('business-list'); 
  const searchInput = document.getElementById('businessSearch'); 
  const searchBtn = document.getElementById('searchBtn');
  const addBusinessForm = document.getElementById('addBusinessForm');

  // --- 1. Load Businesses (with optional search) ---
  async function loadBusinesses(keyword = '') {
    try {
      let url = "/api/business";
      if (keyword) {
        url += `?keyword=${encodeURIComponent(keyword)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch businesses");
      }
      const data = await res.json();
      console.log("Businesses Data:", data);

      // Backend returns { businesses: [...], page, pages }
      const businesses = data.businesses || [];

      renderBusinesses(businesses);
    } catch (error) {
      console.error("Error loading businesses:", error);
      if (businessContainer) {
        businessContainer.innerHTML = '<p>Error loading businesses. Please try again later.</p>';
      }
    }
  }

  // --- 2. Render Logic ---
  function renderBusinesses(businesses) {
    if (!businessContainer) return;

    if (!businesses || businesses.length === 0) {
      businessContainer.innerHTML = '<p>No businesses found. Be the first to post!</p>';
      return;
    }

    businessContainer.innerHTML = businesses.map(business => `
      <div class="business-card">
        <div class="business-img">
            <img src="${(business.media && business.media[0]) || '/images/default-business.jpg'}" 
                 alt="${business.name}" 
                 onerror="this.src='/images/default-business.jpg'">
        </div>
        <div class="business-info">
            <h3>${business.name}</h3>
            <div class="tags">
                <span class="badge" style="background:#eee; padding:2px 6px; border-radius:4px; font-size:0.8rem;">${business.type || 'General'}</span>
            </div>
            <p class="location"><strong>📍 Location:</strong> ${business.location || 'N/A'}</p>
            <p class="desc">${business.description || ''}</p>
            <div class="contact-actions">
                ${business.phone ? `<a href="tel:${business.phone}" class="btn">📞 Call: ${business.phone}</a>` : ''}
            </div>
        </div>
      </div>
    `).join('');
  }

  // --- 3. Search Event Listeners ---
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const keyword = searchInput ? searchInput.value : '';
      loadBusinesses(keyword);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        loadBusinesses(searchInput.value);
      }
    });
  }

  // --- 4. Add Business Form Submission ---
  if (addBusinessForm) {
    addBusinessForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Collect form data
      const formData = {
        name: document.getElementById('bizName')?.value,
        type: document.getElementById('bizType')?.value, // e.g., 'Selling', 'Partnership'
        phone: document.getElementById('bizPhone')?.value,
        location: document.getElementById('bizLocation')?.value,
        description: document.getElementById('bizDesc')?.value
      };

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to post your business.');
          window.location.href = '/login';
          return;
        }

        const res = await fetch('/api/business', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (res.ok) {
          alert('Business posted successfully!');
          addBusinessForm.reset();
          loadBusinesses(); // Refresh the list
        } else {
          alert(result.message || 'Failed to post business.');
        }
      } catch (error) {
        console.error('Error posting business:', error);
        alert('An error occurred while posting.');
      }
    });
  }

  // Initial Load
  loadBusinesses();
});