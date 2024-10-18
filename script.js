document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const contactForm = document.getElementById('contact-form');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
});

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

async function handleEmailSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const result = await submitToGoogleSheets('Email Subscriptions', { email });
    if (result.success) {
        alert('Thank you for subscribing!');
        event.target.reset();
    } else {
        alert('There was an error submitting your email. Please try again.');
    }
}

async function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    const result = await submitToGoogleSheets('Contact Form Submissions', { name, email, phone, message });
    if (result.success) {
        alert('Thank you for your message. We will get back to you soon!');
        event.target.reset();
    } else {
        alert('There was an error submitting your message. Please try again.');
    }
}

async function submitToGoogleSheets(sheetName, data) {
    const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    const formData = new FormData();
    formData.append('sheet', sheetName);
    
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Success!', result);
            return { success: true };
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Error!', error.message);
        return { success: false };
    }
}
