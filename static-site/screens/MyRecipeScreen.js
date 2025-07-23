/**
 * MyRecipeScreen.js - React Native Component
 * Displays user-created recipes with CRUD operations
 * 
 * This component manages custom recipes with AsyncStorage persistence
 * and integrates with CustomRecipesScreen and RecipesFormScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const MyRecipeScreen = () => {
  // State Management
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation hook
  const navigation = useNavigation();

  /**
   * Fetch recipes from AsyncStorage (useEffect implementation)
   * Retrieves stored custom recipes from local storage
   */
  const fetchRecipes = async () => {
    try {
      console.log('Fetching custom recipes from AsyncStorage...');
      
      // Use AsyncStorage.getItem to get stored recipes
      const storedRecipes = await AsyncStorage.getItem('customrecipes');
      
      if (storedRecipes) {
        // Parse and set recipes if found
        const parsedRecipes = JSON.parse(storedRecipes);
        setRecipes(parsedRecipes);
        console.log('Found recipes:', parsedRecipes.length);
      } else {
        // No recipes found, set empty array
        setRecipes([]);
        console.log('No custom recipes found');
      }
      
      // Update loading state
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setLoading(false);
      setRecipes([]);
    }
  };

  // useEffect hook to fetch recipes when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  /**
   * Handle recipe click - Navigate to CustomRecipesScreen
   * @param {Object} recipe - Selected recipe object
   * @param {Number} index - Recipe index for dynamic styling
   */
  const handleRecipeClick = (recipe, index = 0) => {
    console.log('Navigating to CustomRecipesScreen with recipe:', recipe.title);
    
    // Navigate to CustomRecipesScreen passing recipe data
    navigation.navigate('CustomRecipesScreen', { 
      recipe,
      index 
    });
  };

  /**
   * Handle add new recipe - Navigate to RecipesFormScreen
   */
  const handleAddRecipe = () => {
    console.log('Navigating to RecipesFormScreen for new recipe');
    
    // Navigate to form screen for adding new recipe
    navigation.navigate('RecipesFormScreen');
  };

  /**
   * Edit recipe function - Navigate to RecipesFormScreen with recipe data
   * @param {Object} recipe - Recipe object to be edited
   * @param {Number} index - Index of recipe in the list
   */
  const editRecipe = (recipe, index) => {
    console.log('Editing recipe:', recipe.title, 'at index:', index);
    
    // Navigate to RecipesFormScreen with recipe data for editing
    navigation.navigate('RecipesFormScreen', {
      recipeToEdit: recipe,
      recipeIndex: index,
      onrecipeEdited: (updatedRecipe, recipeIndex) => {
        // Callback to update the recipe in the list after editing
        const updatedRecipes = [...recipes];
        updatedRecipes[recipeIndex] = updatedRecipe;
        setRecipes(updatedRecipes);
      }
    });
  };

  /**
   * Delete recipe function - Remove recipe from storage and state
   * @param {Number} index - Index of recipe to delete
   */
  const deleteRecipe = async (index) => {
    try {
      console.log('Deleting recipe at index:', index);
      
      // Show confirmation alert before deletion
      Alert.alert(
        'Delete Recipe',
        'Are you sure you want to delete this recipe?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              // Clone the recipes array using spread operator
              const updatedRecipes = [...recipes];
              
              // Remove the recipe at specified index using splice
              updatedRecipes.splice(index, 1);
              
              // Update AsyncStorage with updated recipes array
              await AsyncStorage.setItem('customrecipes', JSON.stringify(updatedRecipes));
              
              // Update component state
              setRecipes(updatedRecipes);
              
              console.log('Recipe deleted successfully. Remaining recipes:', updatedRecipes.length);
            },
          },
        ]
      );
      
    } catch (error) {
      console.error('Error deleting recipe:', error);
      Alert.alert('Error', 'Failed to delete recipe. Please try again.');
    }
  };

  /**
   * Render loading indicator (ActivityIndicator)
   */
  const renderLoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Loading your recipes...</Text>
    </View>
  );

  /**
   * Render empty state when no recipes exist
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No recipes yet!</Text>
      <Text style={styles.emptySubtitle}>Start creating your own custom recipes</Text>
      <TouchableOpacity 
        style={styles.createFirstButton} 
        onPress={handleAddRecipe}
        activeOpacity={0.8}
      >
        <Text style={styles.createFirstButtonText}>➕ Create Your First Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render individual recipe card
   * @param {Object} recipe - Recipe object
   * @param {Number} index - Recipe index
   */
  const renderRecipeCard = (recipe, index) => {
    // Truncate description to first 50 characters and append "..."
    const truncatedDescription = recipe.description && recipe.description.length > 50 
      ? recipe.description.substring(0, 50) + '...'
      : recipe.description || 'No description available';

    return (
      <View key={index} style={styles.recipeCard}>
        {/* TouchableOpacity for recipe click */}
        <TouchableOpacity 
          style={styles.recipeContent}
          onPress={() => handleRecipeClick(recipe, index)}
          activeOpacity={0.8}
        >
          {/* Recipe Image Container with testID="handlerecipeBtn" */}
          <View testID="handlerecipeBtn" style={styles.imageContainer}>
            {recipe.image ? (
              <Image
                source={{ uri: recipe.image }}
                style={styles.recipeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderIcon}>🍽️</Text>
              </View>
            )}
          </View>
          
          {/* Recipe Details */}
          <View style={styles.recipeDetails}>
            <Text style={styles.recipeTitle} numberOfLines={2}>
              {recipe.title || 'Untitled Recipe'}
            </Text>
            
            {/* Recipe Description with testID="recipeDescp" */}
            <Text 
              testID="recipeDescp" 
              style={styles.recipeDescription}
              numberOfLines={2}
            >
              {truncatedDescription}
            </Text>
            
            <View style={styles.recipeMeta}>
              <Text style={styles.recipeCategory}>
                {recipe.category || 'Custom'}
              </Text>
              <Text style={styles.recipeTime}>
                {recipe.cookTime || '30'} mins
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Edit/Delete Buttons Container with testID="editDeleteButtons" */}
        <View testID="editDeleteButtons" style={styles.actionButtons}>
          {/* Edit Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => editRecipe(recipe, index)}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
          
          {/* Delete Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteRecipe(index)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Render recipes list
   */
  const renderRecipesList = () => (
    <View style={styles.recipesContainer}>
      {recipes.map((recipe, index) => renderRecipeCard(recipe, index))}
    </View>
  );

  /**
   * Main Component Render
   */
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Custom Recipes</Text>
        
        {/* Add New Recipe Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddRecipe}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          {/* Conditional Rendering */}
          {loading ? (
            renderLoadingIndicator()
          ) : recipes.length === 0 ? (
            renderEmptyState()
          ) : (
            renderRecipesList()
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  backButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  backButtonText: {
    fontSize: hp(2),
    color: '#007bff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#343a40',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: hp(2.5),
    color: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: wp(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: hp(2),
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  emptyIcon: {
    fontSize: hp(8),
    marginBottom: hp(2),
  },
  emptyTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: hp(1.8),
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  createFirstButton: {
    backgroundColor: '#007bff',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: '#ffffff',
    fontSize: hp(1.8),
    fontWeight: '600',
  },
  recipesContainer: {
    flex: 1,
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: hp(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  recipeContent: {
    flexDirection: 'row',
    padding: wp(3),
  },
  imageContainer: {
    width: wp(20),
    height: wp(20),
    marginRight: wp(3),
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: hp(3),
  },
  recipeDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recipeTitle: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.8),
    color: '#6c757d',
    lineHeight: hp(2.5),
    marginBottom: hp(1),
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeCategory: {
    fontSize: hp(1.6),
    color: '#007bff',
    fontWeight: '600',
  },
  recipeTime: {
    fontSize: hp(1.6),
    color: '#28a745',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
  },
  deleteButton: {
    // No additional styles needed
  },
  editButtonText: {
    fontSize: hp(1.8),
    color: '#007bff',
    fontWeight: '600',
  },
  deleteButtonText: {
    fontSize: hp(1.8),
    color: '#dc3545',
    fontWeight: '600',
  },
});

export default MyRecipeScreen;
