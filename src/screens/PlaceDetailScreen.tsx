import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function PlaceDetailScreen() {
    const route = useRoute();
    const { placeId } = route.params as { placeId: string };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Place Details</Text>
            <View style={styles.detailCard}>
                <Text style={styles.placeId}>ID: {placeId}</Text>
                <Text>Detailed information will be shown here</Text>
                <Text>Including:</Text>
                <Text>- Address</Text>
                <Text>- Phone number</Text>
                <Text>- Website</Text>
                <Text>- Opening hours</Text>
                <Text>- Reviews</Text>
                <Text>- Photos</Text>
            </View>
        </ScrollView>
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
        marginBottom: 16,
    },
    detailCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    placeId: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
});