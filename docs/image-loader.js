// Optimize image loading and prefetch strategy
(function() {
    const imageQueue = [];
    
    // Intersection Observer to load images on scroll
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    // Use requestAnimationFrame to avoid blocking
                    requestAnimationFrame(() => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    });
                }
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before image enters viewport
    });
    
    // Apply observer to all lazy-loaded images
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            // Prefetch the image
            if (!img.src || img.src.includes('placeholder')) {
                img.dataset.src = img.getAttribute('data-src') || img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"%3E%3Crect fill="%23f0f0f0" width="180" height="180"/%3E%3C/svg%3E';
                imageObserver.observe(img);
            }
        });
    });
    
    // Prefetch critical images
    function prefetchImages() {
        const links = document.querySelectorAll('img[src*="unsplash"]');
        links.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = img.src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', prefetchImages);
    } else {
        prefetchImages();
    }
})();
