// Recipe data storage (using localStorage for persistence)
let recipes = JSON.parse(localStorage.getItem('recipes')) || [
    {
        id: 1,
        name: "Classic Chocolate Chip Cookies",
        category: "dessert",
        time: "30 minutes",
        servings: 24,
        description: "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
        ingredients: [
            "2¼ cups all-purpose flour",
            "1 tsp baking soda",
            "1 tsp salt",
            "1 cup butter, softened",
            "¾ cup granulated sugar",
            "¾ cup brown sugar",
            "2 large eggs",
            "2 tsp vanilla extract",
            "2 cups chocolate chips"
        ],
        instructions: [
            "Preheat oven to 375°F (190°C)",
            "Mix flour, baking soda, and salt in a bowl",
            "Cream together butter and both sugars until light and fluffy",
            "Beat in eggs one at a time, then vanilla",
            "Gradually blend in flour mixture",
            "Stir in chocolate chips",
            "Drop rounded tablespoons on ungreased cookie sheets",
            "Bake 9-11 minutes until golden brown",
            "Cool on baking sheet for 2 minutes before removing"
        ]
    },
    {
        id: 2,
        name: "Avocado Toast",
        category: "breakfast",
        time: "10 minutes",
        servings: 2,
        description: "Simple and healthy avocado toast perfect for breakfast or a quick snack.",
        ingredients: [
            "2 slices whole grain bread",
            "1 ripe avocado",
            "1 lime, juiced",
            "Salt and pepper to taste",
            "Red pepper flakes (optional)",
            "Cherry tomatoes, sliced (optional)"
        ],
        instructions: [
            "Toast the bread slices until golden brown",
            "Cut avocado in half and remove pit",
            "Mash avocado in a bowl with lime juice",
            "Season with salt and pepper",
            "Spread avocado mixture on toast",
            "Top with cherry tomatoes and red pepper flakes if desired"
        ]
    },
    {
        id: 3,
        name: "Chicken Caesar Salad",
        category: "lunch",
        time: "25 minutes",
        servings: 4,
        description: "Fresh and satisfying Caesar salad with grilled chicken breast.",
        ingredients: [
            "2 chicken breasts",
            "1 head romaine lettuce, chopped",
            "½ cup parmesan cheese, grated",
            "¼ cup Caesar dressing",
            "1 cup croutons",
            "2 tbsp olive oil",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Season chicken with salt and pepper",
            "Heat olive oil in a pan over medium-high heat",
            "Cook chicken for 6-7 minutes per side until cooked through",
            "Let chicken rest for 5 minutes, then slice",
            "Toss lettuce with Caesar dressing",
            "Add parmesan cheese and croutons",
            "Top with sliced chicken and serve"
        ]
    }
];

let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayRecipes();
});

// Display recipes based on current filter and search
function displayRecipes() {
    const container = document.getElementById('recipesContainer');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredRecipes = recipes.filter(recipe => {
        const matchesCategory = currentFilter === 'all' || recipe.category === currentFilter;
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm) ||
                            recipe.description.toLowerCase().includes(searchTerm) ||
                            recipe.ingredients.some(ingredient => 
                                ingredient.toLowerCase().includes(searchTerm)
                            );
        return matchesCategory && matchesSearch;
    });
    
    if (filteredRecipes.length === 0) {
        container.innerHTML = `
            <div class="no-recipes">
                <i class="fas fa-search"></i>
                <h3>No recipes found</h3>
                <p>Try adjusting your search or add a new recipe!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredRecipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <div class="recipe-image">
                ${getRecipeIcon(recipe.category)}
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${escapeHtml(recipe.name)}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${escapeHtml(recipe.time)}</span>
                    <span><i class="fas fa-users"></i> ${recipe.servings}</span>
                </div>
                <p class="recipe-description">${escapeHtml(recipe.description)}</p>
                <span class="recipe-category">${escapeHtml(recipe.category)}</span>
            </div>
        </div>
    `).join('');
}

// Get icon for recipe category
function getRecipeIcon(category) {
    const icons = {
        breakfast: '<i class="fas fa-coffee"></i>',
        lunch: '<i class="fas fa-hamburger"></i>',
        dinner: '<i class="fas fa-drumstick-bite"></i>',
        dessert: '<i class="fas fa-ice-cream"></i>',
        snack: '<i class="fas fa-cookie-bite"></i>'
    };
    return icons[category] || '<i class="fas fa-utensils"></i>';
}

// Filter recipes by category
function filterRecipes(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayRecipes();
}

// Search recipes
function searchRecipes() {
    displayRecipes();
}

// Show recipe detail modal
function showRecipeDetail(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    
    const content = `
        <div class="recipe-detail">
            <h2>${escapeHtml(recipe.name)}</h2>
            <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">${escapeHtml(recipe.description)}</p>
            
            <div class="detail-meta">
                <div class="detail-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>Cook Time: ${escapeHtml(recipe.time)}</span>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-users"></i>
                    <span>Servings: ${recipe.servings}</span>
                </div>
                <div class="detail-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>Category: ${escapeHtml(recipe.category)}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-list"></i> Ingredients</h3>
                <ul class="ingredients-list">
                    ${recipe.ingredients.map(ingredient => 
                        `<li>${escapeHtml(ingredient)}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-tasks"></i> Instructions</h3>
                <ol class="instructions-list">
                    ${recipe.instructions.map(instruction => 
                        `<li>${escapeHtml(instruction)}</li>`
                    ).join('')}
                </ol>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button class="btn-primary" onclick="deleteRecipe(${recipe.id})">
                    <i class="fas fa-trash"></i> Delete Recipe
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('recipeDetailContent').innerHTML = content;
    document.getElementById('recipeDetailModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close recipe detail modal
function closeRecipeDetailModal() {
    document.getElementById('recipeDetailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open add recipe modal
function openAddRecipeModal() {
    document.getElementById('addRecipeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close add recipe modal
function closeAddRecipeModal() {
    document.getElementById('addRecipeModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('recipeForm').reset();
}

// Add new recipe
function addRecipe(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const newRecipe = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('recipeName').value.trim(),
        category: document.getElementById('recipeCategory').value,
        time: document.getElementById('recipeTime').value.trim(),
        servings: parseInt(document.getElementById('recipeServings').value),
        description: document.getElementById('recipeDescription').value.trim(),
        ingredients: document.getElementById('recipeIngredients').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0),
        instructions: document.getElementById('recipeInstructions').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
    };
    
    // Validation
    if (!newRecipe.name || !newRecipe.category || !newRecipe.time || 
        !newRecipe.servings || !newRecipe.description || 
        newRecipe.ingredients.length === 0 || newRecipe.instructions.length === 0) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    // Add to recipes array
    recipes.push(newRecipe);
    
    // Save to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));
    
    // Close modal and refresh display
    closeAddRecipeModal();
    displayRecipes();
    
    // Show success message
    showSuccessMessage('Recipe added successfully!');
}

// Delete recipe
function deleteRecipe(id) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        recipes = recipes.filter(recipe => recipe.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        closeRecipeDetailModal();
        displayRecipes();
        showSuccessMessage('Recipe deleted successfully!');
    }
}

// Show success message
function showSuccessMessage(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.display = 'block';
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '1001';
    successDiv.style.background = '#d4edda';
    successDiv.style.border = '1px solid #c3e6cb';
    successDiv.style.color = '#155724';
    successDiv.style.padding = '1rem';
    successDiv.style.borderRadius = '8px';
    successDiv.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i> ${escapeHtml(message)}
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modals when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addRecipeModal');
    const detailModal = document.getElementById('recipeDetailModal');
    
    if (event.target === addModal) {
        closeAddRecipeModal();
    }
    if (event.target === detailModal) {
        closeRecipeDetailModal();
    }
}

// Handle Enter key in search
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchRecipes();
    }
});

// Export recipes as JSON (bonus feature)
function exportRecipes() {
    const dataStr = JSON.stringify(recipes, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'my-recipes.json';
    link.click();
}

// Import recipes from JSON file (bonus feature)
function importRecipes(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedRecipes = JSON.parse(e.target.result);
            if (Array.isArray(importedRecipes)) {
                recipes = [...recipes, ...importedRecipes];
                localStorage.setItem('recipes', JSON.stringify(recipes));
                displayRecipes();
                showSuccessMessage('Recipes imported successfully!');
            } else {
                alert('Invalid recipe file format.');
            }
        } catch (error) {
            alert('Error reading file. Please make sure it\'s a valid JSON file.');
        }
    };
    reader.readAsText(file);
}
