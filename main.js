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
 * Initialize Homepage — zones populated by date-descending order
 */
function initHomepage() {
    if (!siteData || !siteData.posts) return;

    const allPosts = getAllPostsSorted();

    renderFeaturedArticle(allPosts[0]);
    renderSidebarArticles(allPosts.slice(1, 5));
    renderRecentWriting(allPosts.slice(5));
}

/**
 * Zone 1 left — featured article (index 0 by date)
 */
function renderFeaturedArticle(post) {
    const featuredContainer = document.getElementById('featuredArticle');
    if (!featuredContainer || !post) return;

    featuredContainer.innerHTML = `
        <div class="featured-image">
            <img src="${post.image}" alt="${post.imageAlt}">
        </div>
        <div class="featured-content">
            <div class="featured-meta">
                <span class="category-tag category-tag-${post.category}">${post.categoryLabel}</span>
                <span class="article-card-date">${post.dateDisplay}</span>
            </div>
            <h1 class="featured-title">
                <a href="${post.slug}">${post.title}</a>
            </h1>
            <p class="featured-excerpt">${post.description}</p>
            <a href="${post.slug}" class="read-more-link">Read Analysis</a>
        </div>
    `;
}

/**
 * Zone 1 right — sidebar stack (indices 1–3 by date)
 */
function renderSidebarArticles(posts) {
    const sidebarContainer = document.getElementById('sidebarArticles');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = posts.map(post => `
        <div class="sidebar-item" data-category="${post.category}">
            <div class="sidebar-item-inner">
                <div class="sidebar-meta">
                    <span class="category-tag category-tag-${post.category}">${post.categoryLabel}</span>
                    <span class="sidebar-date">${post.dateDisplay}</span>
                </div>
                <a class="sidebar-title" href="${post.slug}">${post.title}</a>
                <p class="sidebar-excerpt">${post.description}</p>
            </div>
        </div>
    `).join('');
}

let recentPostsCache = [];
let currentArticlePage = 1;
const ARTICLES_PER_PAGE = 10;

/**
 * Zone 2 — horizontal article list with pagination (index 5+ by date)
 */
function renderRecentWriting(posts, page = 1) {
    const articleList = document.getElementById('articleList');
    if (!articleList || !posts || posts.length === 0) return;

    recentPostsCache = posts;
    currentArticlePage = page;

    // Ensure pagination container exists (injected if not in HTML)
    let paginationContainer = document.getElementById('articlePagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'articlePagination';
        articleList.insertAdjacentElement('afterend', paginationContainer);
    }

    const totalPages = Math.ceil(posts.length / ARTICLES_PER_PAGE);
    const start = (page - 1) * ARTICLES_PER_PAGE;
    const currentPosts = posts.slice(start, start + ARTICLES_PER_PAGE);

    articleList.innerHTML = currentPosts.map(post => `
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
                <p class="article-card-excerpt">${post.description}</p>
            </div>
        </article>
    `).join('');

    if (totalPages > 1) {
        let html = '<div class="pagination-buttons">';
        html += page > 1
            ? `<button data-page="${page - 1}" class="pagination-btn">Previous</button>`
            : `<button class="pagination-btn disabled" disabled>Previous</button>`;
        html += `<span class="pagination-info">Page ${page} of ${totalPages}</span>`;
        html += page < totalPages
            ? `<button data-page="${page + 1}" class="pagination-btn">Next</button>`
            : `<button class="pagination-btn disabled" disabled>Next</button>`;
        html += '</div>';
        paginationContainer.innerHTML = html;

        paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                renderRecentWriting(recentPostsCache, parseInt(btn.dataset.page, 10));
                const writingSection = document.getElementById('writing');
                if (writingSection) {
                    const offsetPosition = writingSection.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });
    } else {
        paginationContainer.innerHTML = '';
    }
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

        sectionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

        // Auto-derive blog items from posts that list this section, sorted newest-first
        const blogItems = siteData.posts
            .filter(p => Array.isArray(p.sections) && p.sections.includes(section))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(p => ({ type: 'BLOG', postId: p.id }));

        // Append any manually-configured non-blog items (projects, etc.)
        const extraItems = (siteData.sections[section] || []).filter(item => item.type !== 'BLOG');

        displayUpdates([...blogItems, ...extraItems]);
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

    // Render related articles
    renderRelatedArticles();
}

/**
 * Render Related Articles — Auto-populate from post.related field
 */
function renderRelatedArticles() {
    const relatedContainer = document.querySelector('.related-articles');
    if (!relatedContainer || !siteData) return;

    const currentSlug = window.location.pathname.split('/').pop() || 'index.html';
    const currentPost = siteData.posts.find(p => p.slug === currentSlug);

    if (!currentPost || !currentPost.related || currentPost.related.length === 0) {
        relatedContainer.style.display = 'none';
        return;
    }

    // Get related post objects
    const relatedPosts = currentPost.related
        .map(id => siteData.posts.find(p => p.id === id))
        .filter(p => p) // filter out any not found
        .slice(0, 4); // limit to 4

    if (relatedPosts.length === 0) {
        relatedContainer.style.display = 'none';
        return;
    }

    const html = relatedPosts.map(post => `
        <article class="related-article-card">
            <div class="related-article-image">
                <img src="${post.image}" alt="${post.imageAlt}">
            </div>
            <div class="related-article-content">
                <span class="category-tag category-tag-${post.category}">${post.categoryLabel}</span>
                <h3 class="related-article-title">
                    <a href="${post.slug}">${post.title}</a>
                </h3>
                <p class="related-article-excerpt">${post.description}</p>
            </div>
        </article>
    `).join('');

    relatedContainer.innerHTML = `
        <h3 class="related-articles-heading">Related Reading</h3>
        <div class="related-articles-grid">${html}</div>
    `;
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

