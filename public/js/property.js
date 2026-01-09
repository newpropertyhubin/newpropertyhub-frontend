// Property listing functionality
function fetchProperties(filters = {}) {
    const url = new URL('/api/properties', window.location.origin);
    Object.keys(filters).forEach(key => 
        url.searchParams.append(key, filters[key])
    );

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch properties');
            return res.json();
        })
        .then(data => {
            // Backend returns { properties, page, pages }, so we pass the array
            renderProperties(data.properties);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to load properties', 'error');
        });
}

function renderProperties(properties) {
    const grid = document.getElementById('propertyGrid');
    grid.innerHTML = '';

    if (properties.length === 0) {
        grid.innerHTML = '<li class="no-results">No properties found matching your criteria</li>';
        return;
    }

    properties.forEach(property => {
        const li = document.createElement('li');
        li.className = 'property-card';
        li.innerHTML = `
            <div class="property-image">
                <img src="${(property.images && property.images.length > 0) ? property.images[0] : 'img/placeholder.jpg'}" alt="${property.title}">
                ${property.featured ? '<span class="featured-badge">Featured</span>' : ''}
            </div>
            <div class="property-details">
                <h3 class="property-title">${property.title}</h3>
                <p class="property-location">
                    <i class="fas fa-map-marker-alt"></i> ${property.address?.city || 'N/A'}
                </p> 
                <div class="property-meta">
                    <span class="property-type">${property.propertyType}</span>
                    <span class="property-status">${property.listingType}</span>
                </div>
                <div class="property-features">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                    <span><i class="fas fa-chart-area"></i> ${property.area} sq.ft</span>
                </div>
                <div class="property-price">
                    <strong>₹${new Intl.NumberFormat('en-IN').format(property.price)}</strong>
                    ${property.listingType === 'rent' ? '/month' : ''}
                </div>
                <div class="property-actions">
                    <a href="property-details.html?id=${property._id}" class="btn btn-primary">View Details</a>
                    <button onclick="saveProperty('${property._id}')" class="btn btn-icon ${property.saved ? 'saved' : ''}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(li);
    });
}

function applyFilters() {
    const filters = {
        listingType: document.getElementById('listingType').value,
        propertyType: document.getElementById('propertyType').value,
        keyword: document.getElementById('searchInput').value, // Changed 'search' to 'keyword' to match backend
        amenities: Array.from(document.querySelectorAll('.amenityFilter:checked')).map(c => c.value),
        sortBy: document.getElementById('sortSelect').value
    };

    fetchProperties(filters);
}
window.applyFilters = applyFilters;

async function saveProperty(propertyId) {
    const token = localStorage.getItem('authToken'); // Use the correct token key 'authToken'
    if (!token) {
        showNotification('Please log in to save properties.', 'warning');
        // Optionally, redirect to the login page after a short delay
        // setTimeout(() => window.location.href = '/login.html', 1500);
        return;
    }

    try {
        // Use the correct, consistent endpoint that exists in userRoutes.js
        const response = await fetch('/api/users/save-property', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add the authentication token
            },
            body: JSON.stringify({ propertyId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to save property');
        }

        const button = document.querySelector(`button[onclick="saveProperty('${propertyId}')"]`);
        if (button) {
            button.classList.toggle('saved');
        }
        
        showNotification(data.message, 'success');
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to save property', 'error');
    }
}
window.saveProperty = saveProperty;
// Load property types for filter
fetch('/api/property-types')
    .then(res => res.json())
    .then(types => {
        const select = document.getElementById('propertyType');
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type._id;
            option.textContent = type.name;
            select.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading property types:', error));