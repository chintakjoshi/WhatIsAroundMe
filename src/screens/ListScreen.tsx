import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { useLocation } from '../context/LocationContext';

const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No places found</Text>
        <Text style={styles.emptyText}>
            Pull down to refresh and search again
        </Text>
    </View>
);

export default function ListScreen() {
    const { places, loading, error, refreshLocation } = useLocation();

    const onRefresh = () => {
        refreshLocation();
    };

    if (loading && places.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Finding places near you...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nearby Places</Text>
                    <Text style={styles.subtitle}>
                        {places.length > 0
                            ? `Found ${places.length} places near you`
                            : 'No places found'
                        }
                    </Text>
                </View>

                <FlatList
                    data={places}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading && places.length > 0}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                            colors={['#007AFF']}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <View style={[
                            styles.placeCard,
                            index === 0 && styles.firstCard,
                            index === places.length - 1 && styles.lastCard
                        ]}>
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
                                        {item.types.slice(0, 2).join(' • ')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={places.length === 0 && !loading ? EmptyComponent : undefined}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 30,
    },
    placeCard: {
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f8f8f8',
    },
    firstCard: {
        marginTop: 8,
    },
    lastCard: {
        marginBottom: 30,
    },
    placeName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    placeAddress: {
        fontSize: 15,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    placeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        backgroundColor: '#fff9e6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    placeRating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#e6b400',
    },
    placeTypes: {
        fontSize: 13,
        color: '#999',
        flex: 1,
        textAlign: 'right',
        marginLeft: 12,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
});