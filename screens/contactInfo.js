import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactInfo = ({ route }) => {
  // Extract clubData from route params
  const { clubData } = route.params;
  // console.log("clubData",clubData);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Info for {clubData?.clubName}</Text>
      <View style={styles.card}>
        <Text style={styles.info}>Phone: {clubData?.phoneNumber}</Text>
        <Text style={styles.info}>Email: {clubData?.email}</Text>
        <Text style={styles.info}>Website: {clubData?.website}</Text>
        <Text style={styles.info}>LinkedIn: {clubData?.linkedin}</Text>
        <Text style={styles.info}>Twitter: {clubData?.twitter}</Text>
        <Text style={styles.info}>GitHub: {clubData?.github}</Text>
        <Text style={styles.info}>Instagram: {clubData?.instagram}</Text>
        <Text style={styles.info}>Facebook: {clubData?.facebook}</Text>
        <Text style={styles.info}>YouTube: {clubData?.youtube}</Text>
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
    marginTop: 20,
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
    elevation: 5, // Shadow effect for Android
    alignItems: 'flex-start',
  },
  info: {
    color: 'lightblue',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default ContactInfo;
