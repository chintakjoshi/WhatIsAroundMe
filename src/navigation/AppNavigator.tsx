import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MapPin, List } from 'lucide-react-native';

// Screens (we'll create these next)
import MapScreen from '../screens/MapScreen';
import ListScreen from '../screens/ListScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';

export type RootStackParamList = {
    MainTabs: undefined;
    PlaceDetail: { placeId: string };
};

export type TabParamList = {
    Map: undefined;
    List: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MapPin size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="List"
                component={ListScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <List size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="MainTabs"
                    component={TabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PlaceDetail"
                    component={PlaceDetailScreen}
                    options={{ title: 'Place Details' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}