document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const contactForm = document.getElementById('contact-form');

    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmit);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

async function handleEmailSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    await submitToGoogleSheets('Email Subscriptions', { email });
    alert('Thank you for subscribing!');
    event.target.reset();
}

async function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    await submitToGoogleSheets('Contact Form Submissions', { name, email, phone, message });
    alert('Thank you for your message. We will get back to you soon!');
    event.target.reset();
}

async function submitToGoogleSheets(sheetName, data) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzRYbLCwklMlgs_QA7dxYAkdaf6Y8nWuBwruEsCPS3hhiJuYRPm8onv1jR1TbaNEFr0bg/exec';
    const formData = new FormData();
    formData.append('sheet', sheetName);
    
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Success!', response);
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Error!', error.message);
    }
}