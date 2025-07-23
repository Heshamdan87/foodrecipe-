// Web JavaScript equivalent of React Native WelcomeScreen
// Add this to your existing script.js or create a separate welcome.js

class WelcomeScreen {
    constructor() {
        this.isShown = false;
        this.init();
    }

    init() {
        // Create welcome screen HTML
        this.createWelcomeScreen();
        // Show welcome screen on page load
        this.showWelcomeScreen();
    }

    createWelcomeScreen() {
        const welcomeHTML = `
            <div class="welcome-screen" id="welcomeScreen">
                <div class="logo-container">
                    <div class="animated-ring ring-2"></div>
                    <div class="animated-ring ring-1"></div>
                    <div class="logo">
                        <i class="fas fa-utensils"></i>
                    </div>
                </div>
                
                <div class="welcome-text">
                    <h1 class="welcome-title">Foodie!</h1>
                    <p class="welcome-subtitle">your food recipe app</p>
                </div>
                
                <div class="loading-dots">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        `;

        // Insert at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', welcomeHTML);
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (!welcomeScreen) return;

        this.isShown = true;

        // Sequence of animations (similar to React Native useEffect)
        setTimeout(() => {
            // Ring 1 animation starts (handled by CSS)
            console.log('Ring 1 animation started');
        }, 100);

        setTimeout(() => {
            // Ring 2 animation starts (handled by CSS)
            console.log('Ring 2 animation started');
        }, 300);

        setTimeout(() => {
            // Logo fade in (handled by CSS)
            console.log('Logo animation started');
        }, 500);

        setTimeout(() => {
            // Text slide up (handled by CSS)
            console.log('Text animation started');
        }, 800);

        // Navigate to main app after 2.5 seconds (like React Native)
        setTimeout(() => {
            this.hideWelcomeScreen();
        }, 2500);
    }

    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen && this.isShown) {
            welcomeScreen.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (welcomeScreen.parentNode) {
                    welcomeScreen.parentNode.removeChild(welcomeScreen);
                }
                this.isShown = false;
                this.onWelcomeComplete();
            }, 500);
        }
    }

    onWelcomeComplete() {
        // Equivalent to navigation.navigate("Home") in React Native
        console.log('Welcome screen completed - showing main app');
        
        // Trigger any initialization for main app
        if (typeof displayRecipes === 'function') {
            displayRecipes();
        }
        
        // You could also trigger other initialization here
        this.initializeMainApp();
    }

    initializeMainApp() {
        // Initialize main application features
        // This is equivalent to what HomeScreen would do in React Native
        
        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('Welcome to Food Recipe App!', 'success');
        }
        
        // Focus search input for better UX
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 500);
        }
    }

    // Static method to check if user has seen welcome before
    static shouldShowWelcome() {
        // Check localStorage to see if user has visited before
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        return !hasVisited;
    }

    static markAsVisited() {
        localStorage.setItem('hasVisitedBefore', 'true');
    }
}

// Auto-initialize welcome screen when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only show welcome screen for first-time visitors
    if (WelcomeScreen.shouldShowWelcome()) {
        new WelcomeScreen();
        WelcomeScreen.markAsVisited();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WelcomeScreen;
}
