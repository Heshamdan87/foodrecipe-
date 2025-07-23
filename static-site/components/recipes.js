/**
 * Recipes.js - Web Component  
 * Equivalent to React Native Recipes component
 * 
 * This component displays the filtered list of recipes
 * based on the selected category
 */

class Recipes {
  constructor(foods, categories) {
    this.foods = foods;
    this.categories = categories;
  }

  /**
   * Get category info by name
   * @param {String} categoryName - Name of the category
   * @returns {Object} Category object with icon and details
   */
  getCategoryInfo(categoryName) {
    return this.categories.find(cat => cat.strCategory === categoryName) || {
      strCategory: categoryName,
      strCategoryThumb: '🍽️'
    };
  }

  /**
   * Format recipe instructions for display
   * @param {String} instructions - Full recipe instructions
   * @returns {String} Truncated instructions
   */
  formatInstructions(instructions) {
    if (instructions.length > 100) {
      return instructions.substring(0, 100) + '...';
    }
    return instructions;
  }

  /**
   * Handle recipe click event - Now uses React Native-style navigation
   * @param {String} recipeId - ID of the selected recipe
   */
  handleRecipeClick(recipeId) {
    const recipe = this.foods.find(food => food.idMeal === recipeId);
    if (recipe) {
      console.log('Recipe selected:', recipe.recipeName);
      
      // React Native-style navigation using web navigation system
      if (window.webNavigation) {
        window.webNavigation.navigate('RecipeDetail', { recipe });
      } else {
        // Fallback to original method
        if (typeof viewRecipeDetail === 'function') {
          viewRecipeDetail(recipeId);
        }
      }
    }
  }

  /**
   * Render individual recipe card
   * @param {Object} food - Recipe object
   * @returns {String} HTML for recipe card
   */
  renderRecipeCard(food) {
    return `
      <div class="recipe-card" 
           data-recipe-id="${food.idMeal}"
           onclick="if(window.webNavigation) { window.webNavigation.navigate('RecipeDetail', { recipe: ${JSON.stringify(food).replace(/"/g, '&quot;')} }); } else { viewRecipeDetail('${food.idMeal}'); }"
           role="button"
           tabindex="0"
           aria-label="View ${food.recipeName} recipe"
           onkeypress="if(event.key==='Enter') { if(window.webNavigation) { window.webNavigation.navigate('RecipeDetail', { recipe: ${JSON.stringify(food).replace(/"/g, '&quot;')} }); } else { viewRecipeDetail('${food.idMeal}'); } }">>
        
        <div class="recipe-image">
          <span class="recipe-icon" role="img" aria-label="${food.recipeName}">${food.recipeImage}</span>
        </div>
        
        <div class="recipe-info">
          <h4 class="recipe-name">${food.recipeName}</h4>
          <p class="recipe-preview">${this.formatInstructions(food.recipeInstructions)}</p>
          
          <div class="recipe-meta">
            <span class="recipe-category">${food.category}</span>
            <button class="view-recipe-btn" 
                    onclick="event.stopPropagation(); viewRecipeDetail('${food.idMeal}')"
                    aria-label="View ${food.recipeName} details">
              View Recipe
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render the complete recipes list
   * Equivalent to React Native Recipes component render
   */
  render() {
    if (!this.foods || this.foods.length === 0) {
      return `
        <div class="recipes-component">
          <div class="no-recipes">
            <div class="no-recipes-icon">🍽️</div>
            <h3>No recipes found</h3>
            <p>Try selecting a different category</p>
          </div>
        </div>
      `;
    }

    const recipesHTML = this.foods.map(food => this.renderRecipeCard(food)).join('');

    return `
      <div class="recipes-component">
        <div class="recipes-header">
          <div class="recipes-stats">
            <span class="recipe-count">${this.foods.length} recipe${this.foods.length !== 1 ? 's' : ''} found</span>
          </div>
        </div>
        
        <div class="recipes-container">
          ${recipesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Static method to create and render recipes
   * @param {Array} foods - Array of recipe objects (filtered)
   * @param {Array} categories - Array of all categories
   */
  static create(foods, categories) {
    const recipesComponent = new Recipes(foods, categories);
    return recipesComponent.render();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Recipes;
}
