document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = [];
    const container = document.querySelector('.carousel-container');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    // Array of video files with updated filenames (now using .mp4)
    const videoFiles = [
        'videos/ScreenRecording_04-02-2025_15-46-58_1.mp4',
        'videos/ScreenRecording_04-02-2025_15-41-04_1.mp4',
        'videos/ScreenRecording_04-02-2025_15-41-32_1.mp4',
        'videos/ScreenRecording_04-02-2025_15-41-55_1.mp4',
        'videos/ScreenRecording_04-02-2025_15-42-34_1.mp4',
        'videos/ScreenRecording_04-02-2025_15-43-35_1.mp4'
    ];

    // Function to create a video element
    function createVideoElement(source, options = {}) {
        const video = document.createElement('video');
        video.src = source;
        video.controls = options.controls || false;
        video.muted = options.muted || false;
        video.style.maxWidth = options.maxWidth || '100%';
        video.style.height = options.height || 'auto';
        video.style.maxHeight = options.maxHeight || '600px';
        video.preload = 'auto';
        video.playsInline = true;

        // Force load and show first frame
        video.load();
        video.addEventListener('loadeddata', () => {
            video.currentTime = 0.1;
        });

        // Add error handling
        video.addEventListener('error', (e) => {
            console.error('Error loading video:', source, e.target.error);
        });

        return video;
    }

    // Function to create a video slide
    function createVideoSlide(source) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const video = createVideoElement(source, {
            controls: true,
            maxHeight: '600px'
        });
        
        // Force load and show first frame
        video.addEventListener('loadeddata', () => {
            video.currentTime = 0.1;
        });
        
        // Pause all videos when this one plays
        video.addEventListener('play', () => {
            slides.forEach(s => {
                const v = s.querySelector('video');
                if (v && v !== video) {
                    v.pause();
                }
            });
        });

        slide.appendChild(video);
        return slide;
    }

    // Function to create thumbnail previews
    function createThumbnails() {
        // Remove existing thumbnails
        const existingThumbnails = container.parentElement.querySelectorAll('.thumbnail-preview');
        existingThumbnails.forEach(thumb => thumb.remove());

        if (slides.length <= 1) return;

        // Create prev thumbnail
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        const prevThumb = document.createElement('div');
        prevThumb.className = 'thumbnail-preview prev';
        const prevVideo = createVideoElement(videoFiles[prevIndex], {
            muted: true,
            controls: false,
            preload: 'metadata'
        });
        prevVideo.currentTime = 1; // Set thumbnail to 1 second into video
        prevThumb.appendChild(prevVideo);
        container.parentElement.appendChild(prevThumb);

        // Create next thumbnail
        const nextIndex = (currentSlide + 1) % slides.length;
        const nextThumb = document.createElement('div');
        nextThumb.className = 'thumbnail-preview next';
        const nextVideo = createVideoElement(videoFiles[nextIndex], {
            muted: true,
            controls: false,
            preload: 'metadata'
        });
        nextVideo.currentTime = 1; // Set thumbnail to 1 second into video
        nextThumb.appendChild(nextVideo);
        container.parentElement.appendChild(nextThumb);

        // Add click/touch handlers to thumbnails
        prevThumb.addEventListener('click', prevSlide);
        nextThumb.addEventListener('click', nextSlide);
        prevThumb.addEventListener('touchend', (e) => {
            e.preventDefault();
            prevSlide();
        });
        nextThumb.addEventListener('touchend', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }

    // Add swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    function updateCarousel() {
        if (slides.length === 0) return;

        // Remove all current slides
        container.innerHTML = '';
        
        // Add current slide
        container.appendChild(slides[currentSlide]);

        // Update thumbnails
        createThumbnails();

        // Update navigation visibility
        prevButton.style.display = slides.length > 1 ? 'flex' : 'none';
        nextButton.style.display = slides.length > 1 ? 'flex' : 'none';
    }

    function nextSlide() {
        if (slides.length === 0) return;
        // Pause current video
        const currentVideo = slides[currentSlide].querySelector('video');
        if (currentVideo) currentVideo.pause();
        
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        if (slides.length === 0) return;
        // Pause current video
        const currentVideo = slides[currentSlide].querySelector('video');
        if (currentVideo) currentVideo.pause();
        
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    // Initialize carousel with videos
    videoFiles.forEach(videoFile => {
        const slide = createVideoSlide(videoFile);
        slides.push(slide);
    });

    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    // Initialize the carousel
    updateCarousel();
}); 