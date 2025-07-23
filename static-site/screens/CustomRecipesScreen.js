/**
 * CustomRecipesScreen.js - React Native Component
 * 
 * A React Native screen component that displays recipe details and allows
 * users to mark recipes as favorites. Integrates with Redux for state management
 * and uses React Navigation for screen navigation.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { toggleFavorite } from '../redux/favoritesSlice';

const CustomRecipesScreen = () => {
  // Navigation and route hooks
  const navigation = useNavigation();
  const route = useRoute();
  
  // Redux hooks
  const dispatch = useDispatch();
  const favoriteRecipes = useSelector(state => state.favorites.favoriteRecipes);
  
  // Extract recipe data from route parameters
  const { recipe, index = 0 } = route.params || {};
  
  // Check if current recipe is in favorites
  const isFavorite = recipe ? favoriteRecipes.includes(recipe.idCategory) : false;
  
  /**
   * Handle toggling favorite status of the recipe
   * Dispatches Redux action to add/remove from favorites
   */
  const handleToggleFavorite = () => {
    if (recipe && recipe.idCategory) {
      dispatch(toggleFavorite(recipe.idCategory));
    }
  };
  
  // Display fallback message if no recipe data is available
  if (!recipe) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Recipe Details Available</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Recipe Image Container */}
      <View testID="imageContainer" style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || recipe.strCategoryThumb }}
          style={[
            styles.articleImage,
            {
              height: index % 3 === 0 ? hp(25) : hp(35),
            }
          ]}
          resizeMode="cover"
        />
      </View>
      
      {/* Top Buttons Container */}
      <View testID="topButtonsContainer" style={styles.topButtonsContainer}>
        {/* Go Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
        
        {/* Favorite Toggle Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content Container */}
      <View testID="contentContainer" style={styles.contentContainer}>
        {/* Recipe Title */}
        <Text style={styles.recipeTitle}>
          {recipe.title || recipe.strCategory || 'Untitled Recipe'}
        </Text>
        
        {/* Recipe Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.contentLabel}>Content</Text>
          <Text style={styles.recipeDescription}>
            {recipe.description || 
             recipe.strCategoryDescription || 
             'No description available for this recipe. This is a delicious recipe that you can try at home with simple ingredients and easy steps.'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  noDataText: {
    fontSize: hp(2.5),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  articleImage: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: hp(1.8),
    fontWeight: '600',
  },
  favoriteButton: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  favoriteIcon: {
    fontSize: hp(3),
    color: '#ff6b6b',
    textAlign: 'center',
  },
  contentContainer: {
    padding: wp(4),
    backgroundColor: '#ffffff',
  },
  recipeTitle: {
    fontSize: hp(3),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(2),
    lineHeight: hp(3.5),
  },
  descriptionContainer: {
    marginTop: hp(1),
  },
  contentLabel: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#555',
    marginBottom: hp(1.5),
  },
  recipeDescription: {
    fontSize: hp(2),
    color: '#666',
    lineHeight: hp(2.8),
    textAlign: 'justify',
  },
});

export default CustomRecipesScreen;
