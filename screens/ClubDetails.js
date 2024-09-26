import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { clubs } from '../ClubData'; 

// Screens for each tab
function ClubMembers() {
  return (
    <View style={styles.tabContainer}>
      <Text>Club Members List</Text>
    </View>
  );
}

function Blogs() {
  return (
    <View style={styles.tabContainer}>
      <Text>Club Blogs</Text>
    </View>
  );
}

function ClubServices() {
  return (
    <View style={styles.tabContainer}>
      <Text>Services Provided by the Club</Text>
    </View>
  );
}

function Events() {
  return (
    <View style={styles.tabContainer}>
      <Text>Upcoming and Past Events</Text>
    </View>
  );
}

function Gallery() {
  return (
    <View style={styles.tabContainer}>
      <Text>Gallery</Text>
    </View>
  );
}

function ContactUs() {
  return (
    <View style={styles.tabContainer}>
      <Text>Contact Information</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function ClubDetails({ route }) {
  const { clubId } = route.params;
  const club = clubs.find((c) => c.id === clubId);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Image source={{ uri: club.image }} style={styles.logo} />
        <Text style={styles.clubName}>{club.name}</Text>
        <Text style={styles.clubDescription}>{club.description}</Text>
      </View>

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
  tabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
