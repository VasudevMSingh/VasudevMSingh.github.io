// Main JavaScript for Vasudev Singh Portfolio
// Option 2: Single JSON Data File - Light Automation

let siteData = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    loadSiteData();
});

/**
 * Load site data from JSON
 */
async function loadSiteData() {
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) throw new Error('Failed to load site data');
        siteData = await response.json();

        // Initialize components that depend on data
        initHomepage();
        initUpdatesFeed();
        initBlogNavigation();
    } catch (error) {
        console.error('Error loading site data:', error);
        // Fallback: still try to init updates feed with old format
        initUpdatesFeedLegacy();
    }
}

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
 * Initialize Homepage - Featured Article and Recent Writing
 */
function initHomepage() {
    if (!siteData || !siteData.posts) return;

    // Render featured article
    renderFeaturedArticle();

    // Render recent writing
    renderRecentWriting();
}

/**
 * Render Featured Article from JSON
 */
function renderFeaturedArticle() {
    const featuredContainer = document.getElementById('featuredArticle');
    if (!featuredContainer) return;

    // Find featured post or use most recent
    const featuredPost = siteData.posts.find(p => p.featured) || siteData.posts[0];
    if (!featuredPost) return;

    featuredContainer.innerHTML = `
        <div class="featured-image">
            <img src="${featuredPost.image}" alt="${featuredPost.imageAlt}">
        </div>
        <div class="featured-content">
            <div class="featured-meta">
                <span class="category-tag category-tag-${featuredPost.category}">${featuredPost.categoryLabel}</span>
                <span class="article-card-date">${featuredPost.dateDisplay}</span>
            </div>
            <h1 class="featured-title">
                <a href="${featuredPost.slug}">${featuredPost.title}</a>
            </h1>
            <p class="featured-excerpt">${featuredPost.description}</p>
            <a href="${featuredPost.slug}" class="read-more-link">Read Analysis</a>
        </div>
    `;
}

/**
 * Render Recent Writing Section from JSON
 */
function renderRecentWriting() {
    const articleList = document.getElementById('articleList');
    if (!articleList) return;

    // Get recent posts (excluding featured, sorted by date, limit 3)
    const recentPosts = siteData.posts
        .filter(p => !p.featured)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

    if (recentPosts.length === 0) return;

    articleList.innerHTML = recentPosts.map(post => `
        <article class="article-card">
            <div class="article-card-image">
                <img src="${post.image}" alt="${post.imageAlt}">
            </div>
            <div class="article-card-content">
                <div class="article-card-meta">
                    <span class="category-tag category-tag-${post.category}">${post.categoryLabel}</span>
                    <span class="article-card-date">${post.dateDisplay}</span>
                </div>
                <h3 class="article-card-title">
                    <a href="${post.slug}">${post.title}</a>
                </h3>
            </div>
        </article>
    `).join('');
}

/**
 * Updates Feed Functionality
 */
function initUpdatesFeed() {
    const updatesGrid = document.getElementById('updatesGrid');
    const sectionButtons = document.querySelectorAll('.section-btn');

    if (!updatesGrid || sectionButtons.length === 0 || !siteData) return;

    let currentSection = 'ENERGY';

    // Get post data by ID
    function getPostById(postId) {
        return siteData.posts.find(p => p.id === postId);
    }

    // Display updates in grid format
    function displayUpdates(items) {
        if (!items || items.length === 0) {
            updatesGrid.innerHTML = '<div class="update-item"><p class="update-title">No updates available.</p></div>';
            return;
        }

        const updatesHTML = items.map(item => {
            // If it's a blog reference, get the post data
            if (item.type === 'BLOG' && item.postId) {
                const post = getPostById(item.postId);
                if (!post) return '';
                return `
                    <div class="update-item">
                        <a href="${post.slug}">
                            <div class="update-meta">
                                <span class="update-type">BLOG</span>
                                <span class="update-date">${post.dateDisplay}</span>
                            </div>
                            <h3 class="update-title">${post.title}</h3>
                            <p class="update-description">${post.excerpt}</p>
                        </a>
                    </div>
                `;
            }
            // Otherwise use the item data directly (for projects, etc.)
            return `
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
            `;
        }).join('');

        updatesGrid.innerHTML = updatesHTML;
    }

    // Switch between sections
    function switchSection(section) {
        currentSection = section;

        // Update button states
        sectionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

        // Get items from loaded data
        const items = siteData.sections[section] || [];
        displayUpdates(items);
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
 * Legacy Updates Feed (fallback for old format)
 */
function initUpdatesFeedLegacy() {
    const updatesGrid = document.getElementById('updatesGrid');
    const sectionButtons = document.querySelectorAll('.section-btn');

    if (!updatesGrid || sectionButtons.length === 0) return;

    let currentSection = 'ENERGY';

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

    function switchSection(section) {
        currentSection = section;
        sectionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

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
                updatesGrid.innerHTML = '<div class="update-item"><p class="update-title">Error loading updates.</p></div>';
            });
    }

    sectionButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchSection(button.dataset.section);
        });
    });

    switchSection(currentSection);
}

/**
 * Initialize Blog Navigation - Auto-generate prev/next links
 */
function initBlogNavigation() {
    const articleNav = document.querySelector('.article-nav');
    if (!articleNav || !siteData) return;

    // Get current page slug
    const currentSlug = window.location.pathname.split('/').pop() || 'index.html';

    // Find current post index
    const sortedPosts = [...siteData.posts].sort((a, b) => new Date(a.date) - new Date(b.date));
    const currentIndex = sortedPosts.findIndex(p => p.slug === currentSlug);

    if (currentIndex === -1) return;

    const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

    // Build navigation HTML
    let navHTML = '';

    if (prevPost) {
        navHTML += `
            <a href="${prevPost.slug}" class="nav-prev">
                <span class="nav-label">Previous</span>
                <span class="nav-title">${prevPost.shortTitle}</span>
            </a>
        `;
    } else {
        navHTML += '<div></div>';
    }

    if (nextPost) {
        navHTML += `
            <a href="${nextPost.slug}" class="nav-next">
                <span class="nav-label">Next</span>
                <span class="nav-title">${nextPost.shortTitle}</span>
            </a>
        `;
    } else {
        navHTML += '<div></div>';
    }

    articleNav.innerHTML = navHTML;
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

/**
 * Utility: Get all posts sorted by date (newest first)
 */
function getAllPostsSorted() {
    if (!siteData || !siteData.posts) return [];
    return [...siteData.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Utility: Get posts by category
 */
function getPostsByCategory(category) {
    if (!siteData || !siteData.posts) return [];
    return siteData.posts.filter(p => p.category === category);
}
