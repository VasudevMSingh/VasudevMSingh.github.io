// Main JavaScript for Vasudev Singh Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initUpdatesFeed();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.site-header')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a nav link
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

/**
 * Updates Feed Functionality
 */
function initUpdatesFeed() {
    const updatesGrid = document.getElementById('updatesGrid');
    const sectionButtons = document.querySelectorAll('.section-btn');

    if (!updatesGrid || sectionButtons.length === 0) return;

    let currentSection = 'ENERGY';

    // Display updates in grid format
    function displayUpdates(items) {
        if (!items || items.length === 0) {
            updatesGrid.innerHTML = '<div class="update-item"><p class="update-title">No updates available.</p></div>';
            return;
        }

        const updatesHTML = items.map(item => `
            <div class="update-item">
                <a href="${item.url}">
                    <div class="update-meta">
                        <span class="update-type">${item.type}</span>
                        <span class="update-date">${item.date}</span>
                    </div>
                    <h3 class="update-title">${item.title}</h3>
                    <p class="update-description">${item.description}</p>
                </a>
            </div>
        `).join('');

        updatesGrid.innerHTML = updatesHTML;
    }

    // Switch between sections
    function switchSection(section) {
        currentSection = section;

        // Update button states
        sectionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

        // Fetch and display updates
        fetch('data/updates.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch updates');
                return response.json();
            })
            .then(data => {
                const items = data.sections[section] || [];
                displayUpdates(items);
            })
            .catch(error => {
                console.error('Error loading updates:', error);
                updatesGrid.innerHTML = '<div class="update-item"><p class="update-title">Error loading updates. Please try again later.</p></div>';
            });
    }

    // Add click handlers to section buttons
    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchSection(button.dataset.section);
        });
    });

    // Initial load
    switchSection(currentSection);
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
