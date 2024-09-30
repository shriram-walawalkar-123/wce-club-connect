import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './store';
import Home from './screens/Home'
import Login from './screens/Login'
import  Signup  from './screens/Signup'
import UpcomingEvents from './screens/UpcomingEvents'
import PastEvents from './screens/PastEvents'
import ClubDetails from './screens/ClubDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name='Signup'component={Signup} />
        <Stack.Screen name="UpcomingEvents" component={UpcomingEvents} />
        <Stack.Screen name="PastEvents" component={PastEvents} />
        <Stack.Screen name="ClubDetails" component={ClubDetails} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}


