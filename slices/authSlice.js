import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, TextInput, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import SummaryApi from '../backendRoutes'; // Ensure your routes are correctly defined

const Tab = createMaterialTopTabNavigator();

export default function ClubDetails({ route }) {
  const { clubId, userRole } = route.params; // Assuming userRole is passed from previous screen
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState('');
  const [blogs, setBlogs] = useState('');
  const [services, setServices] = useState('');
  const [events, setEvents] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    // Fetch club data based on clubId
    const fetchClubData = async () => {
      try {
        const response = await fetch(`${SummaryApi.clubMembers.url}/${clubId}`);
        const data = await response.json();
        setClub(data);
      } catch (error) {
        console.error('Error fetching club data:', error);
      }
    };

    fetchClubData();
  }, [clubId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(SummaryApi.clubMembers.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          members,
          blogs,
          services,
          events,
          contact,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Club information updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update club information.');
      }
    } catch (error) {
      console.error('Error updating club information:', error);
      Alert.alert('Error', 'An error occurred while updating.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {club && (
        <>
          <View style={styles.headerContainer}>
            <Image source={{ uri: club.image }} style={styles.logo} />
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubDescription}>{club.description}</Text>
          </View>

          {userRole === 'club' && ( // Check user role
            <View style={styles.updateContainer}>
              <TextInput
                style={styles.input}
                placeholder="Update Club Members"
                value={members}
                onChangeText={setMembers}
              />
              <TextInput
                style={styles.input}
                placeholder="Update Club Blogs"
                value={blogs}
                onChangeText={setBlogs}
              />
              <TextInput
                style={styles.input}
                placeholder="Update Club Services"
                value={services}
                onChangeText={setServices}
              />
              <TextInput
                style={styles.input}
                placeholder="Update Club Events"
                value={events}
                onChangeText={setEvents}
              />
              <TextInput
                style={styles.input}
                placeholder="Update Contact Information"
                value={contact}
                onChangeText={setContact}
              />
              <Button title="Update Club Info" onPress={handleUpdate} />
            </View>
          )}

          <NavigationContainer independent={true}>
            <Tab.Navigator
              initialRouteName="ClubMembers"
              screenOptions={{
                tabBarLabelStyle: { fontSize: 12 },
                tabBarIndicatorStyle: { backgroundColor: 'blue' },
                tabBarStyle: { backgroundColor: '#f5f5f5' },
              }}
            >
              <Tab.Screen name="Club Members" component={ClubMembers} />
              <Tab.Screen name="Blogs" component={Blogs} />
              <Tab.Screen name="Club Services" component={ClubServices} />
              <Tab.Screen name="Events" component={Events} />
              <Tab.Screen name="Gallery" component={Gallery} />
              <Tab.Screen name="Contact Us" component={ContactUs} />
            </Tab.Navigator>
          </NavigationContainer>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clubDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  updateContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
