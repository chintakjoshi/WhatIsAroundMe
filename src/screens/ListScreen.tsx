import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useLocation } from '../context/LocationContext';

export default function ListScreen() {
    const { places, loading, error, refreshLocation } = useLocation();

    const onRefresh = () => {
        refreshLocation();
    };

    if (loading && places.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <Text style={styles.loadingText}>Loading places...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error && places.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                    <Text style={styles.retryText}>Pull down to refresh</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nearby Places</Text>
                    <Text style={styles.subtitle}>Found {places.length} places near you</Text>
                </View>

                <FlatList
                    data={places}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.placeCard}>
                            <Text style={styles.placeName}>{item.name}</Text>
                            <Text style={styles.placeAddress}>{item.vicinity}</Text>
                            <View style={styles.placeDetails}>
                                {item.rating && (
                                    <View style={styles.ratingContainer}>
                                        <Text style={styles.placeRating}>⭐ {item.rating}</Text>
                                    </View>
                                )}
                                {item.types && (
                                    <Text style={styles.placeTypes} numberOfLines={1}>
                                        {item.types.slice(0, 3).join(' • ')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyTitle}>No places found</Text>
                            <Text style={styles.emptyText}>
                                Try adjusting your location or search radius
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
        marginBottom: 8,
    },
    retryText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    placeCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    placeName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    placeAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 18,
    },
    placeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        backgroundColor: '#fff9e6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    placeRating: {
        fontSize: 14,
        fontWeight: '500',
        color: '#e6b400',
    },
    placeTypes: {
        fontSize: 12,
        color: '#999',
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
});