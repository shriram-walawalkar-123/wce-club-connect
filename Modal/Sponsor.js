import { StyleSheet,View, Text, Button, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import uploadImage from '../helper/uploadImage'; // Import the uploadImage function

export default function Sponsor({ setEvent, event, closeModal }) {
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorImage, setSponsorImage] = useState(null);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    // Ask for permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSponsorImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Function to add a sponsor
  const addSponsor = async() => {   
     let uploadedPosterUrl = sponsorImage; // Default to current URL

    // Upload the image if a new one is selected
    if (sponsorImage) {
      uploadedPosterUrl = await uploadImage(sponsorImage); // Upload to Cloudinary
      console.log("uploadedPosterUrl", uploadedPosterUrl);
    }


    setEvent(prevEvent => ({
      ...prevEvent,
      mainEvent: {
        ...prevEvent.mainEvent,
        sponsors: [...prevEvent.mainEvent.sponsors, { name: sponsorName, image: sponsorImage }],
      },
    }));
    setSponsorName(''); // Clear sponsor name input
    setSponsorImage(null); // Clear the selected image
    closeModal(); // Close the modal after updating
  };

  return (
    <View>
      <Text>Add Sponsor</Text>

      {/* TextInput for sponsor name */}
      <TextInput
        placeholder="Sponsor Name"
        value={sponsorName}
        onChangeText={setSponsorName}
      />

      {/* Button to pick an image */}
      <Button title="Pick Sponsor Image" onPress={pickImage} />

      {/* Display the selected image */}
      {sponsorImage && (
        <Image
          source={{ uri: sponsorImage }}
          style={{ width: 100, height: 100, marginTop: 10 }}
        />
      )}

      {/* Button to add sponsor */}
      <Button title="Add Sponsor" onPress={addSponsor} />

      {/* Button to close the modal */}
      <Button title="Close" onPress={closeModal} />
    </View>
  );
}
