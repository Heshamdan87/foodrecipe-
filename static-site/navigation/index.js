// Enhanced Web Navigation Container - React Native Equivalent
// Advanced navigation system with React Native features

import { 
    ROUTES, 
    SCREEN_CONFIG, 
    ANIMATIONS, 
    NavigationHelpers, 
    NavigationState,
    NAVIGATION_EVENTS 
} from './NavigationTypes.js';

class WebNavigationContainer {
    constructor() {
        // Navigation state management (React Native style)
        this.navigationState = new NavigationState();
        this.currentScreen = ROUTES.WELCOME;
        this.screenParams = {};
        this.screenOptions = { headerShown: false, gestureEnabled: true };
        
        // Enhanced screen registry with React Native configuration
        this.screens = SCREEN_CONFIG;
        
        // Navigation listeners (React Native style)
        this.listeners = {
            [NAVIGATION_EVENTS.FOCUS]: [],
            [NAVIGATION_EVENTS.BLUR]: [],
            [NAVIGATION_EVENTS.STATE]: [],
            [NAVIGATION_EVENTS.BEFORE_REMOVE]: []
        };
        
        // Animation system
        this.animationInProgress = false;
        this.gestureThreshold = 50; // px threshold for swipe gestures
        
        // Navigation history for advanced back/forward
        this.navigationHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    // 🧭 Enhanced Navigation Methods (React Native API + Advanced Features)
    
    /**
     * Navigate to a screen (React Native equivalent with animations)
     * @param {string} screenName - Name of the screen to navigate to
     * @param {object} params - Parameters to pass to the screen
     * @param {object} options - Navigation options (animation, replace, etc.)
     */
    navigate(screenName, params = {}, options = {}) {
        console.log(`🧭 Navigating to: ${screenName}`, params);
        
        if (!NavigationHelpers.isValidRoute(screenName)) {
            console.error(`Screen "${screenName}" not found in navigation registry`);
            return;
        }

        // Prevent navigation during animation
        if (this.animationInProgress) {
            console.log('⏳ Navigation blocked - animation in progress');
            return;
        }

        // Emit beforeRemove event for current screen
        this.emitNavigationEvent(NAVIGATION_EVENTS.BEFORE_REMOVE, {
            data: { action: { type: 'NAVIGATE', payload: { name: screenName, params } } }
        });

        // Store parameters for the screen
        this.screenParams[screenName] = { ...this.screenParams[screenName], ...params };
        
        // Update navigation history
        this.addToHistory(screenName, params);
        
        // Update navigation state (React Native style)
        const newState = {
            index: this.navigationHistory.length - 1,
            routes: this.navigationHistory.map(h => ({ name: h.screen, params: h.params }))
        };
        this.navigationState.emit(newState);
        
        // Get animation type
        const animation = options.animation || NavigationHelpers.getAnimation(screenName);
        
        // Update current screen
        const previousScreen = this.currentScreen;
        this.currentScreen = screenName;
        
        // Emit blur event for previous screen
        if (previousScreen) {
            this.emitNavigationEvent(NAVIGATION_EVENTS.BLUR, { target: previousScreen });
        }
        
        // Render the screen with transition
        this.renderScreenWithAnimation(screenName, params, animation);
        
        // Emit focus event for new screen
        this.emitNavigationEvent(NAVIGATION_EVENTS.FOCUS, { target: screenName });
        
        // Update browser history
        this.updateBrowserHistory(screenName, params);
        
        // Emit state change event
        this.emitNavigationEvent(NAVIGATION_EVENTS.STATE, { data: newState });
    }

    /**
     * Go back to previous screen (React Native equivalent with gesture support)
     */
    goBack() {
        if (this.canGoBack()) {
            // Get previous screen from history
            this.historyIndex--;
            const previousEntry = this.navigationHistory[this.historyIndex];
            
            console.log(`⬅️ Going back to: ${previousEntry.screen}`);
            
            // Update current screen
            const currentScreen = this.currentScreen;
            this.currentScreen = previousEntry.screen;
            
            // Emit events
            this.emitNavigationEvent(NAVIGATION_EVENTS.BLUR, { target: currentScreen });
            this.emitNavigationEvent(NAVIGATION_EVENTS.FOCUS, { target: previousEntry.screen });
            
            // Render previous screen with back animation
            this.renderScreenWithAnimation(
                previousEntry.screen, 
                previousEntry.params, 
                ANIMATIONS.SLIDE_FROM_LEFT
            );
            
            // Update browser history
            this.updateBrowserHistory(previousEntry.screen, previousEntry.params);
        } else {
            console.log('Cannot go back - at root screen');
        }
    }

    /**
     * Replace current screen (React Native equivalent)
     * @param {string} screenName - Name of the screen to replace with
     * @param {object} params - Parameters to pass to the screen
     */
    replace(screenName, params = {}) {
        console.log(`🔄 Replacing current screen with: ${screenName}`, params);
        
        // Emit beforeRemove for current screen
        this.emitNavigationEvent(NAVIGATION_EVENTS.BEFORE_REMOVE, {
            data: { action: { type: 'REPLACE', payload: { name: screenName, params } } }
        });
        
        // Store parameters
        this.screenParams[screenName] = { ...this.screenParams[screenName], ...params };
        
        // Replace current entry in history
        if (this.navigationHistory.length > 0) {
            this.navigationHistory[this.historyIndex] = { screen: screenName, params };
        } else {
            this.addToHistory(screenName, params);
        }
        
        // Update current screen
        const previousScreen = this.currentScreen;
        this.currentScreen = screenName;
        
        // Emit events
        this.emitNavigationEvent(NAVIGATION_EVENTS.BLUR, { target: previousScreen });
        
        // Render the screen
        this.renderScreenWithAnimation(screenName, params, ANIMATIONS.FADE);
        
        // Emit focus event
        this.emitNavigationEvent(NAVIGATION_EVENTS.FOCUS, { target: screenName });
        
        // Update browser history (replace, don't add)
        history.replaceState(
            { screen: screenName, params }, 
            '', 
            NavigationHelpers.getDeepLink(screenName, params)
        );
    }

    /**
     * Reset navigation stack (React Native equivalent)
     * @param {string} screenName - Screen to reset to
     */
    reset(screenName = ROUTES.WELCOME, params = {}) {
        console.log(`🔄 Resetting navigation to: ${screenName}`);
        
        // Clear history
        this.navigationHistory = [];
        this.historyIndex = -1;
        this.screenParams = {};
        
        // Add initial screen to history
        this.addToHistory(screenName, params);
        this.currentScreen = screenName;
        
        // Render the screen
        this.renderScreenWithAnimation(screenName, params, ANIMATIONS.FADE);
        
        // Emit focus event
        this.emitNavigationEvent(NAVIGATION_EVENTS.FOCUS, { target: screenName });
    }

    /**
     * Check if can go back
     */
    canGoBack() {
        return this.historyIndex > 0;
    }

    /**
     * Get current route info (React Native equivalent)
     */
    getCurrentRoute() {
        return {
            name: this.currentScreen,
            params: this.screenParams[this.currentScreen] || {}
        };
    }

    /**
     * Get navigation state (React Native equivalent)
     */
    getState() {
        return {
            index: this.historyIndex,
            routes: this.navigationHistory.map(h => ({ name: h.screen, params: h.params }))
        };
    }

    // 🎨 Enhanced Screen Rendering System with Animations

    /**
     * Render a specific screen with advanced animations
     * @param {string} screenName - Name of screen to render
     * @param {object} params - Parameters for the screen
     * @param {string} animation - Animation type
     */
    renderScreenWithAnimation(screenName, params = {}, animation = ANIMATIONS.SLIDE_FROM_RIGHT) {
        // Set animation in progress
        this.animationInProgress = true;
        
        // Hide all screens first
        this.hideAllScreens();
        
        // Get screen configuration
        const screenConfig = this.screens[screenName];
        if (!screenConfig) {
            console.error(`Screen "${screenName}" not found`);
            this.animationInProgress = false;
            return;
        }

        // Add screen transition class with specific animation
        document.body.classList.add('screen-transitioning', `animation-${animation}`);
        
        // Render based on screen type
        switch (screenName) {
            case ROUTES.WELCOME:
                this.renderWelcomeScreen();
                break;
            case ROUTES.HOME:
                this.renderHomeScreen();
                break;
            case ROUTES.RECIPE_DETAIL:
                this.renderRecipeDetailScreen(params);
                break;
            case ROUTES.MY_FOOD:
                this.renderMyRecipeScreen();
                break;
            case ROUTES.CUSTOM_RECIPES:
                this.renderCustomRecipesScreen();
                break;
            case ROUTES.RECIPES_FORM:
                this.renderRecipesFormScreen(params);
                break;
            case ROUTES.FAVORITE:
                this.renderFavoriteScreen();
                break;
            default:
                console.error(`No renderer for screen: ${screenName}`);
        }

        // Update body class for screen-specific styling
        this.updateBodyClasses(screenName, animation);
        
        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('screen-transitioning', `animation-${animation}`);
            this.animationInProgress = false;
        }, 300);
    }

    /**
     * Update body classes for screen and animation
     */
    updateBodyClasses(screenName, animation) {
        // Remove all existing screen classes
        document.body.className = document.body.className
            .replace(/screen-\w+/g, '')
            .replace(/animation-\w+/g, '')
            .trim();
        
        // Add new screen class
        document.body.classList.add(`screen-${screenName.toLowerCase()}`);
        
        // Add animation class temporarily
        if (animation) {
            document.body.classList.add(`animation-${animation}`);
        }
    }

    /**
     * Hide all visible screens with animation support
     */
    hideAllScreens() {
        // Hide all screen elements
        const screens = document.querySelectorAll('.screen, .welcome-screen, .home-container');
        screens.forEach(screen => {
            if (screen.classList.contains('active')) {
                screen.classList.add('screen-exit');
                setTimeout(() => {
                    screen.style.display = 'none';
                    screen.classList.remove('active', 'screen-exit');
                }, 150);
            } else {
                screen.style.display = 'none';
                screen.classList.remove('active');
            }
        });

        // Hide modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('active');
        });
    }

    // 📱 Individual Screen Renderers

    renderWelcomeScreen() {
        let welcomeScreen = document.getElementById('welcomeScreen');
        
        if (!welcomeScreen) {
            // Create welcome screen if it doesn't exist
            if (typeof WelcomeScreen !== 'undefined') {
                new WelcomeScreen();
                welcomeScreen = document.getElementById('welcomeScreen');
            }
        }
        
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
            welcomeScreen.classList.add('active');
        }
    }

    renderHomeScreen() {
        let homeScreen = document.getElementById('homeScreen') || document.querySelector('.home-container');
        
        if (!homeScreen) {
            // Create home screen if it doesn't exist
            this.createHomeScreen();
            homeScreen = document.querySelector('.home-container');
        }
        
        if (homeScreen) {
            homeScreen.style.display = 'block';
            homeScreen.classList.add('active');
        }

        // Initialize HomeScreen functionality
        if (typeof window.homeScreenInstance !== 'undefined') {
            // HomeScreen already exists, just show it
        } else if (typeof HomeScreen !== 'undefined') {
            window.homeScreenInstance = new HomeScreen();
        }
    }

    renderRecipeDetailScreen(params) {
        const { recipe } = params;
        
        if (!recipe) {
            console.error('No recipe data provided to RecipeDetailScreen');
            return;
        }

        console.log('Rendering RecipeDetailScreen with recipe:', recipe.recipeName);
        
        // Hide all other screens
        this.hideAllScreens();
        
        // Initialize RecipeDetailScreen component with recipe data
        RecipeDetailScreen.init({ recipe });
    }

    renderMyRecipeScreen() {
        console.log('Rendering MyRecipeScreen component');
        
        // Hide all other screens
        this.hideAllScreens();
        
        // Initialize MyRecipeScreen component
        MyRecipeScreen.init();
    }

    renderCustomRecipesScreen() {
        console.log('Rendering CustomRecipesScreen component');
        
        // Hide all other screens
        this.hideAllScreens();
        
        // Initialize CustomRecipesScreen component
        CustomRecipesScreen.init();
    }

    renderRecipesFormScreen() {
        console.log('Rendering RecipesFormScreen component');
        
        // Hide all other screens
        this.hideAllScreens();
        
        // Initialize RecipesFormScreen component
        RecipesFormScreen.init();
    }

    renderFavoriteScreen() {
        console.log('Rendering FavoriteScreen component');
        
        // Hide all other screens
        this.hideAllScreens();
        
        // Initialize FavoriteScreen component
        FavoriteScreen.init();
    }

    // 🛠️ Screen HTML Generators

    createRecipeDetailHTML(recipe) {
        return `
            <div class="screen recipe-detail-screen active" id="recipeDetailScreen">
                <div class="recipe-detail-header">
                    <button class="back-button" onclick="webNavigation.goBack()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 class="screen-title">Recipe Details</h1>
                    <button class="favorite-button" onclick="webNavigation.toggleFavorite('${recipe.idMeal}', ${JSON.stringify(recipe).replace(/"/g, '&quot;')})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                
                <div class="recipe-detail-content">
                    <div class="recipe-detail-image-container">
                        <img src="${recipe.recipeImage || recipe.strMealThumb}" alt="${recipe.recipeName || recipe.strMeal}" class="recipe-detail-image">
                    </div>
                    
                    <div class="recipe-detail-info">
                        <h2 class="recipe-detail-title">${recipe.recipeName || recipe.strMeal}</h2>
                        <p class="recipe-detail-category">
                            <i class="fas fa-tag"></i> ${recipe.category || recipe.strCategory || 'Unknown Category'}
                        </p>
                        
                        <div class="recipe-instructions">
                            <h3><i class="fas fa-list"></i> Instructions</h3>
                            <p>${recipe.recipeInstructions || recipe.strInstructions || 'No instructions available.'}</p>
                        </div>
                        
                        <div class="recipe-actions">
                            <button class="action-button" onclick="webNavigation.navigate('FavoriteScreen')">
                                <i class="fas fa-heart"></i> View Favorites
                            </button>
                            <button class="action-button" onclick="webNavigation.navigate('Home')">
                                <i class="fas fa-home"></i> Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createMyRecipeHTML() {
        return `
            <div class="my-recipe-content">
                <div class="tab-navigation">
                    <button class="tab-button active" data-tab="custom" onclick="webNavigation.switchTab('custom')">
                        <i class="fas fa-utensils"></i> Custom Recipes
                    </button>
                    <button class="tab-button" data-tab="form" onclick="webNavigation.switchTab('form')">
                        <i class="fas fa-plus"></i> Add Recipe
                    </button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-panel active" id="custom-tab">
                        <div class="custom-recipes-list">
                            <p><i class="fas fa-info-circle"></i> Your custom recipes will appear here.</p>
                            <button class="action-button" onclick="webNavigation.navigate('RecipesFormScreen')">
                                <i class="fas fa-plus"></i> Create Your First Recipe
                            </button>
                        </div>
                    </div>
                    <div class="tab-panel" id="form-tab">
                        <div class="recipe-form-container">
                            <p><i class="fas fa-edit"></i> Recipe form will appear here.</p>
                            <button class="action-button" onclick="webNavigation.navigate('RecipesFormScreen')">
                                <i class="fas fa-edit"></i> Open Recipe Form
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createFavoriteHTML(favorites) {
        return `
            <div class="favorites-content">
                ${favorites.length === 0 ? 
                    `<div class="empty-state">
                        <i class="fas fa-heart-broken"></i>
                        <p>No favorite recipes yet!</p>
                        <button class="action-button" onclick="webNavigation.navigate('Home')">
                            <i class="fas fa-search"></i> Discover Recipes
                        </button>
                    </div>` :
                    `<div class="favorites-grid">
                        ${favorites.map(recipe => `
                            <div class="favorite-item" onclick="webNavigation.navigate('RecipeDetail', { recipe: ${JSON.stringify(recipe).replace(/"/g, '&quot;')} })">
                                <img src="${recipe.recipeImage || recipe.strMealThumb}" alt="${recipe.recipeName || recipe.strMeal}">
                                <div class="favorite-info">
                                    <h3>${recipe.recipeName || recipe.strMeal}</h3>
                                    <p><i class="fas fa-tag"></i> ${recipe.category || recipe.strCategory}</p>
                                </div>
                                <button class="remove-favorite" onclick="event.stopPropagation(); webNavigation.removeFavorite('${recipe.idMeal || recipe.idMeal}')">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
        `;
    }

    createHomeScreen() {
        // This method creates the basic home screen structure if it doesn't exist
        const homeHTML = `
            <div class="screen home-container" id="homeScreen">
                <div class="loading">Loading home screen...</div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', homeHTML);
    }

    renderGenericScreen(screenId, title, content) {
        // Remove existing screen
        const existingScreen = document.getElementById(screenId);
        if (existingScreen) {
            existingScreen.remove();
        }

        // Create new screen
        const screenHTML = `
            <div class="screen generic-screen active" id="${screenId}">
                <div class="screen-header">
                    <button class="back-button" onclick="webNavigation.goBack()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <h1 class="screen-title">${title}</h1>
                </div>
                
                <div class="screen-content">
                    ${content}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', screenHTML);
        
        // Show the screen
        const newScreen = document.getElementById(screenId);
        if (newScreen) {
            newScreen.style.display = 'block';
            newScreen.classList.add('active');
        }
    }

    // 🔧 Advanced Navigation Features

    /**
     * Add navigation event listener (React Native equivalent)
     * @param {string} eventType - Type of event to listen for
     * @param {function} callback - Callback function
     */
    addListener(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].push(callback);
            
            // Return unsubscribe function
            return () => {
                this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
            };
        }
        return () => {};
    }

    /**
     * Remove navigation event listener
     */
    removeListener(eventType, callback) {
        if (this.listeners[eventType]) {
            this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
        }
    }

    /**
     * Emit navigation event
     */
    emitNavigationEvent(eventType, data = {}) {
        if (this.listeners[eventType]) {
            this.listeners[eventType].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in navigation event listener:`, error);
                }
            });
        }
    }

    /**
     * Add to navigation history
     */
    addToHistory(screenName, params) {
        // Remove any entries after current index (if user went back and then navigated)
        this.navigationHistory = this.navigationHistory.slice(0, this.historyIndex + 1);
        
        // Add new entry
        this.navigationHistory.push({ screen: screenName, params });
        this.historyIndex = this.navigationHistory.length - 1;
    }

    /**
     * Initialize gesture support
     */
    initializeGestureSupport() {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isGesturing = false;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isGesturing = true;
        };

        const handleTouchMove = (e) => {
            if (!isGesturing) return;
            
            const touch = e.touches[0];
            currentX = touch.clientX;
            currentY = touch.clientY;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            
            // Check for horizontal swipe (back gesture)
            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > this.gestureThreshold) {
                // Swipe right - go back
                if (this.canGoBack() && NavigationHelpers.isGestureEnabled(this.currentScreen)) {
                    this.goBack();
                    isGesturing = false;
                }
            }
        };

        const handleTouchEnd = () => {
            isGesturing = false;
        };

        // Add touch event listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    /**
     * Enhanced browser history management
     */
    updateBrowserHistory(screenName, params) {
        const url = NavigationHelpers.getDeepLink(screenName, params);
        const state = { screen: screenName, params };
        
        // Add to browser history
        history.pushState(state, '', url);
        
        // Update page title
        this.updatePageTitle(screenName);
    }

    /**
     * Update page title based on current screen
     */
    updatePageTitle(screenName) {
        const titles = {
            [ROUTES.WELCOME]: 'Welcome - Foodie',
            [ROUTES.HOME]: 'Home - Foodie',
            [ROUTES.RECIPE_DETAIL]: 'Recipe Details - Foodie',
            [ROUTES.MY_FOOD]: 'My Recipes - Foodie',
            [ROUTES.CUSTOM_RECIPES]: 'Custom Recipes - Foodie',
            [ROUTES.RECIPES_FORM]: 'Add Recipe - Foodie',
            [ROUTES.FAVORITE]: 'Favorites - Foodie'
        };
        
        document.title = titles[screenName] || 'Foodie - Recipe App';
    }

    /**
     * Handle deep linking and URL changes
     */
    handleDeepLinking() {
        const handlePopState = (event) => {
            if (event.state && event.state.screen) {
                // Browser back/forward button pressed
                const { screen, params } = event.state;
                
                // Update navigation without adding to history
                this.currentScreen = screen;
                this.renderScreenWithAnimation(screen, params || {}, ANIMATIONS.FADE);
                
                // Update navigation history index
                const historyEntry = this.navigationHistory.find(h => 
                    h.screen === screen && JSON.stringify(h.params) === JSON.stringify(params)
                );
                if (historyEntry) {
                    this.historyIndex = this.navigationHistory.indexOf(historyEntry);
                }
                
                // Emit navigation events
                this.emitNavigationEvent(NAVIGATION_EVENTS.STATE, {
                    data: this.getState()
                });
            } else {
                // Handle direct URL access
                this.handleInitialRoute();
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        // Handle initial page load
        this.handleInitialRoute();
    }

    /**
     * Handle initial route from URL
     */
    handleInitialRoute() {
        const path = window.location.pathname;
        const { route, params } = NavigationHelpers.parseDeepLink(path);
        
        if (route && route !== this.currentScreen) {
            this.replace(route, params);
        }
    }

    toggleFavorite(recipeId, recipe) {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        const existingIndex = favorites.findIndex(fav => (fav.idMeal || fav.id) === recipeId);
        
        if (existingIndex > -1) {
            // Remove from favorites
            favorites.splice(existingIndex, 1);
            this.showNotification('Removed from favorites', 'info');
        } else {
            // Add to favorites
            favorites.push(recipe);
            this.showNotification('Added to favorites!', 'success');
        }
        
        localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
        this.updateFavoriteButton(recipeId, existingIndex === -1);
    }

    removeFavorite(recipeId) {
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
        const updatedFavorites = favorites.filter(fav => (fav.idMeal || fav.id) !== recipeId);
        
        localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
        this.showNotification('Removed from favorites', 'info');
        
        // Re-render current screen if it's favorites
        if (this.currentScreen === 'FavoriteScreen') {
            this.renderFavoriteScreen();
        }
    }

    updateFavoriteButton(recipeId, isFavorite) {
        const favoriteButton = document.querySelector('.favorite-button i');
        if (favoriteButton) {
            favoriteButton.className = isFavorite ? 'fas fa-heart favorite-active' : 'fas fa-heart';
        }
    }

    switchTab(tabName) {
        // Handle tab switching in My Recipe screen
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.tab === tabName) {
                button.classList.add('active');
            }
        });

        tabPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `${tabName}-tab`) {
                panel.classList.add('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('navigation-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'navigation-notification';
            notification.className = 'navigation-notification';
            document.body.appendChild(notification);
        }

        // Set message and type
        notification.textContent = message;
        notification.className = `navigation-notification ${type} show`;

        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // 🚀 Enhanced Initialization

    init() {
        console.log('🚀 Initializing Enhanced Web Navigation System...');

        // Initialize gesture support for mobile devices
        this.initializeGestureSupport();
        
        // Initialize deep linking and browser navigation
        this.handleDeepLinking();
        
        // Add keyboard navigation support
        this.initializeKeyboardNavigation();
        
        // Set up navigation state listener
        this.navigationState.addListener((state) => {
            console.log('📱 Navigation state updated:', state);
        });
        
        // Add performance monitoring
        this.initializePerformanceMonitoring();
        
        // Set initial route to Welcome screen
        this.navigate(ROUTES.WELCOME);
        
        console.log('✅ Enhanced Web Navigation System initialized');
        console.log('📱 Features: Gestures, Deep linking, Animations, State management');
    }

    /**
     * Initialize keyboard navigation support
     */
    initializeKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + Left Arrow = Go back
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goBack();
            }
            
            // Escape = Go back
            if (e.key === 'Escape' && this.canGoBack()) {
                e.preventDefault();
                this.goBack();
            }
        });
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        // Monitor navigation performance
        this.addListener(NAVIGATION_EVENTS.STATE, () => {
            const start = performance.now();
            
            requestAnimationFrame(() => {
                const end = performance.now();
                const renderTime = end - start;
                
                if (renderTime > 16) { // 60fps threshold
                    console.warn(`⚡ Slow navigation render: ${renderTime.toFixed(2)}ms`);
                }
            });
        });
    }

    /**
     * Enhanced screen renderer for RecipesFormScreen with edit support
     */
    renderRecipesFormScreen(params = {}) {
        const { recipe, isEdit } = params;
        const title = isEdit ? 'Edit Recipe' : 'Add Recipe';
        
        this.renderGenericScreen('recipesFormScreen', title, this.createRecipesFormHTML(recipe, isEdit));
    }

    createRecipesFormHTML(recipe = null, isEdit = false) {
        const formData = recipe || {
            recipeName: '',
            category: '',
            time: '',
            servings: '',
            description: '',
            ingredients: '',
            instructions: ''
        };

        return `
            <div class="recipes-form-content">
                <form class="recipe-form" onsubmit="webNavigation.handleRecipeSubmit(event, ${isEdit})">
                    <div class="form-group">
                        <label for="recipeName">Recipe Name *</label>
                        <input 
                            type="text" 
                            id="recipeName" 
                            name="recipeName" 
                            value="${formData.recipeName}"
                            placeholder="Enter recipe name"
                            required
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Category *</label>
                        <select id="category" name="category" required>
                            <option value="">Select category</option>
                            <option value="Chicken" ${formData.category === 'Chicken' ? 'selected' : ''}>Chicken</option>
                            <option value="Beef" ${formData.category === 'Beef' ? 'selected' : ''}>Beef</option>
                            <option value="Seafood" ${formData.category === 'Seafood' ? 'selected' : ''}>Seafood</option>
                            <option value="Vegetarian" ${formData.category === 'Vegetarian' ? 'selected' : ''}>Vegetarian</option>
                            <option value="Dessert" ${formData.category === 'Dessert' ? 'selected' : ''}>Dessert</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="time">Prep Time</label>
                            <input 
                                type="text" 
                                id="time" 
                                name="time" 
                                value="${formData.time}"
                                placeholder="e.g., 30 minutes"
                            />
                        </div>
                        
                        <div class="form-group">
                            <label for="servings">Servings</label>
                            <input 
                                type="number" 
                                id="servings" 
                                name="servings" 
                                value="${formData.servings}"
                                placeholder="e.g., 4"
                                min="1"
                            />
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            placeholder="Brief description of the recipe"
                            rows="3"
                        >${formData.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="ingredients">Ingredients *</label>
                        <textarea 
                            id="ingredients" 
                            name="ingredients" 
                            placeholder="List ingredients (one per line)"
                            rows="6"
                            required
                        >${formData.ingredients}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="instructions">Instructions *</label>
                        <textarea 
                            id="instructions" 
                            name="instructions" 
                            placeholder="Step-by-step cooking instructions"
                            rows="8"
                            required
                        >${formData.instructions}</textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn-secondary" onclick="webNavigation.goBack()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-save"></i> ${isEdit ? 'Update Recipe' : 'Save Recipe'}
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Handle recipe form submission
     */
    handleRecipeSubmit(event, isEdit = false) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const recipe = {
            id: isEdit ? Date.now() : `custom_${Date.now()}`,
            recipeName: formData.get('recipeName'),
            category: formData.get('category'),
            time: formData.get('time'),
            servings: formData.get('servings'),
            description: formData.get('description'),
            ingredients: formData.get('ingredients'),
            instructions: formData.get('instructions'),
            recipeImage: '🍽️', // Default emoji
            idMeal: `custom_${Date.now()}`
        };

        // Save to localStorage
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '[]');
        
        if (isEdit) {
            const index = customRecipes.findIndex(r => r.id === recipe.id);
            if (index > -1) {
                customRecipes[index] = recipe;
            }
        } else {
            customRecipes.push(recipe);
        }
        
        localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
        
        // Show success message
        this.showNotification(
            isEdit ? 'Recipe updated successfully!' : 'Recipe added successfully!', 
            'success'
        );
        
        // Navigate back to custom recipes
        setTimeout(() => {
            this.navigate(ROUTES.CUSTOM_RECIPES);
        }, 1000);
    }

    handleInitialRoute() {
        const hash = window.location.hash;
        if (hash && hash.length > 1) {
            const route = hash.substring(2); // Remove '#/'
            const screenName = this.findScreenByRoute(route);
            if (screenName) {
                this.currentScreen = screenName;
                this.addToHistory(screenName, {});
            }
        }
    }

    findScreenByRoute(route) {
        const routeMap = {
            'welcome': ROUTES.WELCOME,
            'home': ROUTES.HOME,
            'recipe': ROUTES.RECIPE_DETAIL,
            'my-recipes': ROUTES.MY_FOOD,
            'custom-recipes': ROUTES.CUSTOM_RECIPES,
            'add-recipe': ROUTES.RECIPES_FORM,
            'favorites': ROUTES.FAVORITE
        };
        return routeMap[route.toLowerCase()] || null;
    }
}

// 🌐 Global Navigation Instance (equivalent to useNavigation hook)
let webNavigation;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    webNavigation = new WebNavigationContainer();
    
    // Make navigation available globally (equivalent to useNavigation hook)
    window.navigation = webNavigation;
    window.webNavigation = webNavigation;
    
    console.log('🌐 Navigation available globally as window.navigation');
});

// Handle page refresh and direct URL access
window.addEventListener('beforeunload', function() {
    // Save current navigation state
    if (webNavigation) {
        localStorage.setItem('navigationState', JSON.stringify({
            currentScreen: webNavigation.currentScreen,
            navigationStack: webNavigation.navigationStack,
            screenParams: webNavigation.screenParams
        }));
    }
});

// Restore navigation state on load
window.addEventListener('load', function() {
    const savedState = localStorage.getItem('navigationState');
    if (savedState && webNavigation) {
        try {
            const state = JSON.parse(savedState);
            webNavigation.currentScreen = state.currentScreen;
            webNavigation.navigationStack = state.navigationStack;
            webNavigation.screenParams = state.screenParams;
        } catch (e) {
            console.warn('Could not restore navigation state:', e);
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebNavigationContainer;
}
