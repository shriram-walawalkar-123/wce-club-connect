import React,{useEffect} from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const GalleryInfo = ({ route }) => {
  const { clubData} = route.params; // Get clubData from navigation params
  // console.log("clubdata gallert",clubData);
  const gallery = clubData?.gallary; // Access the gallery array from clubData

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery of {clubData?.clubName}</Text>
      {gallery?.length > 0 ? (
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
    backgroundColor: '#e7e7c7',
  },
  title: {
    marginTop: 110,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#003366',
    textAlign: 'center', // Center the title text
  },
  galleryContent: {
    alignItems: 'center', // Center gallery content horizontally
    flexGrow: 1, // Ensures that content takes up the available space to center properly
  },
  imageContainer: {
    alignItems: 'center', // Center image within its container
    padding: 5, // Optional: Add padding around images
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
