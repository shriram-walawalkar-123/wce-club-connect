import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import UpcomingEvents from './screens/UpcomingEvents';
import PastEvents from './screens/PastEvents';
import { store } from './store'; // Import your Redux store

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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
