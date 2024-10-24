import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Dimensions, Modal } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Button } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const ContactInfo = ({ clubData, onClose, visible }) => {
  const [panelHeight] = useState(height * 0.8); // 80% of screen height

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied to Clipboard', text);
  };

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

  const handlePhonePress = () => {
    const phoneNumber = `tel:${clubData?.phoneNumber}`;
    Linking.openURL(phoneNumber);
  };

  const handleEmailPress = () => {
    const email = `mailto:${clubData?.email}`;
    Linking.openURL(email);
  };

  const closePanel = () => {
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { height: panelHeight }]}>
          <View style={styles.handle} />
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text style={styles.title}>
              {clubData?.clubName}
            </Text>

            {[
              { icon: 'phone', color: '#4CAF50', data: clubData?.phoneNumber, onPress: handlePhonePress },
              { icon: 'email', color: '#F95454', data: clubData?.email, onPress: handleEmailPress, iconFamily: 'MaterialIcons' },
              { icon: 'globe', color: '#0275d8', data: clubData?.website },
              { icon: 'linkedin-square', color: '#0077B5', data: clubData?.linkedin },
              { icon: 'twitter', color: '#1DA1F2', data: clubData?.twitter },
              { icon: 'github', color: '#333333', data: clubData?.github },
              { icon: 'instagram', color: '#E4405F', data: clubData?.instagram },
              { icon: 'facebook', color: '#4267B2', data: clubData?.facebook },
              { icon: 'youtube-play', color: '#FF0000', data: clubData?.youtube },
            ].map((item, index) => (
              <View 
                key={index} 
                style={styles.card}
              >
                {item.iconFamily === 'MaterialIcons' ? (
                  <MaterialIcons name={item.icon} size={24} color={item.color} />
                ) : (
                  <FontAwesome name={item.icon} size={24} color={item.color} />
                )}
                <Text style={styles.info}>{item.data}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={item.onPress || (() => openLink(item.data))} style={styles.iconButton}>
                    <MaterialIcons name="launch" size={24} color={item.color} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copyToClipboard(item.data)} style={styles.iconButton}>
                    <MaterialIcons name="content-copy" size={24} color={item.color} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <Button 
            onPress={closePanel} 
            style={styles.closeButton} 
            labelStyle={styles.closeButtonLabel}
            mode="contained"
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(78, 84, 92, 0.7)', // Gunmetal Gray with opacity for the background overlay
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#000401', // Jet Black for the panel background
  },
  handle: {
    width: 60,
    height: 6,
    backgroundColor: '#8d9797', // Pewter for the handle
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#e5e8e8', // White for the title text
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#4e545c', // Gunmetal Gray for the card background
    borderWidth: 1,
    borderColor: '#8d9797', // Pewter for the card border
  },
  info: {
    color: '#e5e8e8', // White for the info text
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
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(141, 151, 151, 0.2)', // Transparent Pewter for the buttons
    borderRadius: 12,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#8d9797', // Pewter for the close button
    borderRadius: 15,
  },
  closeButtonLabel: {
    color: '#000401', // Jet Black for the close button label
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ContactInfo;
