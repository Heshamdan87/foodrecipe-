/**
 * store.js - Redux Store Configuration
 * Web equivalent of Redux Toolkit configureStore for managing application state
 */

/**
 * Redux Store Configuration (Web equivalent of configureStore)
 * Combines reducers and sets up the store for the application
 */
class ReduxStore {
  constructor() {
    this.state = {
      favorites: {
        favoriteRecipes: []
      }
    };
    
    this.listeners = [];
    this.middlewares = [];
    
    this.initializeStore();
  }

  /**
   * Initialize the store with reducers
   */
  initializeStore() {
    // Load persisted state from localStorage
    this.loadPersistedState();
    
    // Set up state persistence
    this.setupStatePersistence();
    
    console.log('Redux Store initialized with state:', this.state);
  }

  /**
   * Load persisted state from localStorage
   */
  loadPersistedState() {
    try {
      const persistedFavorites = localStorage.getItem('favoriteRecipes');
      if (persistedFavorites) {
        this.state.favorites.favoriteRecipes = JSON.parse(persistedFavorites);
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  }

  /**
   * Setup automatic state persistence
   */
  setupStatePersistence() {
    // Subscribe to state changes for persistence
    this.subscribe(() => {
      try {
        localStorage.setItem('favoriteRecipes', JSON.stringify(this.state.favorites.favoriteRecipes));
      } catch (error) {
        console.error('Error persisting state:', error);
      }
    });
  }

  /**
   * Get current state (equivalent to store.getState())
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Dispatch action (equivalent to store.dispatch())
   * @param {Object} action - Redux action object
   */
  dispatch(action) {
    console.log('Dispatching action:', action);
    
    // Process action through reducers
    const newState = this.rootReducer(this.state, action);
    
    // Update state if changed
    if (newState !== this.state) {
      this.state = newState;
      
      // Notify all listeners
      this.notifyListeners();
    }
    
    return action;
  }

  /**
   * Root reducer combining all slice reducers
   * @param {Object} state - Current state
   * @param {Object} action - Redux action
   */
  rootReducer(state, action) {
    return {
      ...state,
      favorites: this.favoritesReducer(state.favorites, action)
    };
  }

  /**
   * Favorites reducer (equivalent to favoritesSlice.reducer)
   * @param {Object} state - Current favorites state
   * @param {Object} action - Redux action
   */
  favoritesReducer(state = { favoriteRecipes: [] }, action) {
    switch (action.type) {
      case 'favorites/toggleFavorite': {
        const recipe = action.payload;
        const currentFavorites = [...state.favoriteRecipes];
        
        // Check if recipe already exists by comparing idFood (or idMeal)
        const existingIndex = currentFavorites.findIndex(
          fav => fav.idFood === recipe.idFood || fav.idMeal === recipe.idMeal
        );
        
        if (existingIndex !== -1) {
          // Remove from favorites if it exists
          currentFavorites.splice(existingIndex, 1);
          console.log('Removed from favorites:', recipe.recipeName || recipe.strMeal);
        } else {
          // Add to favorites if it doesn't exist
          currentFavorites.push(recipe);
          console.log('Added to favorites:', recipe.recipeName || recipe.strMeal);
        }
        
        return {
          ...state,
          favoriteRecipes: currentFavorites
        };
      }
      
      case 'favorites/addToFavorites': {
        const recipe = action.payload;
        const currentFavorites = [...state.favoriteRecipes];
        
        // Check if already exists
        const exists = currentFavorites.some(
          fav => fav.idFood === recipe.idFood || fav.idMeal === recipe.idMeal
        );
        
        if (!exists) {
          currentFavorites.push(recipe);
          console.log('Added to favorites:', recipe.recipeName || recipe.strMeal);
        }
        
        return {
          ...state,
          favoriteRecipes: currentFavorites
        };
      }
      
      case 'favorites/removeFromFavorites': {
        const recipeId = action.payload;
        const currentFavorites = state.favoriteRecipes.filter(
          fav => fav.idFood !== recipeId && fav.idMeal !== recipeId
        );
        
        console.log('Removed from favorites with ID:', recipeId);
        
        return {
          ...state,
          favoriteRecipes: currentFavorites
        };
      }
      
      case 'favorites/clearFavorites': {
        console.log('Cleared all favorites');
        return {
          ...state,
          favoriteRecipes: []
        };
      }
      
      default:
        return state;
    }
  }

  /**
   * Subscribe to store changes (equivalent to store.subscribe())
   * @param {Function} listener - Function to call on state change
   */
  subscribe(listener) {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in store listener:', error);
      }
    });
  }

  /**
   * Add middleware to the store
   * @param {Function} middleware - Middleware function
   */
  applyMiddleware(middleware) {
    this.middlewares.push(middleware);
  }
}

/**
 * Action Creators (equivalent to Redux Toolkit action creators)
 */
const favoritesActions = {
  toggleFavorite: (recipe) => ({
    type: 'favorites/toggleFavorite',
    payload: recipe
  }),
  
  addToFavorites: (recipe) => ({
    type: 'favorites/addToFavorites',
    payload: recipe
  }),
  
  removeFromFavorites: (recipeId) => ({
    type: 'favorites/removeFromFavorites',
    payload: recipeId
  }),
  
  clearFavorites: () => ({
    type: 'favorites/clearFavorites'
  })
};

/**
 * Selectors (equivalent to Redux selectors)
 */
const favoritesSelectors = {
  getFavoriteRecipes: (state) => state.favorites.favoriteRecipes,
  
  isFavorite: (state, recipeId) => 
    state.favorites.favoriteRecipes.some(
      fav => fav.idFood === recipeId || fav.idMeal === recipeId
    ),
  
  getFavoritesCount: (state) => state.favorites.favoriteRecipes.length,
  
  getFavoriteById: (state, recipeId) =>
    state.favorites.favoriteRecipes.find(
      fav => fav.idFood === recipeId || fav.idMeal === recipeId
    )
};

// Create and configure the store (equivalent to configureStore)
const store = new ReduxStore();

// Make store and actions available globally
window.reduxStore = store;
window.favoritesActions = favoritesActions;
window.favoritesSelectors = favoritesSelectors;

// Convenience functions for easier usage
window.useSelector = (selector) => selector(store.getState());
window.useDispatch = () => store.dispatch.bind(store);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    store,
    favoritesActions,
    favoritesSelectors
  };
}

console.log('✅ Redux Store configured successfully');
