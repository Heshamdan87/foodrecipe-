/**
 * FavoriteScreen.js - React Native-style Web Component
 * Displays a user's favorite recipes stored in Redux state
 * 
 * This component shows the list of favorite recipes with navigation
 * and individual recipe cards in a FlatList layout
 */

class FavoriteScreen {
  constructor() {
    this.navigation = window.webNavigation; // React Native-style navigation prop
    this.favoriteRecipesList = this.getFavoriteRecipes();
  }

  /**
   * Get favorite recipes from Redux state (useSelector equivalent)
   * @returns {Array} Array of favorite recipe objects
   */
  getFavoriteRecipes() {
    try {
      // Use Redux store selector if available
      if (window.favoritesStore) {
        return window.favoritesStore.getAllFavorites();
      }
      
      // Fallback to Redux store
      if (window.reduxStore) {
        const state = window.reduxStore.getState();
        return state.favorites.favoriteRecipes || [];
      }
      
      // Final fallback to localStorage
      const favorites = localStorage.getItem('favoriteRecipes');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorite recipes:', error);
      return [];
    }
  }

  /**
   * Navigate back to previous screen (React Native navigation.goBack())
   */
  goBack() {
    if (this.navigation) {
      this.navigation.goBack();
    } else {
      console.warn('Navigation not available');
    }
  }

  /**
   * Navigate to home screen
   */
  goToHome() {
    if (this.navigation) {
      this.navigation.navigate('Home');
    } else {
      console.warn('Navigation not available');
    }
  }

  /**
   * Navigate to recipe detail screen
   * @param {Object} recipe - Recipe object to view details
   */
  navigateToRecipeDetail(recipe) {
    if (this.navigation) {
      this.navigation.navigate('RecipeDetail', { recipe });
    } else {
      console.warn('Navigation not available');
    }
  }

  /**
   * Key extractor for FlatList (React Native FlatList keyExtractor)
   * @param {Object} item - Recipe item
   * @param {Number} index - Item index
   * @returns {String} Unique key for the item
   */
  keyExtractor(item, index) {
    return item.idMeal || item.idFood || item.idC || index.toString();
  }

  /**
   * Render individual recipe item (React Native FlatList renderItem)
   * @param {Object} item - Recipe data
   * @param {Number} index - Item index
   * @returns {String} HTML for recipe card
   */
  renderItem(item, index) {
    // Limit recipe name to 20 characters with ellipsis
    const recipeName = item.recipeName || item.strMeal || 'Unknown Recipe';
    const displayName = recipeName.length > 20 ? recipeName.substring(0, 20) + '...' : recipeName;
    
    return `
      <!-- TouchableOpacity for recipe card -->
      <div class="recipe-card-touchable" 
           onclick="window.currentFavoriteScreen.navigateToRecipeDetail(${JSON.stringify(item).replace(/"/g, '&quot;')})"
           role="button"
           tabindex="0"
           aria-label="View ${recipeName} recipe details"
           onkeypress="if(event.key==='Enter') { window.currentFavoriteScreen.navigateToRecipeDetail(${JSON.stringify(item).replace(/"/g, '&quot;')}); }">
        
        <!-- Recipe Card Container -->
        <div class="favorite-recipe-card">
          
          <!-- Recipe Image -->
          <div class="recipe-image-container">
            <span class="recipe-image" role="img" aria-label="${recipeName}">
              ${item.recipeImage || item.strMealThumb || '🍽️'}
            </span>
          </div>
          
          <!-- Recipe Info -->
          <div class="recipe-info">
            <h4 class="recipe-name">${displayName}</h4>
            <p class="recipe-category">${item.category || item.strCategory || 'Category'}</p>
          </div>
          
        </div>
      </div>
    `;
  }

  /**
   * Render empty state when no favorites exist
   * @returns {String} HTML for empty state
   */
  renderEmptyState() {
    return `
      <div class="empty-state-container">
        <div class="empty-state-content">
          <div class="empty-icon">💔</div>
          <h2 class="empty-title">No favorite recipes yet!</h2>
          <p class="empty-message">Start adding recipes to your favorites to see them here.</p>
          
          <!-- Go back button using TouchableOpacity equivalent -->
          <div class="touchable-opacity-button" 
               onclick="window.currentFavoriteScreen.goToHome()"
               role="button"
               tabindex="0"
               aria-label="Go back to home screen"
               onkeypress="if(event.key==='Enter') { window.currentFavoriteScreen.goToHome(); }">
            <span class="button-text">Go back</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render FlatList with favorite recipes
   * @returns {String} HTML for FlatList equivalent
   */
  renderFlatList() {
    const recipeItems = this.favoriteRecipesList.map((item, index) => {
      return `
        <div class="flatlist-item" data-key="${this.keyExtractor(item, index)}">
          ${this.renderItem(item, index)}
        </div>
      `;
    }).join('');

    return `
      <!-- FlatList equivalent container -->
      <div class="flatlist-container" 
           role="list"
           aria-label="Favorite recipes list">
        
        <!-- Content container with custom styles -->
        <div class="flatlist-content-container">
          ${recipeItems}
        </div>
        
      </div>
    `;
  }

  /**
   * Main Render Method - Equivalent to React Native component render
   * Combines all sections into the complete FavoriteScreen layout
   */
  render() {
    // Refresh favorites list to get latest data
    this.favoriteRecipesList = this.getFavoriteRecipes();
    
    const favoriteScreenHTML = `
      <!-- Favorite Screen Container -->
      <div class="favorite-screen">
        
        <!-- Header Section -->
        <div class="favorite-header">
          <h1 class="screen-title">My Favorite Recipes</h1>
          <div class="favorites-count">
            ${this.favoriteRecipesList.length} favorite${this.favoriteRecipesList.length !== 1 ? 's' : ''}
          </div>
        </div>

        <!-- View component with testID="favoriteRecipes" -->
        <div class="view-container" data-testid="favoriteRecipes">
          
          <!-- TouchableOpacity Go back button -->
          <div class="back-button-container">
            <div class="touchable-opacity-back" 
                 onclick="window.currentFavoriteScreen.goBack()"
                 role="button"
                 tabindex="0"
                 aria-label="Go back to previous screen"
                 onkeypress="if(event.key==='Enter') { window.currentFavoriteScreen.goBack(); }">
              <span class="back-icon">←</span>
              <span class="back-text">Go back</span>
            </div>
          </div>

          <!-- Conditional Rendering: FlatList or Empty State -->
          ${this.favoriteRecipesList.length > 0 ? this.renderFlatList() : this.renderEmptyState()}
          
        </div>
        
      </div>
    `;

    // Update the DOM with the new HTML
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      appContainer.innerHTML = favoriteScreenHTML;
    }
    
    return favoriteScreenHTML;
  }

  /**
   * Initialize the FavoriteScreen (equivalent to React Native component mounting)
   */
  init() {
    console.log('FavoriteScreen initialized');
    console.log('Favorite recipes count:', this.favoriteRecipesList.length);
    
    this.render();
  }

  /**
   * Static initialization method (equivalent to React Navigation)
   * @param {Object} routeParams - Navigation params
   */
  static init(routeParams = {}) {
    console.log('FavoriteScreen static initialization');
    
    // Create global favoriteScreen instance
    window.currentFavoriteScreen = new FavoriteScreen();
    
    // Initialize and render
    window.currentFavoriteScreen.init();
    
    return window.currentFavoriteScreen;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FavoriteScreen;
}
