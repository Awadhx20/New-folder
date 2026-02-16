// Initialize Dashboard Charts
function initializeCharts() {
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart')?.getContext('2d');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Check-ins',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#fff' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#fff' }
                    }
                }
            }
        });
    }
    
    // Activity Chart
    const activityCtx = document.getElementById('activityChart')?.getContext('2d');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Wedding', 'Birthday', 'Corporate', 'Party'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: [
                        '#6c5ce7',
                        '#0984e3',
                        '#00b894',
                        '#fdcb6e'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                }
            }
        });
    }
}

// Update Dashboard Stats
function updateDashboardStats() {
    const events = StorageManager.get('events') || [];
    const guests = StorageManager.get('guests') || [];
    
    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('totalGuests').textContent = guests.length;
    
    const checkedIn = guests.filter(g => g.checkedIn).length;
    document.getElementById('checkedIn').textContent = checkedIn;
    document.getElementById('pending').textContent = guests.length - checkedIn;
    
    // Update guest table
    const guestList = document.getElementById('guestList');
    if (guestList) {
        guestList.innerHTML = guests.slice(0, 5).map(guest => `
            <tr>
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td>${guest.eventName || 'N/A'}</td>
                <td>
                    <span class="badge ${guest.checkedIn ? 'bg-success' : 'bg-warning'}">
                        ${guest.checkedIn ? 'Checked In' : 'Pending'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-light" onclick="showQR('${guest.qrCode}')">
                        <i class="fas fa-qrcode"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize on dashboard page
if (document.getElementById('attendanceChart')) {
    document.addEventListener('DOMContentLoaded', () => {
        initializeCharts();
        updateDashboardStats();
    });
}
