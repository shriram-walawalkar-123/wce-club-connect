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
      <View style={styles.card}>
        <Text style={styles.info}>Phone: {contactInfo.phone}</Text>
        <Text style={styles.info}>Email: {contactInfo.email}</Text>
        <Text style={styles.info}>Instagram: {contactInfo.instagram}</Text>
        <Text style={styles.info}>LinkedIn: {contactInfo.linkedin}</Text>
        <Text style={styles.info}>Twitter: {contactInfo.twitter}</Text>
        <Text style={styles.info}>GitHub: {contactInfo.github}</Text>
        <Text style={styles.info}>Facebook: {contactInfo.facebook}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e7e7c7',
  },
  title: {
    marginTop: 140,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
  },
  card: {
    width: '90%',
    backgroundColor: '#07768c',
    borderRadius: 10,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    elevation: 5, // Shadow effect for Android
    alignItems: 'center',
    justifyContent:'space-between',
  },
  info: {
    color: 'lightblue',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    // textAlign:'center',
  },
});

export default ContactInfo;
