import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ContactInfo from './contactInfo'; // Ensure this path is correct
import GalleryInfo from './galleryInfo'; // Ensure this path is correct
import DescriptionInfo from './DescriptionInfo'; // Ensure this path is correct
import MembersInfo from './memberInfo'; // Ensure this path is correct
import UpcomingEventsScreen from './UpcomingEventsScreen'; // Import UpcomingEventsScreen
import PastEventsScreen from './PastEventsScreen'; // Import PastEventsScreen
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import SummaryApi from '../backendRoutes';

const Tab = createMaterialTopTabNavigator();

const ClubDetailsScreen = ({ route }) => {
  const { clubId } = route.params;
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState([]); // Initialize as an empty array

  const fetchClubInfo = async () => {
    try {
      const response = await fetch(SummaryApi.get_club_info.url, {
        method: SummaryApi.get_club_info.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch club information.');
      }

      const data = await response.json();
      setClubData(data.data); // Update the state with fetched club data
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubMember = async () => {
    try {
      const response = await fetch(SummaryApi.get_club_member_common.url, {
        method: SummaryApi.get_club_member_common.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch club members.');
      }

      const data = await response.json();
      setMember(data.data); // Update the state with fetched member data
      console.log("Updated member state:", data.data); // Log the updated state
    } catch (err) {
      console.error(err); // Log error for debugging
    }
  };
  
  // Fetch club info and members on component mount
  useEffect(() => {
    fetchClubInfo();
    fetchClubMember(); // Call fetchClubMember here
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true, // Ensure tabs don't get squashed into columns
        tabBarLabelStyle: styles.tabLabelStyle, // Add bold text to tab labels
        tabBarIndicatorStyle: styles.tabIndicatorStyle, // Customize the indicator
      }}
    >
      <Tab.Screen 
        name="DescriptionInfo" 
        component={DescriptionInfo} 
        options={{ title: 'Description Info' }} 
        initialParams={{ clubData }} // Pass clubData
      />
      <Tab.Screen 
        name="ContactInfo" 
        component={ContactInfo} 
        options={{ title: 'Contact Info' }} 
        initialParams={{ clubData }} // Pass clubData
      />
      <Tab.Screen 
        name="Members" 
        component={MembersInfo} 
        options={{ title: 'Members' }} 
        initialParams={{ member }} // Pass member
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryInfo} 
        options={{ title: 'Gallery' }} 
        initialParams={{ clubData }} // Pass clubData
      />
      <Tab.Screen 
        name="UpcomingEvents" 
        component={UpcomingEventsScreen} 
        options={{ title: 'Upcoming Events' }} 
        initialParams={{ clubId }} // Pass clubId
      />
      <Tab.Screen 
        name="PastEvents" 
        component={PastEventsScreen} 
        options={{ title: 'Past Events' }} 
        initialParams={{ clubId }} // Pass clubId
      />
    </Tab.Navigator>
  );
};

// Add custom styles
const styles = StyleSheet.create({
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: 'bold', // Make the tab titles bold
    textTransform: 'none', // Disable auto capitalization of tab titles
  },
  tabIndicatorStyle: {
    backgroundColor: '#003366', // Customize the indicator color
    height: 3, // Increase the height of the indicator for better visibility
  },
});

export default ClubDetailsScreen;
