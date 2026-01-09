document.addEventListener("DOMContentLoaded", () => {
  console.log("Investor page loaded");

  // --- 1. Investor Registration Form Handling ---
  const investorForm = document.getElementById('investorForm');
  
  if (investorForm) {
    investorForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = {
        name: document.getElementById('investorName')?.value,
        email: document.getElementById('investorEmail')?.value,
        phone: document.getElementById('investorPhone')?.value,
        state: document.getElementById('investorState')?.value,
        city: document.getElementById('investorCity')?.value,
        budget: document.getElementById('investorBudget')?.value,
        interests: document.getElementById('investorInterests')?.value, // e.g., "Commercial, Retail"
      };

      // Basic Validation
      if (!formData.name || !formData.phone || !formData.state) {
        alert("Please fill in Name, Phone, and State.");
        return;
      }

      try {
        const res = await fetch("/api/investors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (res.ok) {
          alert("Thank you! Your investor profile has been created. We will notify you when matching properties arrive.");
          investorForm.reset();
          loadInvestors(); // Refresh list if visible
        } else {
          alert(result.message || "Failed to register.");
        }
      } catch (error) {
        console.error("Error registering investor:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }

  // --- 2. Load Existing Investors (Networking Section) ---
  const investorList = document.getElementById('investor-list');

  async function loadInvestors() {
    if (!investorList) return; // Only run if the list container exists

    try {
      const res = await fetch("/api/investors");
      const data = await res.json();
      
      // Handle response structure { investors: [], page: 1, ... }
      const investors = data.investors || [];

      if (investors.length === 0) {
        investorList.innerHTML = '<p>No active investors found.</p>';
        return;
      }

      investorList.innerHTML = investors.map(investor => `
        <div class="investor-card">
            <h3>${investor.name}</h3>
            <p><strong>Location:</strong> ${investor.city ? investor.city + ', ' : ''}${investor.state}</p>
            <p><strong>Looking for:</strong> ${investor.interests || 'General Investment'}</p>
            ${investor.budget ? `<p><strong>Budget:</strong> ₹${investor.budget}</p>` : ''}
            <button onclick="contactInvestor('${investor._id}')" class="btn-contact">Connect</button>
        </div>
      `).join('');
      
    } catch (error) {
      console.error("Error loading investors:", error);
      investorList.innerHTML = '<p>Error loading investor list.</p>';
    }
  }

  loadInvestors();
});