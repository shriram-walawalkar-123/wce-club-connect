import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateGallery } from '../slices/clubSlice';  // Redux action to update gallery

export default function GalleryScreen() {
  const dispatch = useDispatch();
  const { gallery } = useSelector((state) => state.club);  // Select gallery from Redux
  const [localGallery, setLocalGallery] = useState([...gallery]);
  const [selectedImage, setSelectedImage] = useState(null);  // State to handle selected image for viewing in modal
  const [isModalVisible, setModalVisible] = useState(false);  // State to control modal visibility

  // Function to open image picker and allow image upload
  const uploadPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the result contains assets (indicating that the user has picked a photo)
    if (result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri; // Get the first selected image's URI
      const updatedGallery = [...localGallery, selectedImageUri];  // Add new image to gallery
      setLocalGallery(updatedGallery);  // Update local state
      dispatch(updateGallery(updatedGallery));  // Update Redux state
    }
  };

  // Function to remove a photo from the gallery
  const deletePhoto = (uri) => {
    const updatedGallery = localGallery.filter((item) => item !== uri);  // Remove selected image
    setLocalGallery(updatedGallery);
    dispatch(updateGallery(updatedGallery));  // Update Redux state
  };

  // Function to open the modal with the clicked image
  const viewImage = (uri) => {
    setSelectedImage(uri);  // Set the selected image
    setModalVisible(true);  // Open the modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Club Gallery</Text>

      {/* Display existing photos */}
      <FlatList
        data={localGallery}
        keyExtractor={(item, index) => `${item}-${index}`} // Ensure unique key
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => viewImage(item)}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deletePhoto(item)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />

      {/* Upload Photo Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto}>
        <Text style={styles.uploadButtonText}>Upload New Photo</Text>
      </TouchableOpacity>

      {/* Modal to show full-screen image */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4444',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  uploadButton: {
    backgroundColor: '#003366',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});
