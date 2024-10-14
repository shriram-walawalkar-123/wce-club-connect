import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Dimensions } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard'; // For copy functionality

const { width, height } = Dimensions.get('window'); // Get device dimensions

const ContactInfo = ({ route }) => {
  const { clubData } = route.params;

  // Copy text to clipboard and show an alert
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied to Clipboard', text);
  };

  // Open the provided URL in the default browser
  const openLink = async (url) => {
    if (url) {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Unable to open URL", "The provided link is not valid.");
      }
    }
  };


    // Function to handle phone click
    const handlePhonePress = () => {
        const phoneNumber = `tel:${clubData?.phoneNumber}`;
        Linking.openURL(phoneNumber);
    };

    // Function to handle email click
    const handleEmailPress = () => {
        const email = `mailto:${clubData?.email}`;
        Linking.openURL(email);
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact Info for {clubData?.clubName}</Text>

      {/* Individual cards for each contact info */}
      <View style={[styles.card, { backgroundColor: '#E0F7FA' }]}>
        <MaterialIcons name="phone" size={24} color="#4CAF50" />
        <Text style={styles.info}>{clubData?.phoneNumber}</Text>
        <View style={styles.actions}>
            <TouchableOpacity onPress={handlePhonePress} style={styles.iconButton}>
                <MaterialIcons name="launch" size={24} color="#00796B" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(clubData?.phoneNumber)} style={styles.iconButton}>
                <MaterialIcons name="content-copy" size={24} color="#00796B" />
            </TouchableOpacity>
        </View>
</View>

<View style={[styles.card, { backgroundColor: '#FFF9C4' }]}>
        <MaterialIcons name="email" size={24} color="#F95454" />
        <Text style={styles.info}>{clubData?.email}</Text>
        <View style={styles.actions}>
            <TouchableOpacity onPress={handleEmailPress} style={styles.iconButton}>
                <MaterialIcons name="launch" size={24} color="#F57F17" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => copyToClipboard(clubData?.email)} style={styles.iconButton}>
                <MaterialIcons name="content-copy" size={24} color="#F57F17" />
            </TouchableOpacity>
        </View>
</View>



      <View style={[styles.card, { backgroundColor: '#FFECB3' }]}>
        <FontAwesome name="globe" size={24} color="#0275d8" />
        <Text style={styles.info}>{clubData?.website}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.website)}>
            <MaterialIcons name="content-copy" size={24} color="#FFC107" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.website)}>
            <FontAwesome name="external-link" size={24} color="#FFC107" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#E1F5FE' }]}>
        <FontAwesome name="linkedin-square" size={24} color="#0077B5" />
        <Text style={styles.info}>{clubData?.linkedin}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.linkedin)}>
            <MaterialIcons name="content-copy" size={24} color="#01579B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.linkedin)}>
            <FontAwesome name="external-link" size={24} color="#01579B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#E1F5FE' }]}>
        <FontAwesome name="twitter" size={24} color="#1DA1F2" />
        <Text style={styles.info}>{clubData?.twitter}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.twitter)}>
            <MaterialIcons name="content-copy" size={24} color="#0288D1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.twitter)}>
            <FontAwesome name="external-link" size={24} color="#0288D1" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#F1F8E9' }]}>
        <FontAwesome name="github" size={24} color="#333333" />
        <Text style={styles.info}>{clubData?.github}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.github)}>
            <MaterialIcons name="content-copy" size={24} color="#558B2F" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.github)}>
            <FontAwesome name="external-link" size={24} color="#558B2F" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#FCE4EC' }]}>
        <FontAwesome name="instagram" size={24} color="#E4405F" />
        <Text style={styles.info}>{clubData?.instagram}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.instagram)}>
            <MaterialIcons name="content-copy" size={24} color="#C2185B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.instagram)}>
            <FontAwesome name="external-link" size={24} color="#C2185B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#C5CAE9' }]}>
        <FontAwesome name="facebook" size={24} color="#4267B2" />
        <Text style={styles.info}>{clubData?.facebook}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.facebook)}>
            <MaterialIcons name="content-copy" size={24} color="#303F9F" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.facebook)}>
            <FontAwesome name="external-link" size={24} color="#303F9F" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: '#FCE4EC' }]}>
        <FontAwesome name="youtube-play" size={24} color="#FF0000" />
        <Text style={styles.info}>{clubData?.youtube}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => copyToClipboard(clubData?.youtube)}>
            <MaterialIcons name="content-copy" size={24} color="#D32F2F" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(clubData?.youtube)}>
            <FontAwesome name="external-link" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e7e7c7',
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9, // Responsive width based on screen size
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  info: {
    color: '#000000',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
});

export default ContactInfo;
