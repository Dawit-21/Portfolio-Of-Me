/* main.js - Dawit Ateka Tamie Portfolio */
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('bi-list', 'bi-x-lg');
            } else {
                icon.classList.replace('bi-x-lg', 'bi-list');
            }
        });
    }

    // Smooth Scroll Offset for Fixed Header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu after click
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileToggle.querySelector('i').classList.replace('bi-x-lg', 'bi-list');
                }
            }
        });
    });

    // Simple Reveal Animation on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        el.classList.add('reveal-item');
        observer.observe(el);
    });

    // Add styles for reveal logic via JS to avoid flicker
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Contact Form AJAX Handling with SweetAlert2
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const btn = document.getElementById('contactSubmitBtn');
            const spinner = btn.querySelector('.spinner');
            const btnText = btn.querySelector('span');

            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            };

            // Custom Client-Side Validation with Premium Alerts
            if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
                Swal.fire({
                    title: 'Incomplete Form',
                    text: 'Please fill out all the fields so we can connect properly.',
                    icon: 'warning',
                    confirmButtonColor: '#E8C678',
                    background: '#0B1B1D',
                    color: '#fff'
                });
                return;
            }

            // Strong Email Validation ensuring a proper Top-Level Domain (e.g. .com, .net)
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                Swal.fire({
                    title: 'Invalid Email Format',
                    text: 'Your email address must be a valid format like user@example.com including the domain.',
                    icon: 'warning',
                    confirmButtonColor: '#E8C678',
                    background: '#0B1B1D',
                    color: '#fff'
                });
                return;
            }

            // Set loading state
            btn.disabled = true;
            spinner.classList.remove('d-none');
            btnText.textContent = 'Sending...';

            try {
                // Submit using FormSubmit API (bypasses Netlify's 404 bugs)
                const response = await fetch('https://formsubmit.co/ajax/heruyane@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        message: formData.message,
                        _subject: "New message from Dawit's Portfolio!"
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    Swal.fire({
                        title: '🎉 Message Sent!',
                        text: 'Thank you! I have received your message and will get back to you at ' + formData.email + ' soon.',
                        icon: 'success',
                        confirmButtonColor: '#2CA7A5',
                        background: '#0B1B1D',
                        color: '#fff',
                        customClass: { popup: 'glass-alert' }
                    });
                    contactForm.reset();
                } else {
                    Swal.fire({
                        title: 'Oops...',
                        text: 'There was a problem sending your message. Please try again.',
                        icon: 'warning',
                        confirmButtonColor: '#E8C678',
                        background: '#0B1B1D',
                        color: '#fff'
                    });
                }
            } catch (error) {
                console.error("Error:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong. Please email me directly at heruyane@gmail.com',
                    icon: 'error',
                    confirmButtonColor: '#ff4444',
                    background: '#0B1B1D',
                    color: '#fff'
                });
            } finally {
                btn.disabled = false;
                spinner.classList.add('d-none');
                btnText.textContent = 'Send Message';
            }
        });
    }

});

