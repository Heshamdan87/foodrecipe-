/**
 * RecipesFormScreen.js - React Native Component
 * 
 * A React Native component that allows users to create or edit recipes.
 * Features input fields for recipe title, image, and description.
 * Includes save functionality with AsyncStorage for local persistence.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const RecipesFormScreen = ({ navigation, route }) => {
  // Extract parameters from route
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route?.params || {};

  // State management for form fields
  const [title, setTitle] = useState(recipeToEdit?.title || '');
  const [image, setImage] = useState(recipeToEdit?.image || '');
  const [description, setDescription] = useState(recipeToEdit?.description || '');

  /**
   * Save recipe function - handles both creating new recipes and editing existing ones
   * Uses AsyncStorage for local persistence
   */
  const saverecipe = async () => {
    try {
      // Validate required fields
      if (!title.trim()) {
        Alert.alert('Validation Error', 'Please enter a recipe title');
        return;
      }

      if (!description.trim()) {
        Alert.alert('Validation Error', 'Please enter a recipe description');
        return;
      }

      // Initialize new recipe object
      const newrecipe = {
        id: recipeToEdit?.id || Date.now().toString(), // Use existing ID or generate new one
        title: title.trim(),
        image: image.trim() || 'https://via.placeholder.com/300x200?text=No+Image',
        description: description.trim(),
        dateCreated: recipeToEdit?.dateCreated || new Date().toISOString(),
        dateModified: new Date().toISOString()
      };

      // Retrieve existing recipes from AsyncStorage
      const existingRecipesData = await AsyncStorage.getItem('customrecipes');
      let recipes = [];
      
      if (existingRecipesData) {
        recipes = JSON.parse(existingRecipesData);
      }

      // Update or add recipe based on whether we're editing
      if (recipeToEdit && recipeIndex !== undefined) {
        // Editing existing recipe
        recipes[recipeIndex] = newrecipe;
        
        // Call the callback function if provided
        if (onrecipeEdited) {
          onrecipeEdited(newrecipe, recipeIndex);
        }
        
        Alert.alert(
          'Success', 
          'Recipe updated successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Adding new recipe
        recipes.push(newrecipe);
        
        Alert.alert(
          'Success', 
          'Recipe created successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }

      // Save updated recipes array back to AsyncStorage
      await AsyncStorage.setItem('customrecipes', JSON.stringify(recipes));

      // Navigate back to previous screen
      navigation.goBack();

    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert(
        'Error', 
        'Failed to save recipe. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {recipeToEdit ? 'Edit Recipe' : 'Add New Recipe'}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Recipe Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Recipe Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter recipe title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Image URL Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            value={image}
            onChangeText={setImage}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Image Preview */}
        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>Upload Image URL</Text>
            </View>
          )}
        </View>

        {/* Recipe Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter recipe description, ingredients, and instructions"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saverecipe}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {recipeToEdit ? 'Update Recipe' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
  },
  form: {
    padding: wp(4),
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#495057',
    marginBottom: hp(0.5),
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    fontSize: hp(1.8),
    color: '#495057',
  },
  textArea: {
    height: hp(15),
    textAlignVertical: 'top',
  },
  imageContainer: {
    marginBottom: hp(2),
    alignItems: 'center',
  },
  imagePreview: {
    width: wp(80),
    height: hp(25),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  imagePlaceholder: {
    width: wp(80),
    height: hp(25),
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: hp(1.8),
    color: '#6c757d',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    borderRadius: 8,
    alignItems: 'center',
    marginTop: hp(2),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});

export default RecipesFormScreen;
