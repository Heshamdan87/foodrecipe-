/**
 * Categories.js - Web Component
 * Equivalent to React Native Categories component
 * 
 * This component displays the list of recipe categories
 * and handles category selection
 */

class Categories {
  constructor(categories, activeCategory, handleChangeCategory) {
    this.categories = categories;
    this.activeCategory = activeCategory;
    this.handleChangeCategory = handleChangeCategory;
  }

  /**
   * Render the categories list
   * Equivalent to React Native Categories component render
   */
  render() {
    const categoriesHTML = this.categories.map(category => `
      <button 
        class="category-item ${category.strCategory === this.activeCategory ? 'active' : ''}"
        onclick="homeScreen.handleChangeCategory('${category.strCategory}')"
        data-category="${category.strCategory}"
        aria-label="Select ${category.strCategory} category"
      >
        <span class="category-icon" role="img" aria-label="${category.strCategory}">${category.strCategoryThumb}</span>
        <span class="category-name">${category.strCategory}</span>
      </button>
    `).join('');

    return `
      <div class="categories-component">
        <div class="categories-container">
          ${categoriesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Static method to create and render categories
   * @param {Array} categories - Array of category objects
   * @param {String} activeCategory - Currently selected category
   * @param {Function} handleChangeCategory - Callback for category change
   */
  static create(categories, activeCategory, handleChangeCategory) {
    const categoriesComponent = new Categories(categories, activeCategory, handleChangeCategory);
    return categoriesComponent.render();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Categories;
}
