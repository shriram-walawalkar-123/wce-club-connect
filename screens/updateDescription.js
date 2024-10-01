import React, { useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateClubDescription,
  selectClubDescription,
  selectClubId // Import the selector for clubId
} from '../slices/clubSlice';
import SummaryApi from '../backendRoutes';

const { width, height } = Dimensions.get('window');

const UpdateDescriptionScreen = () => {
  const dispatch = useDispatch();
  const description = useSelector(selectClubDescription);
  const clubId = useSelector(selectClubId); // Get the current club ID
  const [newDescription, setNewDescription] = React.useState(description);
  console.log("club id is : ",clubId);
  
  const handleUpdate = async () => {
    // Ensure the user is updating their own club description
    if (clubId) {
      try {
        const response = await fetch(`${SummaryApi.updateClub.url}/${clubId}`, {
          method: SummaryApi.updateClub.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description: newDescription }), // Include the new description in the request
        });

        const data = await response.json();
        if (data.success) {
          dispatch(updateClubDescription(newDescription)); // Update local state in Redux
          Alert.alert('Success', 'Club description updated successfully');
        } else {
          Alert.alert('Error', data.message || 'Failed to update description');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while updating the description');
      }
    } else {
      Alert.alert('Error', 'Club ID not found');
    }
  };

  useEffect(() => {
    setNewDescription(description); // Update local state when the global state changes
  }, [description]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Description:</Text>
      <Text style={styles.description}>{description}</Text>
      <TextInput
        style={styles.input}
        value={newDescription}
        onChangeText={(text) => setNewDescription(text)}
        placeholder="Enter new description"
        multiline
      />
      <Button title="Update Description" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
  },
  label: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: width * 0.04,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: height * 0.15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: width * 0.04,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default UpdateDescriptionScreen;
