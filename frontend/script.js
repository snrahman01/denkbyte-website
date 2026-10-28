// Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfiguration();
    await loadContent();
    setupEventListeners();
    setYear();
});

// Load configuration from API
async function loadConfiguration() {
    try {
        const response = await fetch(`${API_BASE_URL}/config`);
        const config = await response.json();
        applyConfiguration(config);
        return config;
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

// Apply configuration to DOM
function applyConfiguration(config) {
    // Update root CSS variables
    if (config.branding?.colors) {
        const colors = config.branding.colors;
        document.documentElement.style.setProperty('--color-primary', colors.primary);
        document.documentElement.style.setProperty('--color-secondary', colors.secondary);
        document.documentElement.style.setProperty('--color-accent', colors.accent);
        document.documentElement.style.setProperty('--color-dark', colors.dark);
        document.documentElement.style.setProperty('--color-light', colors.light);
        document.documentElement.style.setProperty('--color-text', colors.text);
        document.documentElement.style.setProperty('--color-text-light', colors.text_light);
    }

    // Update company branding
    if (config.company) {
        document.getElementById('company-name').textContent = config.company.name;
        document.getElementById('footer-company-name').textContent = config.company.name;
        document.getElementById('footer-year-company').textContent = config.company.name;
        document.getElementById('hero-title').textContent = config.company.name;
        document.getElementById('hero-subtitle').textContent = config.company.tagline;
        document.getElementById('company-desc').textContent = config.company.description;
        document.getElementById('founded-year').textContent = config.company.founded;
        document.title = `${config.company.name} | Planspiel Course`;
    }

    // Navbar uses the compact icon; hero uses the full lockup
    if (config.branding?.logo_icon) {
        document.getElementById('logo-img').src = config.branding.logo_icon;
    }
    if (config.branding?.logo_url) {
        const heroLogo = document.getElementById('hero-logo');
        const heroTitle = document.getElementById('hero-title');
        if (heroLogo) {
            const iconSrc = config.branding.logo_icon || 'logo.svg';
            // If the hero logo is the full PNG lockup (brain + "DENKBYTE"),
            // hide the duplicate text headline. If it falls back to the SVG
            // icon (no wordmark), keep the headline visible.
            const applyHeroLogoState = () => {
                const isLockup = /\.png($|\?)/i.test(heroLogo.currentSrc || heroLogo.src);
                heroLogo.classList.toggle('is-lockup', isLockup);
                if (heroTitle) heroTitle.classList.toggle('visually-hidden', isLockup);
            };
            heroLogo.addEventListener('load', applyHeroLogoState);
            heroLogo.addEventListener('error', () => {
                // PNG not present yet → fall back to the SVG brain icon
                if (!heroLogo.src.endsWith(iconSrc)) heroLogo.src = iconSrc;
            });
            if (heroLogo.getAttribute('src') !== config.branding.logo_url) {
                heroLogo.src = config.branding.logo_url;
            } else if (heroLogo.complete) {
                // Resolved before listeners attached
                if (heroLogo.naturalWidth > 0) applyHeroLogoState();
                else if (!heroLogo.src.endsWith(iconSrc)) heroLogo.src = iconSrc;
            }
        }
    }

    // Update contact information
    if (config.contact) {
        loadContactInfo(config.contact);
        loadSocialLinks(config.contact.social_media);
    }

    // Update legal information
    if (config.legal?.disclaimer) {
        document.getElementById('academic-disclaimer').textContent = config.legal.disclaimer;
    }

    // Load impressum and privacy content
    loadLegalContent(config);
}

// Load all content from API
async function loadContent() {
    try {
        const [services, team] = await Promise.all([
            fetch(`${API_BASE_URL}/services`).then(r => r.json()),
            fetch(`${API_BASE_URL}/team`).then(r => r.json())
        ]);

        renderServices(services);
        renderTeam(team);

        // Update counters
        document.getElementById('team-count').textContent = team.length;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Render services
function renderServices(services) {
    const container = document.getElementById('services-container');
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="icon">${service.icon || '⭐'}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

// Render team members
function renderTeam(members) {
    const container = document.getElementById('team-container');
    container.innerHTML = members.map(member => `
        <div class="team-member">
            <div class="team-member-avatar">${member.avatar || getInitials(member.name)}</div>
            ${member.superhero ? `<div class="hero-badge">⚡ ${member.superhero}</div>` : ''}
            <h3>${member.name}</h3>
            <div class="role">${member.role}</div>
            ${member.superpower ? `<p class="superpower">${member.superpower}</p>` : ''}
            <p>${member.bio || 'Dedicated team member.'}</p>
            <div class="member-socials">
                ${member.github ? `<a href="${member.github}" target="_blank" rel="noopener noreferrer" title="GitHub">GitHub</a>` : ''}
                ${member.gitlab ? `<a href="${member.gitlab}" target="_blank" rel="noopener noreferrer" title="GitLab">GitLab</a>` : ''}
                ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn">LinkedIn</a>` : ''}
                ${member.email ? `<a href="mailto:${member.email}" title="Email">Email</a>` : ''}
            </div>
        </div>
    `).join('');
}

// Load contact information
function loadContactInfo(contact) {
    const container = document.getElementById('contact-details');
    let html = '';

    if (contact.email) {
        html += `
            <div class="contact-item">
                <div class="contact-item-icon">✉️</div>
                <div class="contact-item-content">
                    <span class="contact-item-label">Email</span>
                    <a href="mailto:${contact.email}" class="contact-item-value">${contact.email}</a>
                </div>
            </div>
        `;
    }

    if (contact.phone) {
        html += `
            <div class="contact-item">
                <div class="contact-item-icon">📞</div>
                <div class="contact-item-content">
                    <span class="contact-item-label">Phone</span>
                    <a href="tel:${contact.phone}" class="contact-item-value">${contact.phone}</a>
                </div>
            </div>
        `;
    }

    if (contact.address) {
        const addr = contact.address;
        html += `
            <div class="contact-item">
                <div class="contact-item-icon">📍</div>
                <div class="contact-item-content">
                    <span class="contact-item-label">Address</span>
                    <span class="contact-item-value">
                        ${addr.street}<br>
                        ${addr.postal_code} ${addr.city}<br>
                        ${addr.country}
                    </span>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Load social media links
function loadSocialLinks(socialMedia) {
    if (!socialMedia) return;

    const container = document.getElementById('social-links');
    let html = '';

    const icons = {
        linkedin: '🔗',
        github: '🐙',
        twitter: '𝕏'
    };

    for (const [platform, url] of Object.entries(socialMedia)) {
        if (url) {
            html += `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${platform}">${icons[platform] || '→'}</a>`;
        }
    }

    container.innerHTML = html;
}

// Load legal content
async function loadLegalContent(config) {
    // Impressum
    const impressumContent = document.getElementById('impressum-content');
    if (config.legal?.impressum) {
        const owner = config.legal.impressum.owner || 'Company';
        const email = config.contact?.email || 'contact@example.com';
        impressumContent.innerHTML = `
            <h3>Operator</h3>
            <p>${owner}</p>

            <h3>Contact</h3>
            <p>
                Email: <a href="mailto:${email}">${email}</a><br>
                ${config.contact?.phone ? `Phone: ${config.contact.phone}<br>` : ''}
                ${config.contact?.address ? `
                Address: ${config.contact.address.street}<br>
                ${config.contact.address.postal_code} ${config.contact.address.city}<br>
                ${config.contact.address.country}
                ` : ''}
            </p>

            <h3>Disclaimer</h3>
            <p><strong>Academic Purpose:</strong> This website represents a fictional company created for educational purposes as part of the Planspiel course at Technische Universität Chemnitz (WS 2026/27). All content is fictional and for demonstration purposes only.</p>

            <h3>Liability for Content</h3>
            <p>The contents of this website have been compiled with meticulous care. However, the operator does not assume any liability for the topicality, correctness, completeness or quality of the information provided.</p>

            <h3>Liability for Links</h3>
            <p>The operator is responsible for the content of external websites only to the extent that they have knowledge of illegal content and it would be technically possible and reasonable to prevent the use of such websites.</p>

            <h3>Copyright</h3>
            <p>The layout, graphics and all other elements contained on this website are protected by copyright. Reproduction in any form requires the written permission of the rights holder.</p>
        `;
    }

    // Privacy Policy / GDPR
    const privacyContent = document.getElementById('privacy-content');
    privacyContent.innerHTML = `
        <h3>Data Protection & GDPR Compliance</h3>
        <p>This website is compliant with the General Data Protection Regulation (GDPR) and German data protection laws.</p>

        <h3>Personal Data Collection</h3>
        <p>We only collect personal data that you voluntarily provide through our contact form. This includes:</p>
        <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Name</li>
            <li>Email Address</li>
            <li>Message Content</li>
        </ul>

        <h3>Data Processing</h3>
        <p>Your data is processed solely for the purpose of responding to your inquiry. We do not share your data with third parties or use it for marketing purposes without your explicit consent.</p>

        <h3>Data Storage</h3>
        <p>Your personal data is stored securely and is deleted after the inquiry has been resolved, typically within 30 days.</p>

        <h3>Your Rights</h3>
        <p>According to GDPR, you have the following rights:</p>
        <ul style="margin-left: 20px; margin-bottom: 16px;">
            <li>Right of access to your personal data</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to deletion of your data</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
        </ul>

        <h3>Contact for Data Protection</h3>
        <p>For questions regarding data protection, please contact us at ${config.contact?.email || 'contact@example.com'}</p>

        <h3>Cookies</h3>
        <p>This website does not use cookies or tracking technologies. No personal data is collected for analytics purposes.</p>

        <h3>External Links</h3>
        <p>This website may contain links to external websites. We are not responsible for the privacy practices of external websites. Please review their privacy policies before providing personal information.</p>

        <h3>Educational Disclaimer</h3>
        <p>This website is a fictional company created for the Planspiel course at TU Chemnitz. While GDPR and data protection principles are demonstrated here, this is an educational project and not a real commercial operation.</p>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Impressum and Privacy links
    const impressumLink = document.querySelector('a[href="#impressum"]');
    const privacyLink = document.querySelector('a[href="#gdpr"]');

    if (impressumLink) {
        impressumLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('impressum-modal').classList.add('show');
        });
    }

    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('privacy-modal').classList.add('show');
        });
    }
}

// Handle contact form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const statusDiv = document.getElementById('form-status');

    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            statusDiv.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
            statusDiv.classList.add('success');
            statusDiv.classList.remove('error');
            e.target.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        statusDiv.textContent = '✗ Error sending message. Please try again.';
        statusDiv.classList.add('error');
        statusDiv.classList.remove('success');
    }

    setTimeout(() => {
        statusDiv.classList.remove('success', 'error');
    }, 5000);
}

// Helper functions
function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function setYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}
