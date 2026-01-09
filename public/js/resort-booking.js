// Resort booking functionality
let guestFields = {
    adults: 1,
    children: 0
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initDateValidation();
    initGuestFields();
    initFormValidation();
});

function initDateValidation() {
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    checkIn.addEventListener('change', function() {
        // Set minimum check-out date to day after check-in
        const minCheckOut = new Date(this.value);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        checkOut.min = minCheckOut.toISOString().split('T')[0];
        
        // Reset check-out if it's before new minimum
        if (checkOut.value && new Date(checkOut.value) <= new Date(this.value)) {
            checkOut.value = minCheckOut.toISOString().split('T')[0];
        }
    });
}

function initGuestFields() {
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    
    adultsInput.addEventListener('change', updateGuestFields);
    childrenInput.addEventListener('change', updateGuestFields);
}

function updateGuestFields() {
    const adults = parseInt(document.getElementById('adults').value);
    const children = parseInt(document.getElementById('children').value);
    const guestDetails = document.getElementById('guestDetails');
    
    guestFields = { adults, children };
    guestDetails.innerHTML = '';

    // Add fields for each adult
    for (let i = 0; i < adults; i++) {
        addGuestField('adult', i + 1);
    }

    // Add fields for each child
    for (let i = 0; i < children; i++) {
        addGuestField('child', i + 1);
    }
}

function addGuestField(type, num) {
    const guestDetails = document.getElementById('guestDetails');
    const div = document.createElement('div');
    div.className = 'guest-detail-group';
    
    div.innerHTML = `
        <h4>${type === 'adult' ? 'Adult' : 'Child'} ${num}</h4>
        <div class="form-grid">
            <div class="form-group">
                <label for="${type}${num}Name">Full Name:</label>
                <input type="text" id="${type}${num}Name" name="${type}Names[]" required>
            </div>
            <div class="form-group">
                <label for="${type}${num}Age">Age:</label>
                <input type="number" id="${type}${num}Age" name="${type}Ages[]" 
                    min="${type === 'adult' ? '18' : '0'}" 
                    max="120" required>
            </div>
        </div>
    `;
    
    guestDetails.appendChild(div);
}

function calculatePrice() {
    const checkIn = new Date(document.getElementById('checkIn').value);
    const checkOut = new Date(document.getElementById('checkOut').value);
    
    if (!checkIn || !checkOut || checkOut <= checkIn) {
        showNotification('Please select valid check-in and check-out dates', 'error');
        return;
    }

    const nights = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const basePrice = 2000; // Base price per night
    const adultPrice = 500; // Additional price per adult
    const childPrice = 250; // Additional price per child

    const total = (basePrice + 
        (guestFields.adults * adultPrice) + 
        (guestFields.children * childPrice)) * nights;

    const tax = total * 0.18; // 18% tax
    const grandTotal = total + tax;

    const priceDetails = document.getElementById('priceDetails');
    if (!priceDetails) return; // Guard clause if element doesn't exist
    priceDetails.innerHTML = `
        <h3>Price Details</h3>
        <div class="price-breakdown">
            <div class="price-row">
                <span>Base Price (${nights} nights)</span>
                <span>₹${basePrice * nights}</span>
            </div>
            <div class="price-row">
                <span>Adult Charges (${guestFields.adults} adults)</span>
                <span>₹${guestFields.adults * adultPrice * nights}</span>
            </div>
            ${guestFields.children ? `
                <div class="price-row">
                    <span>Child Charges (${guestFields.children} children)</span>
                    <span>₹${guestFields.children * childPrice * nights}</span>
                </div>
            ` : ''}
            <div class="price-row">
                <span>Subtotal</span>
                <span>₹${total}</span>
            </div>
            <div class="price-row">
                <span>Tax (18%)</span>
                <span>₹${tax}</span>
            </div>
            <div class="price-row total">
                <span>Grand Total</span>
                <span>₹${grandTotal}</span>
            </div>
        </div>
    `;
    priceDetails.style.display = 'block';
}
window.calculatePrice = calculatePrice;

function initFormValidation() {
    const form = document.getElementById('resortBookingForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const formData = new FormData(this);
        const idFile = document.getElementById('idProof').files[0];
        
        if (!idFile) {
            showNotification('Please upload an ID proof', 'error');
            return;
        }

        try {
            // First upload the ID proof
            const uploadResponse = await uploadFile(idFile);
            
            // Then submit the booking
            const bookingData = {
                ...Object.fromEntries(formData.entries()),
                idProofUrl: uploadResponse.url,
                status: 'pending' // Submit for admin approval
            };

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) throw new Error('Booking failed');

            const result = await response.json();
            showNotification(result.message || 'Booking successful!', 'success');
            form.reset();
            document.getElementById('priceDetails').style.display = 'none';
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Booking failed. Please try again.', 'error');
        }
    });
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/id-proof', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('File upload failed');
    return response.json();
}