// Generate QR Code for guest
function generateQRCode(guestId, guestData) {
    const qrContainer = document.createElement('div');
    const qrCode = new QRCode(qrContainer, {
        text: JSON.stringify({
            id: guestId,
            name: guestData.name,
            email: guestData.email,
            event: guestData.eventId,
            timestamp: Date.now()
        }),
        width: 200,
        height: 200,
        colorDark: "#6c5ce7",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    return qrContainer.innerHTML;
}

// Guest list management
let guests = [];

function addGuest() {
    const name = document.getElementById('guestName').value;
    const email = document.getElementById('guestEmail').value;
    
    if (!name || !email) {
        Toast.show('Please fill in guest details', 'error');
        return;
    }
    
    if (!FormValidator.validateEmail(email)) {
        Toast.show('Invalid email format', 'error');
        return;
    }
    
    const guest = {
        id: Date.now() + Math.random(),
        name,
        email,
        qrCode: `QR-${Date.now()}-${guests.length}`
    };
    
    guests.push(guest);
    updateGuestList();
    
    document.getElementById('guestName').value = '';
    document.getElementById('guestEmail').value = '';
    
    Toast.show('Guest added successfully', 'success');
}

function updateGuestList() {
    const preview = document.getElementById('guestListPreview');
    const count = document.getElementById('guestCount');
    
    if (preview) {
        preview.innerHTML = guests.map((guest, index) => `
            <div class="guest-item d-flex justify-content-between align-items-center mb-2 p-2 glass-card">
                <div>
                    <strong>${guest.name}</strong>
                    <br>
                    <small>${guest.email}</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeGuest(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    if (count) {
        count.textContent = guests.length;
    }
}

function removeGuest(index) {
    guests.splice(index, 1);
    updateGuestList();
    Toast.show('Guest removed', 'warning');
}

// Create Event
function createEvent() {
    const eventName = document.getElementById('eventName').value;
    const eventType = document.getElementById('eventType').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const location = document.getElementById('location').value;
    
    if (!eventName || !eventDate || !eventTime || !location) {
        Toast.show('Please fill all required fields', 'error');
        return;
    }
    
    const event = {
        id: Date.now(),
        name: eventName,
        type: eventType,
        date: eventDate,
        time: eventTime,
        location: location,
        guests: guests,
        createdAt: new Date().toISOString()
    };
    
    // Save to storage
    const events = StorageManager.get('events') || [];
    events.push(event);
    StorageManager.set('events', events);
    
    // Save guests
    const allGuests = StorageManager.get('guests') || [];
    guests.forEach(guest => {
        guest.eventId = event.id;
        guest.eventName = eventName;
        guest.checkedIn = false;
        allGuests.push(guest);
    });
    StorageManager.set('guests', allGuests);
    
    Toast.show('Event created successfully!', 'success');
    
    // Show preview
    showPreview(event);
}

// Show preview modal
function showPreview(event) {
    const previewContent = document.getElementById('invitationPreview');
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    
    previewContent.innerHTML = `
        <div class="invitation-card text-center p-4">
            <h2 class="gradient-text">${event.name}</h2>
            <p class="lead">${event.type}</p>
            <div class="event-details mt-4">
                <p><i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</p>
                <p><i class="fas fa-clock"></i> ${event.time}</p>
                <p><i class="fas fa-map-marker"></i> ${event.location}</p>
            </div>
            <div class="guests-list mt-4">
                <h5>Guests (${event.guests.length})</h5>
                <div class="row">
                    ${event.guests.map(guest => `
                        <div class="col-6 mb-3">
                            <div class="guest-qr p-2 glass-card">
                                <p><strong>${guest.name}</strong></p>
                                <div id="qr-${guest.id}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Generate QR codes in preview
    event.guests.forEach(guest => {
        const qrDiv = document.getElementById(`qr-${guest.id}`);
        if (qrDiv) {
            new QRCode(qrDiv, {
                text: JSON.stringify({
                    id: guest.id,
                    name: guest.name,
                    event: event.id
                }),
                width: 100,
                height: 100
            });
        }
    });
    
    modal.show();
}