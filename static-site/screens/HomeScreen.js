/**
 * HomeScreen.js - Web Implementation
 * Equivalent to React Native HomeScreen component
 * 
 * This component manages:
 * - Category selection and filtering
 * - Recipe display based on active category
 * - User interface layout matching React Native structure
 */

class HomeScreen {
  constructor() {
    // State Variables (equivalent to useState in React Native)
    this.activeCategory = "Chicken";
    
    // Categories array (equivalent to React Native categories state)
    this.categories = [
      {
        idCategory: "1",
        strCategory: "Chicken",
        strCategoryThumb: "🍗"
      },
      {
        idCategory: "2", 
        strCategory: "Beef",
        strCategoryThumb: "🥩"
      },
      {
        idCategory: "3",
        strCategory: "Seafood", 
        strCategoryThumb: "🐟"
      },
      {
        idCategory: "4",
        strCategory: "Vegetarian",
        strCategoryThumb: "🥗"
      },
      {
        idCategory: "5",
        strCategory: "Dessert",
        strCategoryThumb: "🍰"
      },
      {
        idCategory: "6",
        strCategory: "Breakfast",
        strCategoryThumb: "🍳"
      }
    ];

    // All Food recipes array (equivalent to React Native allFood state)
    this.allFood = [
      // Chicken Category
      {
        idMeal: "1",
        recipeName: "Grilled Chicken Breast",
        recipeInstructions: "Season chicken with herbs and grill until cooked through. Serve with vegetables.",
        recipeImage: "🍗",
        category: "Chicken"
      },
      {
        idMeal: "2", 
        recipeName: "Chicken Curry",
        recipeInstructions: "Cook chicken with curry spices, coconut milk, and vegetables. Simmer until tender.",
        recipeImage: "🍛",
        category: "Chicken"
      },
      {
        idMeal: "3",
        recipeName: "BBQ Chicken Wings",
        recipeInstructions: "Marinate wings in BBQ sauce and bake until crispy. Serve hot.",
        recipeImage: "🍗",
        category: "Chicken"
      },
      
      // Beef Category
      {
        idMeal: "4",
        recipeName: "Beef Steak",
        recipeInstructions: "Season steak and cook to preferred doneness. Rest before serving.",
        recipeImage: "🥩",
        category: "Beef"
      },
      {
        idMeal: "5",
        recipeName: "Beef Stir Fry",
        recipeInstructions: "Quick-cook beef strips with vegetables in a hot wok with soy sauce.",
        recipeImage: "🥘",
        category: "Beef"
      },
      
      // Seafood Category  
      {
        idMeal: "6",
        recipeName: "Grilled Salmon",
        recipeInstructions: "Grill salmon fillet with lemon and herbs until flaky.",
        recipeImage: "🐟",
        category: "Seafood"
      },
      {
        idMeal: "7",
        recipeName: "Shrimp Pasta",
        recipeInstructions: "Sauté shrimp with garlic and toss with pasta and herbs.",
        recipeImage: "🍤",
        category: "Seafood"
      },
      
      // Vegetarian Category
      {
        idMeal: "8",
        recipeName: "Garden Salad",
        recipeInstructions: "Mix fresh vegetables with olive oil and vinegar dressing.",
        recipeImage: "🥗",
        category: "Vegetarian"
      },
      {
        idMeal: "9",
        recipeName: "Vegetable Stir Fry",
        recipeInstructions: "Quick-cook mixed vegetables with soy sauce and ginger.",
        recipeImage: "🥬",
        category: "Vegetarian"
      },
      
      // Dessert Category
      {
        idMeal: "10", 
        recipeName: "Chocolate Cake",
        recipeInstructions: "Bake rich chocolate cake layers and frost with chocolate ganache.",
        recipeImage: "🍰",
        category: "Dessert"
      },
      {
        idMeal: "11",
        recipeName: "Apple Pie",
        recipeInstructions: "Fill pastry with spiced apples and bake until golden brown.",
        recipeImage: "🥧",
        category: "Dessert"
      },
      
      // Breakfast Category
      {
        idMeal: "12",
        recipeName: "Scrambled Eggs",
        recipeInstructions: "Whisk eggs and cook gently in butter until creamy.",
        recipeImage: "🍳",
        category: "Breakfast"
      },
      {
        idMeal: "13",
        recipeName: "Pancakes",
        recipeInstructions: "Mix batter and cook on griddle until golden. Serve with syrup.",
        recipeImage: "🥞",
        category: "Breakfast"
      }
    ];

    // Bind methods to maintain context
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.getFilteredFoods = this.getFilteredFoods.bind(this);
    this.render = this.render.bind(this);
  }

  /**
   * Category Handling (equivalent to React Native handleChangeCategory)
   * Updates the active category and triggers re-render
   */
  handleChangeCategory(categoryName) {
    console.log('Category changed to:', categoryName);
    this.activeCategory = categoryName;
    this.render(); // Re-render the component with new category
  }

  /**
   * Filtering Recipes (equivalent to React Native filteredfoods)
   * Returns recipes that match the active category
   */
  getFilteredFoods() {
    return this.allFood.filter(food => food.category === this.activeCategory);
  }

  /**
   * Create Header Section (equivalent to React Native header View)
   * Following React Native structure with StatusBar and proper testID
   */
  createHeader() {
    return `
      <div class="header-container" data-testid="headerContainer">
        <div class="user-info">
          <div class="avatar">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23667eea'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='20'%3E👤%3C/text%3E%3C/svg%3E" alt="User Avatar" />
          </div>
          <div class="greeting">
            <span class="greeting-text">Hello, User!</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="favorites-btn" 
                  onclick="if(window.webNavigation) window.webNavigation.navigate('FavoriteScreen')" 
                  aria-label="My Favorites">
            ❤️ My Favorites
          </button>
          <button class="notification-btn" onclick="console.log('Notifications clicked')" aria-label="Notifications">
            🔔
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Create Title Section (equivalent to React Native title View)
   * Following React Native structure with proper testID
   */
  createTitle() {
    return `
      <div class="title-container" data-testid="titleContainer">
        <h1 class="main-title">Make your own food</h1>
        <p class="subtitle">stay at home</p>
      </div>
    `;
  }

  /**
   * Create Categories Section (equivalent to React Native Categories component)
   * Now properly renders the Categories component with props
   */
  createCategories() {
    // Create Categories component and pass props: categories, activeCategory, handleChangeCategory
    const categoriesComponent = new Categories(
      this.categories,           // categories prop
      this.activeCategory,       // activeCategory prop  
      this.handleChangeCategory  // handleChangeCategory prop
    );

    return `
      <div class="category-list" data-testid="categoryList">
        <h3 class="section-title">Categories</h3>
        ${categoriesComponent.render()}
      </div>
    `;
  }

  /**
   * Create Recipes Section (equivalent to React Native Recipe component)  
   * Now properly renders the Recipe component with props (renamed from Recipes)
   */
  createRecipes() {
    const filteredFoods = this.getFilteredFoods();
    
    // Create Recipe component and pass props: foods and categories
    const recipeComponent = new Recipe(
      filteredFoods,    // foods prop (filtered recipes)
      this.categories   // categories prop
    );

    // Store reference globally for event handlers
    window.currentRecipeComponent = recipeComponent;

    return `
      <div class="food-list" data-testid="foodList">
        <h3 class="section-title">
          ${this.activeCategory} Recipes 
          <span class="recipe-count">(${filteredFoods.length})</span>
        </h3>
        ${recipeComponent.render()}
      </div>
    `;
  }

  /**
   * Main Render Method (equivalent to React Native return statement)
   * Combines all sections into the complete HomeScreen layout
   */
  render() {
    const homeScreenHTML = `
      <div class="home-screen">
        <!-- Status Bar equivalent (handled by browser) -->
        
        <!-- Scroll Container (equivalent to React Native ScrollView) -->
        <div class="scroll-container" data-testid="scrollContainer">
          
          <!-- Header Section -->
          ${this.createHeader()}
          
          <!-- Title Section -->
          ${this.createTitle()}
          
          <!-- Categories Section -->
          ${this.createCategories()}
          
          <!-- Recipes Section -->
          ${this.createRecipes()}
          
        </div>
      </div>
    `;

    // Update the DOM with the new HTML
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      appContainer.innerHTML = homeScreenHTML;
    }
    
    return homeScreenHTML;
  }

  /**
   * Initialize the HomeScreen (equivalent to React Native component mounting)
   */
  init() {
    console.log('HomeScreen initialized');
    console.log('Active Category:', this.activeCategory);
    console.log('Total Categories:', this.categories.length);
    console.log('Total Recipes:', this.allFood.length);
    console.log('Filtered Recipes:', this.getFilteredFoods().length);
    
    this.render();
  }

  /**
   * Static initialization method (equivalent to React Native component registration)
   * Following React Native lifecycle patterns
   */
  static init() {
    console.log('HomeScreen static initialization');
    
    // Make sure webNavigation is available globally (equivalent to React Native Navigation prop)
    if (typeof window.webNavigation === 'undefined') {
      console.warn('Warning: webNavigation not found. Make sure navigation system is initialized first.');
    }
    
    // Create global homeScreen instance (equivalent to React Native component instance)
    if (typeof window.homeScreen === 'undefined') {
      window.homeScreen = new HomeScreen();
    }
    
    // Simulate React Native's initial render
    window.homeScreen.init();
    
    return window.homeScreen;
  }
}

/**
 * Global function to view recipe details
 * (This would typically navigate to RecipeDetailScreen in React Native)
 */
function viewRecipeDetail(recipeId) {
  const recipe = homeScreen.allFood.find(food => food.idMeal === recipeId);
  if (recipe) {
    console.log('Viewing recipe:', recipe.recipeName);
    
    // In React Native this would be: navigation.navigate('RecipeDetail', { recipe })
    // For web, we'll show a modal or navigate to detail view
    showRecipeDetailModal(recipe);
  }
}

/**
 * Show recipe detail in a modal (web equivalent of navigation)
 */
function showRecipeDetailModal(recipe) {
  const modal = document.createElement('div');
  modal.className = 'recipe-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${recipe.recipeName}</h2>
        <button class="close-modal" onclick="closeRecipeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="recipe-icon-large">${recipe.recipeImage}</div>
        <p><strong>Category:</strong> ${recipe.category}</p>
        <p><strong>Instructions:</strong></p>
        <p>${recipe.recipeInstructions}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add click outside to close
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeRecipeModal();
    }
  });
}

/**
 * Close recipe detail modal
 */
function closeRecipeModal() {
  const modal = document.querySelector('.recipe-modal');
  if (modal) {
    modal.remove();
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomeScreen;
}
