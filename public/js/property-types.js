// Property Types Management
document.addEventListener('DOMContentLoaded', function() {
    loadPropertyTypes();
    setupEventListeners();
});

function setupEventListeners() {
    // Add new property type
    document.getElementById('addTypeBtn').addEventListener('click', addPropertyType);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterPropertyTypes);
    
    // Sort functionality
    document.getElementById('sortSelect').addEventListener('change', sortPropertyTypes);
}

async function loadPropertyTypes() {
    try {
        const response = await fetch('/api/property-types');
        if (!response.ok) throw new Error('Failed to fetch property types');
        
        const types = await response.json();
        displayPropertyTypes(types);
    } catch (error) {
        console.error('Error loading property types:', error);
        showNotification('Error loading property types', 'error');
    }
}

async function addPropertyType() {
    const input = document.getElementById('newType');
    const typeName = input.value.trim();
    
    if (!typeName) {
        showNotification('Please enter a property type name', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/property-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: typeName })
        });
        
        if (!response.ok) throw new Error('Failed to add property type');
        
        const newType = await response.json();
        addTypeToTable(newType);
        input.value = '';
        showNotification('Property type added successfully', 'success');
    } catch (error) {
        console.error('Error adding property type:', error);
        showNotification('Error adding property type', 'error');
    }
}

async function deletePropertyType(id) {
    if (!confirm('Are you sure you want to delete this property type?')) return;
    
    try {
        const response = await fetch(`/api/property-types/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete property type');
        
        document.querySelector(`tr[data-id="${id}"]`).remove();
        showNotification('Property type deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting property type:', error);
        showNotification('Error deleting property type', 'error');
    }
}
window.deletePropertyType = deletePropertyType;

function displayPropertyTypes(types) {
    const tbody = document.querySelector('#typesTable tbody');
    tbody.innerHTML = '';
    
    types.forEach(type => addTypeToTable(type));
}

function addTypeToTable(type) {
    const tbody = document.querySelector('#typesTable tbody');
    const row = document.createElement('tr');
    row.dataset.id = type.id;
    
    row.innerHTML = `
        <td>${type.id}</td>
        <td>${type.name}</td>
        <td>${type.propertyCount || 0}</td>
        <td>${new Date(type.createdAt).toLocaleDateString()}</td>
        <td>
            <button onclick="editPropertyType('${type.id}')" class="btn btn-edit">Edit</button>
            <button onclick="deletePropertyType('${type.id}')" class="btn btn-delete">Delete</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

function filterPropertyTypes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#typesTable tbody tr');
    
    rows.forEach(row => {
        const typeName = row.children[1].textContent.toLowerCase();
        row.style.display = typeName.includes(searchTerm) ? '' : 'none';
    });
}

function sortPropertyTypes() {
    const sortBy = document.getElementById('sortSelect').value;
    const tbody = document.querySelector('#typesTable tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.children[1].textContent.localeCompare(b.children[1].textContent);
            case 'count':
                return parseInt(b.children[2].textContent) - parseInt(a.children[2].textContent);
            case 'newest':
                return new Date(b.children[3].textContent) - new Date(a.children[3].textContent);
            default:
                return 0;
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

function showNotification(message, type = 'info') {
    // You can implement a notification system here
    // For now, we'll use console.log
    console.log(`${type.toUpperCase()}: ${message}`);
}