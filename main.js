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
    setInterval(nextSlide, 5000);
}

document.addEventListener('DOMContentLoaded', initSlideshow);