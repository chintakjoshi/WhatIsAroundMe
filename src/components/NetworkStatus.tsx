import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from '../context/LocationContext';

export default function NetworkStatus() {
    const { error, currentLocation } = useLocation();

    if (!error) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>⚠️ {error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFECB3',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FFA000',
    },
    text: {
        color: '#7D6608',
        fontSize: 14,
    },
});