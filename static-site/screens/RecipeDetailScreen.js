/**
 * RecipeDetailScreen.js - React Native-style Web Component
 * Displays detailed information about a specific recipe item
 * 
 * This component shows recipe details including image, title, category,
 * ingredients, instructions, and favorite functionality
 */

class RecipeDetailScreen {
  constructor(recipe) {
    this.recipe = recipe || {};
    this.navigation = window.webNavigation; // React Native-style navigation prop
    this.favoriteRecipes = this.getFavoriteRecipes();
    this.isFavorite = this.checkIsFavorite();
  }

  /**
   * Get favorite recipes from Redux store (useSelector equivalent)
   * @returns {Array} Array of favorite recipe IDs
   */
  getFavoriteRecipes() {
    try {
      if (window.favoritesStore) {
        return window.favoritesStore.getAllFavorites().map(recipe => recipe.idMeal);
      }
      // Fallback to localStorage if Redux store not available
      const favorites = localStorage.getItem('favoriteRecipes');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorite recipes:', error);
      return [];
    }
  }

  /**
   * Check if current recipe is marked as favorite (useSelector equivalent)
   * @returns {Boolean} True if recipe is favorite
   */
  checkIsFavorite() {
    if (window.favoritesStore) {
      return window.favoritesStore.isFavorite(this.recipe.idMeal);
    }
    // Fallback check
    return this.favoriteRecipes.includes(this.recipe.idMeal);
  }

  /**
   * Toggle favorite status of the recipe (useDispatch equivalent)
   * Integrates with Redux favoritesSlice
   */
  toggleFavorite() {
    try {
      if (window.favoritesStore) {
        // Use Redux store action
        window.favoritesStore.toggleFavorite(this.recipe);
        
        // Update internal state
        this.isFavorite = window.favoritesStore.isFavorite(this.recipe.idMeal);
      } else {
        // Fallback to localStorage
        let updatedFavorites = [...this.favoriteRecipes];
        
        if (this.isFavorite) {
          updatedFavorites = updatedFavorites.filter(id => id !== this.recipe.idMeal);
          console.log('Removed from favorites:', this.recipe.recipeName);
        } else {
          updatedFavorites.push(this.recipe.idMeal);
          console.log('Added to favorites:', this.recipe.recipeName);
        }
        
        localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
        this.favoriteRecipes = updatedFavorites;
        this.isFavorite = !this.isFavorite;
      }
      
      // Re-render to update UI
      this.render();
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  /**
   * Navigate back to previous screen (React Native navigation)
   */
  goBack() {
    if (this.navigation) {
      this.navigation.goBack();
    } else {
      console.warn('Navigation not available');
    }
  }

  /**
   * Render Recipe Image Container
   * View component with testID="imageContainer"
   */
  renderImageContainer() {
    return `
      <!-- Recipe Image Container -->
      <div class="view-container" data-testid="imageContainer">
        <!-- Image component equivalent to React Native Image -->
        <div class="recipe-image-wrapper">
          <span class="recipe-image" 
                role="img" 
                aria-label="${this.recipe.recipeName}"
                style="background-image: url('${this.recipe.recipeImage || ''}');">
            ${this.recipe.recipeImage || '🍽️'}
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Render Button Interface (Back and Favorite buttons)
   */
  renderButtonInterface() {
    const heartIcon = this.isFavorite ? '❤️' : '🤍';
    
    return `
      <!-- Button Interface Container -->
      <div class="button-interface">
        <!-- Back Button -->
        <button class="back-button" 
                onclick="window.currentRecipeDetail.goBack()"
                aria-label="Go back to previous screen">
          <span class="back-icon">←</span>
          <span class="back-text">Back</span>
        </button>
        
        <!-- Favorite Button -->
        <button class="favorite-button ${this.isFavorite ? 'favorite-active' : ''}" 
                onclick="window.currentRecipeDetail.toggleFavorite()"
                aria-label="${this.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
          <span class="heart-icon">${heartIcon}</span>
        </button>
      </div>
    `;
  }

  /**
   * Render Recipe Title
   * View component with testID="recipeTitle"
   */
  renderRecipeTitle() {
    return `
      <!-- Recipe Title Container -->
      <div class="view-container" data-testid="recipeTitle">
        <h1 class="recipe-title">${this.recipe.recipeName || 'Recipe Name'}</h1>
      </div>
    `;
  }

  /**
   * Render Recipe Category
   * View component with testID="recipeCategory"
   */
  renderRecipeCategory() {
    return `
      <!-- Recipe Category Container -->
      <div class="view-container" data-testid="recipeCategory">
        <div class="category-badge">
          <span class="category-text">${this.recipe.category || 'Category'}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render Miscellaneous Container (mins, servings, calories, type)
   * View component with testID="miscContainer"
   */
  renderMiscContainer() {
    return `
      <!-- Miscellaneous Info Container -->
      <div class="view-container" data-testid="miscContainer">
        <div class="misc-info-grid">
          <!-- Time -->
          <div class="misc-item">
            <span class="misc-icon">⏱️</span>
            <span class="misc-label">Time</span>
            <span class="misc-value">${this.recipe.cookTime || '30'} mins</span>
          </div>
          
          <!-- Servings -->
          <div class="misc-item">
            <span class="misc-icon">👥</span>
            <span class="misc-label">Servings</span>
            <span class="misc-value">${this.recipe.servings || '4'}</span>
          </div>
          
          <!-- Calories -->
          <div class="misc-item">
            <span class="misc-icon">🔥</span>
            <span class="misc-label">Calories</span>
            <span class="misc-value">${this.recipe.calories || '250'}</span>
          </div>
          
          <!-- Type -->
          <div class="misc-item">
            <span class="misc-icon">🍽️</span>
            <span class="misc-label">Type</span>
            <span class="misc-value">${this.recipe.mealType || 'Main'}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Ingredients Section
   * View component with testID="sectionContainer" for ingredients
   */
  renderIngredientsSection() {
    // Parse ingredients from recipe data or use default
    let ingredients = [];
    
    if (this.recipe.ingredients && Array.isArray(this.recipe.ingredients)) {
      ingredients = this.recipe.ingredients;
    } else {
      // Create default ingredients from recipe data
      ingredients = [
        { name: 'Main Ingredient', measurement: '2 cups' },
        { name: 'Secondary Ingredient', measurement: '1 cup' },
        { name: 'Seasoning', measurement: 'To taste' }
      ];
    }

    const ingredientsList = ingredients.map((ingredient, index) => `
      <div class="ingredient-item" data-key="${index}">
        <div class="ingredient-content">
          <span class="ingredient-name">${ingredient.name}</span>
          <span class="ingredient-measurement">${ingredient.measurement}</span>
        </div>
      </div>
    `).join('');

    return `
      <!-- Ingredients Section Container -->
      <div class="view-container" data-testid="sectionContainer">
        <div class="section-header">
          <h2 class="section-title">Ingredients</h2>
        </div>
        
        <!-- Ingredients List -->
        <div class="view-container" data-testid="ingredientsList">
          <div class="ingredients-list">
            ${ingredientsList}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render Instructions Section
   * View component with testID="sectionContainer" for instructions
   */
  renderInstructionsSection() {
    const instructions = this.recipe.recipeInstructions || 
      'Follow these step-by-step instructions to prepare this delicious recipe. Cook with care and enjoy!';

    return `
      <!-- Instructions Section Container -->
      <div class="view-container" data-testid="sectionContainer">
        <div class="section-header">
          <h2 class="section-title">Instructions</h2>
        </div>
        
        <div class="instructions-content">
          <p class="instructions-text">${instructions}</p>
        </div>
      </div>
    `;
  }

  /**
   * Main Render Method - Equivalent to React Native ScrollView
   * Combines all sections into the complete RecipeDetailScreen layout
   */
  render() {
    const recipeDetailHTML = `
      <!-- ScrollView equivalent container -->
      <div class="recipe-detail-screen">
        <div class="scroll-container">
          
          <!-- Recipe Image -->
          ${this.renderImageContainer()}
          
          <!-- Button Interface (Back & Favorite) -->
          ${this.renderButtonInterface()}
          
          <!-- Recipe Title -->
          ${this.renderRecipeTitle()}
          
          <!-- Recipe Category -->
          ${this.renderRecipeCategory()}
          
          <!-- Miscellaneous Info -->
          ${this.renderMiscContainer()}
          
          <!-- Ingredients Section -->
          ${this.renderIngredientsSection()}
          
          <!-- Instructions Section -->
          ${this.renderInstructionsSection()}
          
        </div>
      </div>
    `;

    // Update the DOM with the new HTML
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      appContainer.innerHTML = recipeDetailHTML;
    }
    
    return recipeDetailHTML;
  }

  /**
   * Initialize the RecipeDetailScreen (equivalent to React Native component mounting)
   */
  init() {
    console.log('RecipeDetailScreen initialized');
    console.log('Recipe:', this.recipe.recipeName);
    console.log('Is Favorite:', this.isFavorite);
    
    this.render();
  }

  /**
   * Static initialization method (equivalent to React Navigation params)
   * @param {Object} routeParams - Navigation params containing recipe data
   */
  static init(routeParams) {
    console.log('RecipeDetailScreen static initialization');
    
    // Extract recipe from route params (props.route.params equivalent)
    const recipe = routeParams?.recipe || {};
    
    // Create global recipeDetailScreen instance
    window.currentRecipeDetail = new RecipeDetailScreen(recipe);
    
    // Initialize and render
    window.currentRecipeDetail.init();
    
    return window.currentRecipeDetail;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecipeDetailScreen;
}
