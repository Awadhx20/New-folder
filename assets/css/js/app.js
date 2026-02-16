    // Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Loader
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});

// Sticky Navbar
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Toast Notification System
class Toast {
    static show(message, type = 'success', duration = 3000) {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast show toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas ${this.getIcon(type)} me-2"></i>
                <strong class="me-auto">${this.getTitle(type)}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, duration);
    }
    
    static getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    static getTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || titles.info;
    }
}

// Form Validation
class FormValidator {
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    static validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone);
    }
    
    static validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    static validateDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        return selectedDate >= today;
    }
}

// Local Storage Manager
class StorageManager {
    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    static get(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    
    static remove(key) {
        localStorage.removeItem(key);
    }
    
    static clear() {
        localStorage.clear();
    }
}

// Initialize Bootstrap components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});