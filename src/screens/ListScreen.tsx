import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocation } from '../context/LocationContext';

export default function ListScreen() {
    const { places, loading, error } = useLocation();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading places...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Places</Text>
            <Text style={styles.subtitle}>Found {places.length} places</Text>

            <FlatList
                data={places}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.placeCard}>
                        <Text style={styles.placeName}>{item.name}</Text>
                        <Text style={styles.placeAddress}>{item.vicinity}</Text>
                        {item.rating && (
                            <Text style={styles.placeRating}>⭐ {item.rating}</Text>
                        )}
                        <Text style={styles.placeTypes}>
                            {item.types?.join(', ')}
                        </Text>
                    </View>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 16,
    },
    placeCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    placeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    placeAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    placeRating: {
        fontSize: 14,
        color: '#ffa500',
        marginBottom: 4,
    },
    placeTypes: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});