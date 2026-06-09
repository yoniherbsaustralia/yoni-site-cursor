/* ============================================
   YONI HERBS AUSTRALIA - Booking System
   Handles service selection and payment flow
   ============================================ */

// ============================================
// CONFIGURATION - Update these values as needed
// ============================================
const BOOKING_CONFIG = {
    // Deposit amount (fixed amount in AUD)
    depositAmount: 50,

    // Service prices & options
    services: {
        'fertility-massage': {
            name: 'Fertility Massage',
            description: 'Specialised massage to support your fertility journey',
            icon: '🌙',
            options: [
                { label: '60 min', duration: '60 min', price: 160 },
                { label: '90 min', duration: '90 min', price: 200 }
            ]
        },
        'pregnancy-massage': {
            name: 'Pregnancy Massage',
            description: 'Gentle, nurturing massage tailored for each trimester',
            icon: '🤰',
            options: [
                { label: '60 min', duration: '60 min', price: 160 },
                { label: '90 min', duration: '90 min', price: 200 }
            ]
        },
        'postnatal-massage': {
            name: 'Postnatal Massage',
            description: 'Restorative treatment to support recovery after birth',
            icon: '👶',
            options: [
                { label: '60 min', duration: '60 min', price: 160 },
                { label: '90 min', duration: '90 min', price: 200 }
            ]
        },
        'yoni-steaming': {
            name: 'Yoni Steaming',
            description: 'Ancient practice using healing herbs for cleansing and connection',
            icon: '🌿',
            options: [
                { label: '30 min', duration: '30 min', price: 50 },
                { label: '60 min', duration: '60 min', price: 80 }
            ]
        },
        'debriefing': {
            name: 'Debriefing',
            description: 'A safe space to process your experiences and emotions',
            icon: '💭',
            options: [
                { label: '30 min', duration: '30 min', price: 60 },
                { label: '60 min', duration: '60 min', price: 100 }
            ]
        },
        'meditation': {
            name: 'Meditation',
            description: 'Guided meditation sessions to restore calm and balance',
            icon: '🧘‍♀️',
            options: [
                { label: '30 min', duration: '30 min', price: 50 }
            ]
        }
    },

    // Payment URLs - UPDATE THESE WITH YOUR ACTUAL LINKS
    // PayPal: Create at https://www.paypal.com/paymentbuttons/
    // Stripe: Create at https://dashboard.stripe.com/payment-links
    paymentUrls: {
        stripe: 'https://book.stripe.com/14A28scql4Oo7RYfg07EQ00'
    },

    // Return URLs after payment
    returnUrl: 'booking-confirmation.html'
};

// ============================================
// BOOKING STATE
// ============================================
let bookingState = {
    currentStep: 1,
    selectedService: null,
    selectedOption: null, // Track specific option (duration/price)
    paymentMethod: null
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    initBookingSystem();
});

function initBookingSystem() {
    // Check if we're on the booking page
    const bookingContainer = document.getElementById('booking-container');
    if (!bookingContainer) return;

    renderServiceSelection();
    initStepNavigation();
}

// ============================================
// SERVICE SELECTION
// ============================================
function renderServiceSelection() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    let html = '';

    for (const [serviceId, service] of Object.entries(BOOKING_CONFIG.services)) {
        // Generate buttons for each option
        let buttonsHtml = '<div style="display: flex; flex-direction: column; gap: var(--space-xs); margin-top: var(--space-md);">';

        service.options.forEach((option, index) => {
            buttonsHtml += `
                <button class="service-option-btn" 
                        style="
                            display: flex; 
                            justify-content: space-between; 
                            align-items: center;
                            width: 100%;
                            padding: 12px 16px;
                            background: rgba(212, 168, 83, 0.05);
                            border: 1px solid var(--color-accent);
                            border-radius: var(--radius-md);
                            color: var(--color-text);
                            cursor: pointer;
                            transition: all 0.3s ease;
                            text-align: left;
                        "
                        onmouseover="this.style.background='var(--color-accent)'; this.style.color='var(--color-primary)'"
                        onmouseout="this.style.background='rgba(212, 168, 83, 0.05)'; this.style.color='var(--color-text)'"
                        onclick="selectService('${serviceId}', ${index})">
                    <span style="font-weight: 500;">${option.label}</span>
                    <span style="font-weight: 700;">$${option.price}</span>
                </button>
            `;
        });
        buttonsHtml += '</div>';

        html += `
      <div class="service-select-card scroll-animate" data-service="${serviceId}" style="display: flex; flex-direction: column; height: 100%;">
        <div style="flex: 1;">
            <div class="service-select-icon">${service.icon}</div>
            <h3 class="service-select-title">${service.name}</h3>
            <p class="service-select-desc">${service.description}</p>
        </div>
        ${buttonsHtml}
      </div>
    `;
    }

    servicesGrid.innerHTML = html;

    // Re-initialize scroll animations for new elements
    initScrollAnimationsForBooking();
}

function selectService(serviceId, optionIndex) {
    const service = BOOKING_CONFIG.services[serviceId];
    if (!service) return;

    const option = service.options[optionIndex];
    if (!option) return;

    bookingState.selectedService = serviceId;
    bookingState.selectedOption = option;

    // Update UI to show selection
    document.querySelectorAll('.service-select-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-service="${serviceId}"]`)?.classList.add('selected');

    // Update payment section with service details
    updatePaymentSection(service, option);

    // Move to next step
    goToStep(2);
}

// ============================================
// PAYMENT SECTION
// ============================================
function updatePaymentSection(service, option) {
    const selectedServiceEl = document.getElementById('selected-service-name');
    const servicePriceEl = document.getElementById('selected-service-price');
    const depositAmountEl = document.getElementById('deposit-amount');
    const remainingBalanceEl = document.getElementById('remaining-balance');

    if (selectedServiceEl) selectedServiceEl.textContent = `${service.name} (${option.duration})`;
    if (servicePriceEl) servicePriceEl.textContent = `$${option.price}`;
    if (depositAmountEl) depositAmountEl.textContent = `$${BOOKING_CONFIG.depositAmount}`;
    if (remainingBalanceEl) {
        const remaining = option.price - BOOKING_CONFIG.depositAmount;
        remainingBalanceEl.textContent = `$${remaining}`;
    }
}

function payWithCash() {
    if (!bookingState.selectedService) {
        showPaymentError('Please select a service first.');
        return;
    }

    // Store booking state in sessionStorage for confirmation page
    sessionStorage.setItem('bookingState', JSON.stringify({
        service: bookingState.selectedService,
        serviceName: BOOKING_CONFIG.services[bookingState.selectedService].name,
        deposit: '0 (Pay on Arrival)',
        paymentMethod: 'Cash / Pay Later',
        timestamp: new Date().toISOString()
    }));

    // Redirect to confirmation page directly
    window.location.href = BOOKING_CONFIG.returnUrl;
}

function completeBooking() {
    if (!bookingState.selectedService) {
        alert('Please select a service first.');
        return;
    }

    // Store booking state in sessionStorage for confirmation page
    sessionStorage.setItem('bookingState', JSON.stringify({
        service: bookingState.selectedService,
        serviceName: BOOKING_CONFIG.services[bookingState.selectedService].name,
        deposit: '0',
        paymentMethod: 'Booked via Calendar',
        timestamp: new Date().toISOString()
    }));

    // Redirect to confirmation page directly
    window.location.href = BOOKING_CONFIG.returnUrl;
}

function payWithStripe() {
    if (!bookingState.selectedService) {
        showPaymentError('Please select a service first.');
        return;
    }

    // Store booking state in sessionStorage for confirmation page
    sessionStorage.setItem('bookingState', JSON.stringify({
        service: bookingState.selectedService,
        serviceName: BOOKING_CONFIG.services[bookingState.selectedService].name,
        deposit: BOOKING_CONFIG.depositAmount,
        paymentMethod: 'Stripe',
        timestamp: new Date().toISOString()
    }));

    // Redirect to Stripe
    window.location.href = BOOKING_CONFIG.paymentUrls.stripe;
}

function showPaymentError(message) {
    const errorEl = document.getElementById('payment-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// STEP NAVIGATION
// ============================================
function initStepNavigation() {
    const backButtons = document.querySelectorAll('[data-back-step]');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.dataset.backStep);
            goToStep(step);
        });
    });
}

function goToStep(stepNumber) {
    bookingState.currentStep = stepNumber;

    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.getElementById(`step-${stepNumber}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
        // Scroll to top of step
        currentStepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update progress indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 < stepNumber) {
            step.classList.add('completed');
        } else if (index + 1 === stepNumber) {
            step.classList.add('active');
        }
    });
}

// ============================================
// SCROLL ANIMATIONS (for dynamically added content)
// ============================================
function initScrollAnimationsForBooking() {
    const animatedElements = document.querySelectorAll('.scroll-animate:not(.visible)');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// CONFIRMATION PAGE
// ============================================
function initConfirmationPage() {
    const bookingData = sessionStorage.getItem('bookingState');

    if (bookingData) {
        const booking = JSON.parse(bookingData);

        const serviceNameEl = document.getElementById('confirm-service-name');
        const depositEl = document.getElementById('confirm-deposit');
        const paymentMethodEl = document.getElementById('confirm-payment-method');

        if (serviceNameEl) serviceNameEl.textContent = booking.serviceName;
        if (depositEl) {
            // If deposit contains letters, display as is (no $ prefix)
            if (String(booking.deposit).match(/[a-zA-Z]/)) {
                depositEl.textContent = booking.deposit;
            } else {
                depositEl.textContent = `$${booking.deposit}`;
            }
        }
        if (paymentMethodEl) paymentMethodEl.textContent = booking.paymentMethod;

        // Clear the session storage
        sessionStorage.removeItem('bookingState');
    }
}

// Initialize confirmation page if we're on it
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('confirmation-details')) {
        initConfirmationPage();
    }
});
