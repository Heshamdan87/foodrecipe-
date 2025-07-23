// Navigation Types and Constants - React Native Style
// Defines navigation patterns and screen types

/**
 * Navigation Route Names - Matches React Native exactly
 */
export const ROUTES = {
    WELCOME: 'Welcome',
    HOME: 'Home', 
    RECIPE_DETAIL: 'RecipeDetail',
    MY_FOOD: 'MyFood',
    CUSTOM_RECIPES: 'CustomRecipesScreen',
    RECIPES_FORM: 'RecipesFormScreen',
    FAVORITE: 'FavoriteScreen'
};

/**
 * Screen Configuration - Enhanced React Native style
 */
export const SCREEN_CONFIG = {
    [ROUTES.WELCOME]: {
        component: 'WelcomeScreen',
        headerShown: false,
        gestureEnabled: false,
        animation: 'fade',
        initialParams: {}
    },
    [ROUTES.HOME]: {
        component: 'HomeScreen',
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
        initialParams: {}
    },
    [ROUTES.RECIPE_DETAIL]: {
        component: 'RecipeDetailScreen',
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
        initialParams: { recipe: null }
    },
    [ROUTES.MY_FOOD]: {
        component: 'MyRecipeScreen',
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
        initialParams: {}
    },
    [ROUTES.CUSTOM_RECIPES]: {
        component: 'CustomRecipesScreen',
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
        initialParams: {}
    },
    [ROUTES.RECIPES_FORM]: {
        component: 'RecipesFormScreen',
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_bottom',
        initialParams: { recipe: null, isEdit: false }
    },
    [ROUTES.FAVORITE]: {
        component: 'FavoriteScreen',
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
        initialParams: {}
    }
};

/**
 * Navigation Animation Types
 */
export const ANIMATIONS = {
    SLIDE_FROM_RIGHT: 'slide_from_right',
    SLIDE_FROM_LEFT: 'slide_from_left', 
    SLIDE_FROM_BOTTOM: 'slide_from_bottom',
    SLIDE_FROM_TOP: 'slide_from_top',
    FADE: 'fade',
    SCALE: 'scale',
    NONE: 'none'
};

/**
 * Navigation Stack Modes
 */
export const STACK_MODES = {
    CARD: 'card',
    MODAL: 'modal'
};

/**
 * Screen Options - React Native equivalent
 */
export const DEFAULT_SCREEN_OPTIONS = {
    headerShown: false,
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    animationTypeForReplace: 'push',
    presentation: 'card'
};

/**
 * Navigation Events - React Native style
 */
export const NAVIGATION_EVENTS = {
    FOCUS: 'focus',
    BLUR: 'blur',
    STATE: 'state',
    BEFORE_REMOVE: 'beforeRemove'
};

/**
 * Deep Link Configuration
 */
export const DEEP_LINKS = {
    [ROUTES.WELCOME]: '/welcome',
    [ROUTES.HOME]: '/home',
    [ROUTES.RECIPE_DETAIL]: '/recipe/:id',
    [ROUTES.MY_FOOD]: '/my-recipes',
    [ROUTES.CUSTOM_RECIPES]: '/custom-recipes',
    [ROUTES.RECIPES_FORM]: '/add-recipe',
    [ROUTES.FAVORITE]: '/favorites'
};

/**
 * Navigation Helper Functions
 */
export class NavigationHelpers {
    /**
     * Check if route exists
     */
    static isValidRoute(routeName) {
        return Object.values(ROUTES).includes(routeName);
    }

    /**
     * Get screen configuration
     */
    static getScreenConfig(routeName) {
        return SCREEN_CONFIG[routeName] || null;
    }

    /**
     * Get animation for route
     */
    static getAnimation(routeName) {
        const config = SCREEN_CONFIG[routeName];
        return config ? config.animation : ANIMATIONS.SLIDE_FROM_RIGHT;
    }

    /**
     * Check if gesture is enabled
     */
    static isGestureEnabled(routeName) {
        const config = SCREEN_CONFIG[routeName];
        return config ? config.gestureEnabled : true;
    }

    /**
     * Get deep link for route
     */
    static getDeepLink(routeName, params = {}) {
        let link = DEEP_LINKS[routeName] || '/';
        
        // Replace parameters in deep link
        Object.keys(params).forEach(key => {
            link = link.replace(`:${key}`, params[key]);
        });
        
        return link;
    }

    /**
     * Parse deep link to route and params
     */
    static parseDeepLink(path) {
        // Simple deep link parsing
        const segments = path.split('/').filter(s => s);
        
        switch (segments[0]) {
            case 'welcome':
                return { route: ROUTES.WELCOME, params: {} };
            case 'home':
                return { route: ROUTES.HOME, params: {} };
            case 'recipe':
                return { 
                    route: ROUTES.RECIPE_DETAIL, 
                    params: { id: segments[1] } 
                };
            case 'my-recipes':
                return { route: ROUTES.MY_FOOD, params: {} };
            case 'custom-recipes':
                return { route: ROUTES.CUSTOM_RECIPES, params: {} };
            case 'add-recipe':
                return { route: ROUTES.RECIPES_FORM, params: {} };
            case 'favorites':
                return { route: ROUTES.FAVORITE, params: {} };
            default:
                return { route: ROUTES.HOME, params: {} };
        }
    }
}

/**
 * Navigation State Manager
 */
export class NavigationState {
    constructor() {
        this.state = {
            index: 0,
            routes: [{ name: ROUTES.WELCOME, params: {} }]
        };
        this.listeners = [];
    }

    /**
     * Add navigation state listener
     */
    addListener(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Emit state change
     */
    emit(state) {
        this.state = state;
        this.listeners.forEach(listener => listener(state));
    }

    /**
     * Get current route
     */
    getCurrentRoute() {
        return this.state.routes[this.state.index];
    }

    /**
     * Check if can go back
     */
    canGoBack() {
        return this.state.index > 0;
    }

    /**
     * Get navigation history
     */
    getHistory() {
        return this.state.routes.slice(0, this.state.index + 1);
    }
}

// Export for use in navigation system
export default {
    ROUTES,
    SCREEN_CONFIG,
    ANIMATIONS,
    STACK_MODES,
    DEFAULT_SCREEN_OPTIONS,
    NAVIGATION_EVENTS,
    DEEP_LINKS,
    NavigationHelpers,
    NavigationState
};
