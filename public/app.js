// Initialize Socket.IO connection
const socket = io();

// DOM Elements
const addRecipeBtn = document.getElementById('addRecipeBtn');
const addRecipeModal = document.getElementById('addRecipeModal');
const recipeDetailModal = document.getElementById('recipeDetailModal');
const addRecipeForm = document.getElementById('addRecipeForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipeGrid = document.getElementById('recipeGrid');
const categoryFilters = document.getElementById('categoryFilters');
const connectionStatus = document.getElementById('connectionStatus');

// State
let allRecipes = [];
let filteredRecipes = [];
let currentCategory = '';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadRecipes();
    loadCategories();
    setupEventListeners();
    setupSocketListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Modal controls
    addRecipeBtn.addEventListener('click', () => openModal(addRecipeModal));
    
    // Close modal buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });
    
    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        closeModal(addRecipeModal);
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Form submission
    addRecipeForm.addEventListener('submit', handleAddRecipe);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Real-time search
    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

// Setup Socket.IO listeners
function setupSocketListeners() {
    socket.on('connect', () => {
        updateConnectionStatus(true);
    });
    
    socket.on('disconnect', () => {
        updateConnectionStatus(false);
    });
    
    socket.on('recipeAdded', (recipe) => {
        allRecipes.push(recipe);
        filterAndDisplayRecipes();
        loadCategories();
        showNotification('New recipe added!', 'success');
    });
    
    socket.on('recipeUpdated', (recipe) => {
        const index = allRecipes.findIndex(r => r.id === recipe.id);
        if (index !== -1) {
            allRecipes[index] = recipe;
            filterAndDisplayRecipes();
            showNotification('Recipe updated!', 'info');
        }
    });
    
    socket.on('recipeDeleted', (recipeId) => {
        allRecipes = allRecipes.filter(r => r.id !== recipeId);
        filterAndDisplayRecipes();
        loadCategories();
        showNotification('Recipe deleted!', 'warning');
    });
    
    socket.on('terminalOutput', (output) => {
        console.log('Terminal Output:', output);
    });
}

// Load all recipes
async function loadRecipes() {
    try {
        showLoading();
        const response = await fetch('/api/recipes');
        if (!response.ok) throw new Error('Failed to fetch recipes');
        
        allRecipes = await response.json();
        filterAndDisplayRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
        showError('Failed to load recipes. Please try again.');
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Display categories
function displayCategories(categories) {
    categoryFilters.innerHTML = '<button class="category-btn active" data-category="">All</button>';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        button.setAttribute('data-category', category.toLowerCase());
        button.addEventListener('click', () => filterByCategory(category.toLowerCase()));
        categoryFilters.appendChild(button);
    });
}

// Filter by category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    filterAndDisplayRecipes();
}

// Filter and display recipes
function filterAndDisplayRecipes() {
    let recipes = [...allRecipes];
    
    // Apply category filter
    if (currentCategory) {
        recipes = recipes.filter(recipe => 
            recipe.category.toLowerCase() === currentCategory
        );
    }
    
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        recipes = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.ingredients.some(ingredient => 
                ingredient.toLowerCase().includes(searchTerm)
            )
        );
    }
    
    filteredRecipes = recipes;
    displayRecipes(filteredRecipes);
}

// Display recipes in grid
function displayRecipes(recipes) {
    if (recipes.length === 0) {
        recipeGrid.innerHTML = `
            <div class="no-recipes">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>No recipes found</h3>
                <p>Try adjusting your search or add a new recipe!</p>
            </div>
        `;
        return;
    }
    
    recipeGrid.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

// Create recipe card HTML
function createRecipeCard(recipe) {
    const ingredientsPreview = recipe.ingredients.slice(0, 3).join(', ') + 
        (recipe.ingredients.length > 3 ? '...' : '');
    
    return `
        <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
            <div class="recipe-header">
                <h3>${escapeHtml(recipe.title)}</h3>
                <div class="description">${escapeHtml(recipe.description)}</div>
            </div>
            <div class="recipe-body">
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${escapeHtml(recipe.cookTime || 'N/A')}</span>
                    <span><i class="fas fa-users"></i> ${escapeHtml(recipe.servings || 'N/A')}</span>
                </div>
                <div class="recipe-ingredients">
                    <h4>Ingredients:</h4>
                    <div class="ingredients-preview">${escapeHtml(ingredientsPreview)}</div>
                </div>
                <div class="recipe-category">${escapeHtml(recipe.category)}</div>
            </div>
        </div>
    `;
}

// Show recipe detail modal
async function showRecipeDetail(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch recipe details');
        
        const recipe = await response.json();
        displayRecipeDetail(recipe);
        openModal(recipeDetailModal);
    } catch (error) {
        console.error('Error loading recipe details:', error);
        showError('Failed to load recipe details.');
    }
}

// Display recipe detail in modal
function displayRecipeDetail(recipe) {
    document.getElementById('detailTitle').textContent = recipe.title;
    
    const content = `
        <div class="recipe-detail">
            <h2>${escapeHtml(recipe.title)}</h2>
            <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">${escapeHtml(recipe.description)}</p>
            
            <div class="meta-info">
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>Cook Time: ${escapeHtml(recipe.cookTime || 'N/A')}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-users"></i>
                    <span>Servings: ${escapeHtml(recipe.servings || 'N/A')}</span>
                </div>
                <div class="meta-item">
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
        </div>
    `;
    
    document.getElementById('recipeDetailContent').innerHTML = content;
}

// Handle add recipe form submission
async function handleAddRecipe(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const recipeData = {
        title: document.getElementById('recipeTitle').value.trim(),
        description: document.getElementById('recipeDescription').value.trim(),
        category: document.getElementById('recipeCategory').value.trim() || 'Other',
        cookTime: document.getElementById('cookTime').value.trim(),
        servings: document.getElementById('servings').value.trim(),
        ingredients: document.getElementById('ingredients').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0),
        instructions: document.getElementById('instructions').value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
    };
    
    // Validation
    if (!recipeData.title || !recipeData.description || 
        recipeData.ingredients.length === 0 || recipeData.instructions.length === 0) {
        showError('Please fill in all required fields.');
        return;
    }
    
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        });
        
        if (!response.ok) throw new Error('Failed to add recipe');
        
        const newRecipe = await response.json();
        closeModal(addRecipeModal);
        addRecipeForm.reset();
        showNotification('Recipe added successfully!', 'success');
    } catch (error) {
        console.error('Error adding recipe:', error);
        showError('Failed to add recipe. Please try again.');
    }
}

// Handle search
function handleSearch() {
    filterAndDisplayRecipes();
}

// Modal functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Update connection status
function updateConnectionStatus(connected) {
    const statusEl = connectionStatus.querySelector('span');
    const iconEl = connectionStatus.querySelector('i');
    
    if (connected) {
        connectionStatus.classList.remove('disconnected');
        statusEl.textContent = 'Connected';
        iconEl.className = 'fas fa-wifi';
    } else {
        connectionStatus.classList.add('disconnected');
        statusEl.textContent = 'Disconnected';
        iconEl.className = 'fas fa-wifi-slash';
    }
}

// Show loading state
function showLoading() {
    recipeGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading delicious recipes...</p>
        </div>
    `;
}

// Show error message
function showError(message) {
    showNotification(message, 'error');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '1001',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.9rem',
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-recipes {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
    }
    
    .no-recipes h3 {
        color: #333;
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);
