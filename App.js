import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import { store } from './store'; // Import your Redux store
import UpcomingEvents from './screens/UpcomingEvents';
import PastEvents from './screens/PastEvents';
import ClubOptionsScreen from './screens/ClubOptions';
import UpdateClubInfoScreen from './screens/updateDescription';
import UpdateMembersScreen from './screens/updateMember';
import GalleryScreen  from './screens/updateGallery';
import ContactInfoScreen from './screens/updateContactInfo';
import ClubDetailsScreen from './screens/clubDetails';
import ContactInfo from './screens/contactInfo';
import MembersInfo from './screens/memberInfo';
import GalleryInfo from './screens/galleryInfo';
import DescriptionInfo from './screens/DescriptionInfo';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="UpcomingEvents" component={UpcomingEvents} />
          <Stack.Screen name="PastEvents" component={PastEvents} />
          <Stack.Screen name="ClubOptionsScreen" component={ClubOptionsScreen} />
          <Stack.Screen name="UpdateClubInfoScreen" component={UpdateClubInfoScreen} />
          <Stack.Screen name="UpdateMembersScreen" component={UpdateMembersScreen} />
          <Stack.Screen name="GalleryScreen" component={GalleryScreen}/>
          <Stack.Screen name="ContactInfoScreen" component={ContactInfoScreen}/>
          <Stack.Screen name="ClubDetailsScreen" component={ClubDetailsScreen}/>
          <Stack.Screen name="ContactInfo" component={ContactInfo}/>
          <Stack.Screen name="MembersInfo" component={MembersInfo}/>
          <Stack.Screen name="GalleryInfo" component={GalleryInfo}/>
          <Stack.Screen name="DescriptionInfo" component={DescriptionInfo}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
