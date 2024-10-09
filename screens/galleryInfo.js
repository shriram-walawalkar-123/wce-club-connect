import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectGallery } from '../slices/clubSlice'; // Correct the path if necessary

const GalleryInfo = ({ route }) => {
  const { clubId } = route.params; // Get clubId from navigation params

  const gallery = useSelector(selectGallery); // Get the gallery array from Redux state

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery of Club {clubId}</Text>
      {gallery.length > 0 ? (
        <FlatList
          data={gallery} // Display images from the gallery
          renderItem={renderImage}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2} // Display images in 2 columns
          contentContainerStyle={styles.galleryContent} // Center the gallery content
        />
      ) : (
        <Text style={styles.noImagesText}>No images available for this club</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 16,
    
    backgroundColor:'#e7e7c7',
  },
  title: {
    marginTop:110,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#003366',
    textAlign: 'center', // Center the title text
  },
  galleryContent: {
    // justifyContent: 'center', // Center gallery content vertically
    alignItems: 'center', // Center gallery content horizontally
    flexGrow: 1, // Ensures that content takes up the available space to center properly
  },
  imageContainer: {
    // padding: 10,
    alignItems: 'center', // Center image within its container
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  noImagesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GalleryInfo;
