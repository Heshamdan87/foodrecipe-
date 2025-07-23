/**
 * Recipes.js - React Native-style Web Component  
 * Equivalent to React Native Recipe component with FlatList
 * 
 * This component displays a list of recipe items using a grid layout
 * similar to React Native's FlatList with numColumns={2}
 */

class Recipe {
  constructor(foods, categories) {
    this.foods = foods || [];
    this.categories = categories || [];
    this.navigation = window.webNavigation; // React Native-style navigation prop
  }

  /**
   * ArticleCard Component - Inner component for individual recipe items
   * Equivalent to React Native ArticleCard component
   * @param {Object} item - Recipe data object
   * @param {Number} index - Position of recipe in the list
   * @param {Object} navigation - Navigation object for screen transitions
   * @returns {String} HTML for individual recipe card
   */
  ArticleCard(item, index, navigation) {
    // Escape quotes in recipe data for safe embedding in onclick
    const safeRecipeData = JSON.stringify(item).replace(/"/g, '&quot;');
    
    return `
      <div class="article-card" data-testid="articleDisplay">
        <!-- TouchableOpacity equivalent - Clickable area for recipe navigation -->
        <div class="touchable-opacity-wrapper" 
             onclick="window.handleRecipePress('${item.idMeal}')"
             role="button"
             tabindex="0"
             aria-label="View ${item.recipeName} recipe details"
             onkeypress="if(event.key==='Enter') { window.handleRecipePress('${item.idMeal}'); }">
          
          <!-- Recipe Thumbnail Image -->
          <div class="recipe-thumbnail">
            <span class="recipe-image-icon" role="img" aria-label="${item.recipeName}">
              ${item.recipeImage}
            </span>
          </div>
          
          <!-- Recipe Content -->
          <div class="recipe-content">
            <!-- Recipe Name -->
            <h4 class="recipe-name">${item.recipeName}</h4>
            
            <!-- Recipe Description -->
            <p class="recipe-description">${this.formatDescription(item.recipeInstructions)}</p>
            
            <!-- Recipe Category Badge -->
            <div class="recipe-category-badge">
              <span class="category-text">${item.category}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Format recipe description for display
   * @param {String} instructions - Full recipe instructions
   * @returns {String} Truncated description for card display
   */
  formatDescription(instructions) {
    if (!instructions) return 'Delicious recipe with amazing flavors';
    if (instructions.length > 80) {
      return instructions.substring(0, 80) + '...';
    }
    return instructions;
  }

  /**
   * Handle recipe press - Navigate to RecipeDetail screen
   * Equivalent to React Native TouchableOpacity onPress
   * @param {String} recipeId - ID of the selected recipe
   */
  handleRecipePress(recipeId) {
    const recipe = this.foods.find(food => food.idMeal === recipeId);
    if (recipe && this.navigation) {
      console.log('Navigating to RecipeDetail with:', recipe.recipeName);
      
      // React Native-style navigation to RecipeDetail screen
      this.navigation.navigate('RecipeDetail', { recipe });
    } else {
      console.warn('Navigation not available or recipe not found');
    }
  }

  /**
   * Key extractor for FlatList equivalent
   * @param {Object} item - Recipe item
   * @param {Number} index - Item index
   * @returns {String} Unique key for the item
   */
  keyExtractor(item, index) {
    return item.idMeal || index.toString();
  }

  /**
   * Render item function for FlatList equivalent
   * @param {Object} item - Recipe data
   * @param {Number} index - Item index
   * @returns {String} HTML for rendered item
   */
  renderItem(item, index) {
    return this.ArticleCard(item, index, this.navigation);
  }

  /**
   * Main Render Method - Equivalent to React Native component render
   * Uses FlatList-style grid layout with numColumns={2}
   */
  render() {
    // Handle empty data case
    if (!this.foods || this.foods.length === 0) {
      return `
        <div class="recipe-component" data-testid="recipesDisplay">
          <div class="empty-state">
            <div class="empty-icon">🍽️</div>
            <h3>No recipes found</h3>
            <p>Try selecting a different category</p>
          </div>
        </div>
      `;
    }

    // Generate grid items using FlatList equivalent
    const recipeItems = this.foods.map((item, index) => {
      return `
        <div class="grid-item" data-key="${this.keyExtractor(item, index)}">
          ${this.renderItem(item, index)}
        </div>
      `;
    }).join('');

    return `
      <!-- Main View component with testID="recipesDisplay" -->
      <div class="recipe-component" data-testid="recipesDisplay">
        
        <!-- FlatList equivalent with numColumns={2} grid layout -->
        <div class="flatlist-container" 
             data-num-columns="2"
             role="grid"
             aria-label="Recipes grid">
          
          <!-- Grid container for two-column layout -->
          <div class="recipes-grid">
            ${recipeItems}
          </div>
          
        </div>
        
      </div>
    `;
  }

  /**
   * Static method to create Recipe component instance
   * @param {Array} foods - Array of recipe objects (filtered data)
   * @param {Array} categories - Array of all categories
   * @returns {String} Rendered HTML
   */
  static create(foods, categories) {
    const recipeComponent = new Recipe(foods, categories);
    return recipeComponent.render();
  }
}

// Make handleRecipePress available globally for onclick handlers
window.handleRecipePress = function(recipeId) {
  if (window.currentRecipeComponent) {
    window.currentRecipeComponent.handleRecipePress(recipeId);
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Recipe;
}
