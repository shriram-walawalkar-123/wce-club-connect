import React from 'react';
import { View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AllUploadedEvents from './allUploadedEvents'; // Component to show all events

const UploadEventScreen = () => {
  const navigation = useNavigation();
  const handleNavigateToUpload = () => {
    navigation.navigate('AddEvent'); // Pass the handler to the next screen
  };

  return (
    <View>
      {/* Upload event button */}
      <View style={{ marginBottom: 20 }}>
        <Button title="Upload Event" onPress={handleNavigateToUpload} />
      </View>

      {/* Render the component that shows all uploaded events */}
      <AllUploadedEvents  />
    </View>
  );
};

export default UploadEventScreen;
