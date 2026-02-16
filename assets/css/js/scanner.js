// Initialize QR Scanner
let html5QrCode;
let scanning = false;

function initializeScanner() {
    const qrReader = document.getElementById('qr-reader');
    if (!qrReader) return;
    
    html5QrCode = new Html5Qrcode("qr-reader");
    
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        handleScan(decodedText);
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback);
    scanning = true;
}

// Handle QR scan
function handleScan(qrData) {
    try {
        const data = JSON.parse(qrData);
        validateGuest(data);
    } catch (e) {
        Toast.show('Invalid QR code format', 'error');
    }
}

// Validate guest
function validateGuest(guestData) {
    const guests = StorageManager.get('guests') || [];
    const guest = guests.find(g => g.id === guestData.id);
    
    if (!guest) {
        Toast.show('Guest not found', 'error');
        addToScanHistory('Unknown Guest', 'error');
        return;
    }
    
    if (guest.checkedIn) {
        Toast.show(`ALREADY CHECKED IN: ${guest.name}`, 'warning');
        addToScanHistory(guest.name, 'warning');
        return;
    }
    
    // Check in guest
    guest.checkedIn = true;
    guest.checkedInTime = new Date().toISOString();
    
    // Update storage
    const updatedGuests = guests.map(g => g.id === guest.id ? guest : g);
    StorageManager.set('guests', updatedGuests);
    
    Toast.show(`Welcome, ${guest.name}!`, 'success');
    addToScanHistory(guest.name, 'success');
    
    // Play success sound
    playSound('success');
}

// Manual QR validation
function validateManualQR() {
    const qrCode = document.getElementById('manualQR').value;
    if (!qrCode) {
        Toast.show('Please enter QR code', 'error');
        return;
    }
    
    try {
        const data = JSON.parse(atob(qrCode));
        validateGuest(data);
    } catch {
        Toast.show('Invalid QR code', 'error');
    }
}

// Add to scan history
function addToScanHistory(name, status) {
    const history = document.getElementById('scanHistory');
    if (!history) return;
    
    const entry = document.createElement('div');
    entry.className = `scan-entry d-flex justify-content-between align-items-center mb-2 p-2 glass-card scan-${status}`;
    entry.innerHTML = `
        <div>
            <i class="fas ${status === 'success' ? 'fa-check-circle text-success' : 'fa-exclamation-circle text-warning'}"></i>
            <span class="ms-2">${name}</span>
        </div>
        <small>${new Date().toLocaleTimeString()}</small>
    `;
    
    history.insertBefore(entry, history.firstChild);
    
    // Keep only last 10 scans
    while (history.children.length > 10) {
        history.removeChild(history.lastChild);
    }
}

// Play sound
function playSound(type) {
    const audio = new Audio();
    audio.src = type === 'success' 
        ? 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
        : 'https://www.soundjay.com/misc/sounds/buzzer-or-wrong-answer-01.mp3';
    audio.play().catch(() => {}); // Ignore autoplay errors
}

// Stop scanner
function stopScanner() {
    if (html5QrCode && scanning) {
        html5QrCode.stop().then(() => {
            scanning = false;
        }).catch(err => {
            console.error('Error stopping scanner:', err);
        });
    }
}

// Initialize on page load
if (document.getElementById('qr-reader')) {
    document.addEventListener('DOMContentLoaded', initializeScanner);
    window.addEventListener('beforeunload', stopScanner);
}