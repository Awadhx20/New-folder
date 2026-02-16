// Download invitation as PDF
function downloadPDF() {
    const element = document.getElementById('invitationPreview');
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'invitation.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#0a0a0a' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    // Show loading toast
    Toast.show('Generating PDF...', 'info');
    
    html2pdf().set(opt).from(element).save().then(() => {
        Toast.show('PDF downloaded successfully!', 'success');
    }).catch(error => {
        console.error('PDF generation error:', error);
        Toast.show('Error generating PDF', 'error');
    });
}

// Export multiple invitations
function downloadBulkPDF(guestIds) {
    const guests = StorageManager.get('guests') || [];
    const selectedGuests = guests.filter(g => guestIds.includes(g.id));
    
    if (selectedGuests.length === 0) {
        Toast.show('No guests selected', 'warning');
        return;
    }
    
    // Create temporary container
    const container = document.createElement('div');
    container.className = 'bulk-pdf-container';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Add each invitation
    selectedGuests.forEach(guest => {
        const invitation = createInvitationHTML(guest);
        container.appendChild(invitation);
    });
    
    // Generate PDF
    html2pdf().from(container).set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'invitations.pdf',
        pagebreak: { mode: 'avoid-all' }
    }).save().then(() => {
        document.body.removeChild(container);
        Toast.show('Bulk PDF generated!', 'success');
    });
}

// Create invitation HTML
function createInvitationHTML(guest) {
    const div = document.createElement('div');
    div.className = 'invitation-page glass-card p-4 mb-4';
    div.style.backgroundColor = '#0a0a0a';
    div.style.color = '#fff';
    div.style.pageBreakAfter = 'always';
    
    div.innerHTML = `
        <div class="text-center">
            <h2 class="gradient-text">${guest.eventName}</h2>
            <div id="qr-${guest.id}" class="my-3"></div>
            <h4>${guest.name}</h4>
            <p>${guest.email}</p>
            <p class="mt-4">Present this QR code at the entrance</p>
        </div>
    `;
    
    // Generate QR code
    setTimeout(() => {
        new QRCode(document.getElementById(`qr-${guest.id}`), {
            text: JSON.stringify({
                id: guest.id,
                name: guest.name,
                event: guest.eventId
            }),
            width: 150,
            height: 150
        });
    }, 100);
    
    return div;
}