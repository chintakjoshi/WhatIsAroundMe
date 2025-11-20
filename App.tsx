import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LocationProvider } from './src/context/LocationContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <LocationProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </LocationProvider>
    </SafeAreaProvider>
  );
}