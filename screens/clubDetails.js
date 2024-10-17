import React, { useEffect, useState, useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ContactInfo from './contactInfo';
import GalleryInfo from './galleryInfo';
import DescriptionInfo from './DescriptionInfo';
import MembersInfo from './memberInfo';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import SummaryApi from '../backendRoutes';
import UpcommingEventsInfo from './UpcommingEventInfo';
import PastEventInfo from './PastEventInfo';

const Tab = createMaterialTopTabNavigator();

const ClubDetailsScreen = ({ route }) => {
  const { clubId } = route.params;
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState([]);
  const [error, setError] = useState(null);

  const fetchClubInfo = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.get_club_info.url, {
        method: SummaryApi.get_club_info.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),  
      });
      const data = await response.json();
      if(data.success === true){
         setClubData(data.data);
      } else {
        throw new Error('Failed to fetch club data');
      }
    } catch (err) {
      console.error('Error fetching club info:', err);
      setError('Failed to load club information. Please try again.');
    }
  }, [clubId]);

  const fetchClubMember = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.get_club_member_common.url, {
        method: SummaryApi.get_club_member_common.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
      });
      const data = await response.json();
      if(data.success === true){
        setMember(data.data);
      } else {
        throw new Error('Failed to fetch member data');
      }
    } catch (err) {
      console.error('Error fetching club members:', err);
      setError('Failed to load club members. Please try again.');
    }
  }, [clubId]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchClubInfo(), fetchClubMember()]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchClubInfo, fetchClubMember]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!clubData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No club data available</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: styles.tabLabelStyle,
        tabBarIndicatorStyle: styles.tabIndicatorStyle,
      }}
    >
      <Tab.Screen 
        name="DescriptionInfo" 
        component={DescriptionInfo} 
        options={{ title: 'Description Info' }} 
        initialParams={{ clubData }} 
      />
      <Tab.Screen 
        name="ContactInfo" 
        component={ContactInfo} 
        options={{ title: 'Contact Info' }} 
        initialParams={{ clubData }} 
      />
      <Tab.Screen 
        name="Members" 
        component={MembersInfo} 
        options={{ title: 'Members' }} 
        initialParams={{ member }} 
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryInfo} 
        options={{ title: 'Gallery' }} 
        initialParams={{ clubData }} 
      />
      <Tab.Screen 
        name="UpcommingEventsInfo" 
        component={UpcommingEventsInfo} 
        options={{ title: 'Upcoming Events Info' }} 
        initialParams={{ clubId }} 
      />
      <Tab.Screen 
        name="PastEventInfo" 
        component={PastEventInfo} 
        options={{ title: 'Past Events info' }} 
        initialParams={{ clubId }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabelStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
  },
  tabIndicatorStyle: {
    backgroundColor: '#003366',
    height: 3,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ClubDetailsScreen;