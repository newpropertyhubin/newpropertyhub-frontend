function applyFilters() {
    const keyword = document.getElementById('searchInput').value;
    const sortBy = document.getElementById('sortSelect').value;
    
    // Build the URL with query parameters for the backend
    const url = new URL('/api/properties', window.location.origin);
    if (keyword) {
        url.searchParams.append('keyword', keyword);
    }
    if (sortBy) {
        // Map frontend sort values to backend sortBy values
        const sortByMap = {
            'priceLow': 'price-asc',
            'priceHigh': 'price-desc',
            'newest': 'newest'
        };
        url.searchParams.append('sortBy', sortByMap[sortBy] || 'newest');
    }
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            // The backend now returns filtered and sorted data
            renderProperties(data.properties);
        })
        .catch(err => console.error('Error fetching properties:', err));
}
window.applyFilters = applyFilters;

function renderProperties(properties) {
    const grid = document.getElementById('propertyGrid');
    grid.innerHTML = '';

    if (!properties || properties.length === 0) {
        grid.innerHTML = '<li class="no-results">No properties found matching your criteria</li>';
        return;
    }

    properties.forEach(property => {
        const li = document.createElement('li');
        li.className = 'property-card'; // Using consistent class name
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