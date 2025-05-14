// app/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../LoginScreen';
import DashboardScreen from '../DashboardScreen';
import QRCodeScreen from '../QRCodeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="QRCodeScreen" component={QRCodeScreen} />
    </Stack.Navigator>
  );
}
