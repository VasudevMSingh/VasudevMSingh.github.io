const slides = [
    {
        url: './images/price_hourly.png',
        alt: 'Energy Data Visualization'
    },
    {
        url: './images/price_monthly.png',
        alt: 'Power Grid Analysis'
    },
    {
        url: './images/demand_hourly.png',
        alt: 'Renewable Energy Project'
    },
    {
        url: './images/demand_monthly.png',
        alt: 'Renewable Energy Project'
    },
    {
        url: './images/topassets_bymonth.png',
        alt: 'Renewable Energy Project'
    }
];

function initSlideshow() {
    const slideshow = document.querySelector('.hero-slideshow');
    
    // Create slides
    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === 0 ? 'active' : ''}`;
        
        const img = document.createElement('img');
        img.src = slide.url;
        img.alt = slide.alt;
        img.loading = 'lazy'; // Lazy load all but first image
        
        slideDiv.appendChild(img);
        slideshow.appendChild(slideDiv);
    });
    
    let currentSlide = 0;
    
    function nextSlide() {
        const slideElements = document.querySelectorAll('.slide');
        slideElements[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slideElements[currentSlide].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 10000);
}

function initBlogCarousel() {
    const carousel = document.querySelector('.blog-carousel');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    const cardWidth = carousel.querySelector('.blog-card').offsetWidth;
    const cardsToShow = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    
    prevButton.addEventListener('click', () => {
        carousel.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });
    
    nextButton.addEventListener('click', () => {
        carousel.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });
    
    // Optional: Hide arrows at the start/end of carousel
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        
        prevButton.style.opacity = scrollLeft === 0 ? '0.5' : '1';
        nextButton.style.opacity = scrollLeft === maxScroll ? '0.5' : '1';
    });
}

// Add this to your existing DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    initSlideshow();
    initBlogCarousel();
    if (window.lightbox) {
        lightbox.option({
            'resizeDuration': 300,
            'wrapAround': true,
            'albumLabel': 'Chart %1 of %2',
            'fadeDuration': 300,
            'positionFromTop': 50
        });
    }
});
