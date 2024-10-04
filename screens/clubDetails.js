import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ContactInfo from './contactInfo';
import MembersInfo from './memberInfo';
import GalleryInfo from './galleryInfo';
import DescriptionInfo from './DescriptionInfo';

const Tab = createMaterialTopTabNavigator();

const ClubDetailsScreen = ({ route }) => {
  const { clubId } = route.params; // Get the clubId from the previous screen

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#003366' }, // Customize the active tab indicator color
        tabBarStyle: { backgroundColor: '#f0f0f0' }, // Customize the tab bar background color
      }}
    >
      <Tab.Screen 
        name="DescriptionInfo" 
        component={DescriptionInfo} 
        options={{ title: 'Description Info' }} 
        initialParams={{ clubId }} // Pass the clubId as a param
      />
      <Tab.Screen 
        name="ContactInfo" 
        component={ContactInfo} 
        options={{ title: 'Contact Info' }} 
        initialParams={{ clubId }} // Pass the clubId as a param
      />
      <Tab.Screen 
        name="Members" 
        component={MembersInfo} 
        options={{ title: 'Members' }} 
        initialParams={{ clubId }} 
      />
      <Tab.Screen 
        name="Gallery" 
        component={GalleryInfo} 
        options={{ title: 'Gallery' }} 
        initialParams={{ clubId }} 
      />
    </Tab.Navigator>
  );
};

export default ClubDetailsScreen;
