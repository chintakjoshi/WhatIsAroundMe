import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LocationProvider } from './src/context/LocationContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { useTheme } from './src/context/ThemeContext';

function ThemedStatusBar() {
  const { isDark } = useTheme();

  return (
    <StatusBar
      style={isDark ? 'light' : 'dark'}
      backgroundColor="transparent"
      translucent={true}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <SafeAreaProvider>
          <AppNavigator />
          <ThemedStatusBar />
        </SafeAreaProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}