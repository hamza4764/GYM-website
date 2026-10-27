// Saqib Fitness - frontend logic
// Pure frontend, no backend/server required.
// When the client submits the contact form, their details are packaged
// into a WhatsApp message and WhatsApp opens automatically (web or app)
// with the message pre-filled, ready to send to the gym's number.

// ---------- Mobile navigation (hamburger menu) ----------
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
const navBackdrop = document.getElementById('navBackdrop');

function openNav() {
    primaryNav.classList.add('open');
    navBackdrop.classList.add('show');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
}

function closeNav() {
    primaryNav.classList.remove('open');
    navBackdrop.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
}

if (navToggle && primaryNav && navBackdrop) {
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
        isOpen ? closeNav() : openNav();
    });

    // Close when a nav link is tapped (so the page can scroll to the section)
    primaryNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    // Close when tapping the dimmed backdrop
    navBackdrop.addEventListener('click', closeNav);

    // Close with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeNav();
    });

    // Close automatically if the viewport is resized back to desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) closeNav();
    });
}

// ---------- Contact form -> WhatsApp ----------
// Gym's WhatsApp number (country code + number, no + or spaces)
const GYM_WHATSAPP_NUMBER = '923165341699';

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const payload = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        branch: document.getElementById('branch').value,
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    if (!payload.name || !payload.phone || !payload.branch || !payload.message) {
        setStatus('Please fill in your name, phone, branch and message.', 'error');
        return;
    }

    setStatus('Opening WhatsApp...', '');

    // Build the pre-filled WhatsApp message text
    const lines = [
        'New inquiry from Saqib Fitness website:',
        `Name: ${payload.name}`,
        `Phone: ${payload.phone}`,
        `Branch: ${payload.branch}`
    ];
    if (payload.email) {
        lines.push(`Email: ${payload.email}`);
    }
    lines.push(`Message: ${payload.message}`);

    const waText = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${GYM_WHATSAPP_NUMBER}?text=${waText}`;

    // Open WhatsApp (app on mobile, WhatsApp Web on desktop) in a new tab
    window.open(waUrl, '_blank');

    setStatus('Redirecting you to WhatsApp to send your message...', 'success');
    form.reset();
    msgEdited = false;
});

// ---------- Auto-written message ----------
const planSel = document.getElementById('plan');
const branchSel = document.getElementById('branch');
const msgEl = document.getElementById('message');
let msgEdited = false;

function updateAutoMessage() {
    if (msgEdited && msgEl.value.trim() !== '') return;
    const plan = planSel.value;
    const branch = branchSel.value;
    let text = '';
    if (plan && branch) text = `Hello, I would like to join the ${plan} plan at your ${branch} branch. Kindly guide me on the next steps.`;
    else if (plan) text = `Hello, I am interested in the ${plan} plan at Saqib Fitness. Kindly guide me on the next steps.`;
    else if (branch) text = `Hello, I would like to enquire about membership at your ${branch} branch. Kindly guide me on the next steps.`;
    msgEl.value = text;
    msgEdited = false;
}

msgEl.addEventListener('input', () => { msgEdited = msgEl.value.trim() !== ''; });
planSel.addEventListener('change', updateAutoMessage);
branchSel.addEventListener('change', updateAutoMessage);

// "Select Plan" buttons fill the plan + message automatically
document.querySelectorAll('.plan-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        planSel.value = btn.dataset.plan;
        msgEdited = false;
        updateAutoMessage();
    });
});

function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
}

// ---------- Certificate lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
}

if (lightbox) {
    document.querySelectorAll('.cert-card').forEach((card) => {
        card.addEventListener('click', () => {
            lightboxImg.src = card.dataset.full;
            lightboxImg.alt = card.dataset.caption + ' certificate';
            lightboxCaption.textContent = card.dataset.caption;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            document.getElementById('lightboxClose').focus();
        });
    });
    lightbox.addEventListener('click', (e) => { if (e.target !== lightboxImg) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}
