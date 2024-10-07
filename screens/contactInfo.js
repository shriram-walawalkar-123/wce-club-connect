import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectContactInfo } from '../slices/clubSlice'; // Import the selector

const ContactInfo = ({ route }) => {
  const { clubId } = route.params;
  const contactInfo = useSelector(selectContactInfo); // Get contact info from Redux

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Info for Club {clubId}</Text>
      <Text style={styles.info}>Phone: {contactInfo.phone}</Text>
      <Text style={styles.info}>Email: {contactInfo.email}</Text>
      <Text style={styles.info}>Instagram: {contactInfo.instagram}</Text>
      <Text style={styles.info}>LinkedIn: {contactInfo.linkedin}</Text>
      <Text style={styles.info}>Twitter: {contactInfo.twitter}</Text>
      <Text style={styles.info}>GitHub: {contactInfo.github}</Text>
      <Text style={styles.info}>Facebook: {contactInfo.facebook}</Text>
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
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ContactInfo;
