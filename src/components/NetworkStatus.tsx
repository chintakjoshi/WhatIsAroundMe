import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from '../context/LocationContext';
import { useTheme } from '../context/ThemeContext';

export default function NetworkStatus() {
    const { error } = useLocation();
    const { colors } = useTheme();

    if (!error) return null;

    return (
        <View style={[styles.container, {
            backgroundColor: colors.searchBackground,
            borderLeftColor: colors.primary
        }]}>
            <Text style={[styles.text, { color: colors.text }]}>⚠️ {error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
    },
    text: {
        fontSize: 14,
    },
});