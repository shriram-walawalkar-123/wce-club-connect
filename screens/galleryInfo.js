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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },
  imageContainer: {
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
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
