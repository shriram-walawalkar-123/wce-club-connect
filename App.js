import React from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import { store } from './store'; // Import your Redux store
import ClubOptionsScreen from './screens/ClubOptions';
import UpdateClubInfoScreen from './screens/updateDescription';
import UpdateMembersScreen from './screens/updateMember';
import GalleryScreen from './screens/updateGallery';
import ContactInfoScreen from './screens/updateContactInfo';
import ClubDetailsScreen from './screens/clubDetails';
import UploadEventScreen from './screens/UploadEvent';
import AddEvent from './screens/addEvent';
import ShowEvent from './screens/showEvent';
import EditEvent from './screens/EditEventScreen';
import AdminScreen from './screens/AdminScreen';
import PastEventsScreen from './screens/PastEvents';
import UpcomingEventsScreen from './screens/UpcomingEvents';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4e545c', // Gunmetal Gray for header background
            },
            headerTintColor: '#e5e8e8', // White for header icon colors
            headerTitleStyle: {
              color: '#e5e8e8', // White for title text
              fontSize: 20, // Font size for header title
              textAlign: 'center', // Center align the title
              flexGrow: 1, // Make title take available space
            },
            headerBackTitleStyle: {
              color: '#8d9797', // Pewter for back button text
              fontSize: 16, // Font size for back button text
            },
            headerTitleAlign: 'center', // Center align the title
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ClubOptionsScreen" component={ClubOptionsScreen} />
          <Stack.Screen name="UpdateClubInfoScreen" component={UpdateClubInfoScreen} />
          <Stack.Screen name="UpdateMembersScreen" component={UpdateMembersScreen} />
          <Stack.Screen name="GalleryScreen" component={GalleryScreen} />
          <Stack.Screen name="ContactInfoScreen" component={ContactInfoScreen} />
          <Stack.Screen name="ClubDetailsScreen" component={ClubDetailsScreen} />
          <Stack.Screen name="UploadEventScreen" component={UploadEventScreen} />
          <Stack.Screen name="AddEvent" component={AddEvent} />
          <Stack.Screen name="showEvent" component={ShowEvent} />
          <Stack.Screen name="EditEvent" component={EditEvent} />
          <Stack.Screen name="AdminScreen" component={AdminScreen} />
          <Stack.Screen name="PastEventsScreen" component={PastEventsScreen} />
          <Stack.Screen name="UpcomingEventsScreen" component={UpcomingEventsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
