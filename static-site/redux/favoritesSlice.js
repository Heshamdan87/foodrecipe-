/**
 * favoritesSlice.js - Redux-style state management for favorites
 * Web equivalent of Redux Toolkit slice for managing favorite recipes
 */

class FavoritesSlice {
  constructor() {
    this.name = 'favorites';
    this.initialState = {
      favoriteRecipes: []
    };
    this.state = this.loadState();
  }

  /**
   * Load favorites state from localStorage (Redux store equivalent)
   */
  loadState() {
    try {
      const savedFavorites = localStorage.getItem('favoriteRecipes');
      return {
        favoriteRecipes: savedFavorites ? JSON.parse(savedFavorites) : []
      };
    } catch (error) {
      console.error('Error loading favorites state:', error);
      return { ...this.initialState };
    }
  }

  /**
   * Save state to localStorage (Redux persist equivalent)
   */
  saveState() {
    try {
      localStorage.setItem('favoriteRecipes', JSON.stringify(this.state.favoriteRecipes));
    } catch (error) {
      console.error('Error saving favorites state:', error);
    }
  }

  /**
   * Get current favorites state (useSelector equivalent)
   */
  getState() {
    return this.state;
  }

  /**
   * Toggle favorite recipe action (Redux action creator + reducer)
   * @param {Object} recipe - Recipe object to toggle
   */
  toggleFavorite(recipe) {
    const recipeId = recipe.idMeal;
    const currentFavorites = [...this.state.favoriteRecipes];
    
    // Check if recipe is already in favorites
    const existingIndex = currentFavorites.findIndex(fav => fav.idMeal === recipeId);
    
    if (existingIndex !== -1) {
      // Remove from favorites
      currentFavorites.splice(existingIndex, 1);
      console.log('Removed from favorites:', recipe.recipeName);
    } else {
      // Add to favorites
      currentFavorites.push(recipe);
      console.log('Added to favorites:', recipe.recipeName);
    }
    
    // Update state
    this.state.favoriteRecipes = currentFavorites;
    
    // Persist to localStorage
    this.saveState();
    
    // Dispatch custom event for state change (Redux subscription equivalent)
    this.dispatchStateChange();
    
    return this.state;
  }

  /**
   * Add recipe to favorites action
   * @param {Object} recipe - Recipe to add
   */
  addToFavorites(recipe) {
    const currentFavorites = [...this.state.favoriteRecipes];
    const recipeId = recipe.idMeal;
    
    // Check if already exists
    const exists = currentFavorites.some(fav => fav.idMeal === recipeId);
    
    if (!exists) {
      currentFavorites.push(recipe);
      this.state.favoriteRecipes = currentFavorites;
      this.saveState();
      this.dispatchStateChange();
      console.log('Added to favorites:', recipe.recipeName);
    }
    
    return this.state;
  }

  /**
   * Remove recipe from favorites action
   * @param {String} recipeId - ID of recipe to remove
   */
  removeFromFavorites(recipeId) {
    const currentFavorites = this.state.favoriteRecipes.filter(fav => fav.idMeal !== recipeId);
    
    this.state.favoriteRecipes = currentFavorites;
    this.saveState();
    this.dispatchStateChange();
    
    const removedRecipe = this.state.favoriteRecipes.find(fav => fav.idMeal === recipeId);
    console.log('Removed from favorites:', removedRecipe?.recipeName || recipeId);
    
    return this.state;
  }

  /**
   * Clear all favorites action
   */
  clearFavorites() {
    this.state.favoriteRecipes = [];
    this.saveState();
    this.dispatchStateChange();
    console.log('Cleared all favorites');
    
    return this.state;
  }

  /**
   * Check if recipe is favorite (selector function)
   * @param {String} recipeId - ID of recipe to check
   */
  isFavorite(recipeId) {
    return this.state.favoriteRecipes.some(fav => fav.idMeal === recipeId);
  }

  /**
   * Get favorites count (selector function)
   */
  getFavoritesCount() {
    return this.state.favoriteRecipes.length;
  }

  /**
   * Get all favorite recipes (selector function)
   */
  getAllFavorites() {
    return this.state.favoriteRecipes;
  }

  /**
   * Dispatch state change event (Redux subscription equivalent)
   */
  dispatchStateChange() {
    const event = new CustomEvent('favoritesStateChange', {
      detail: {
        favorites: this.state.favoriteRecipes,
        count: this.state.favoriteRecipes.length
      }
    });
    
    window.dispatchEvent(event);
  }

  /**
   * Subscribe to state changes (useSelector + useEffect equivalent)
   * @param {Function} callback - Function to call on state change
   */
  subscribe(callback) {
    const handleStateChange = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('favoritesStateChange', handleStateChange);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('favoritesStateChange', handleStateChange);
    };
  }
}

// Create global favorites store instance (Redux store equivalent)
window.favoritesStore = new FavoritesSlice();

// Redux-style action creators for global access
window.favoritesActions = {
  toggleFavorite: (recipe) => window.favoritesStore.toggleFavorite(recipe),
  addToFavorites: (recipe) => window.favoritesStore.addToFavorites(recipe),
  removeFromFavorites: (recipeId) => window.favoritesStore.removeFromFavorites(recipeId),
  clearFavorites: () => window.favoritesStore.clearFavorites()
};

// Redux-style selectors for global access
window.favoritesSelectors = {
  getFavorites: () => window.favoritesStore.getAllFavorites(),
  isFavorite: (recipeId) => window.favoritesStore.isFavorite(recipeId),
  getFavoritesCount: () => window.favoritesStore.getFavoritesCount(),
  getState: () => window.favoritesStore.getState()
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FavoritesSlice;
}
