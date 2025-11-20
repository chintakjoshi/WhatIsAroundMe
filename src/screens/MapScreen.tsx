import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    SafeAreaView
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';
import SearchHeader from '../components/SearchHeader';
import NetworkStatus from '../components/NetworkStatus';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
    const {
        currentLocation,
        places,
        loading,
        error,
        refreshLocation,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory
    } = useLocation();

    const onRefresh = () => {
        refreshLocation();
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleCategoryFilter = (category: string | null) => {
        setSelectedCategory(category);
    };

    if (loading && !currentLocation) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Getting your location...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !currentLocation) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.centerContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                        />
                    }
                >
                    <Text style={styles.error}>
                        {error || 'Unable to get your location'}
                    </Text>
                    <Text style={styles.retryText}>Pull down to try again</Text>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <SearchHeader
                    onSearch={handleSearch}
                    onCategoryFilter={handleCategoryFilter}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                />
                <NetworkStatus />

                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                            latitudeDelta: 0.0222,
                            longitudeDelta: 0.0121,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        toolbarEnabled={false}
                    >
                        {/* User location marker */}
                        <Marker
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Your Location"
                            pinColor="#007AFF"
                        />

                        {/* Nearby places markers */}
                        {places.map((place) => (
                            <Marker
                                key={place.id}
                                coordinate={{
                                    latitude: place.geometry.location.lat,
                                    longitude: place.geometry.location.lng,
                                }}
                                title={place.name}
                                description={place.vicinity}
                                pinColor="#FF6B6B"
                                onPress={() => {
                                }}
                            />
                        ))}
                    </MapView>

                    {/* Info overlay */}
                    <View style={styles.infoOverlay}>
                        <Text style={styles.infoText}>
                            📍 {places.length} places found
                            {(searchQuery || selectedCategory) && ' with current filters'}
                        </Text>
                    </View>

                    {/* Loading overlay when refreshing with existing data */}
                    {loading && (
                        <View style={styles.refreshOverlay}>
                            <ActivityIndicator size="small" color="#007AFF" />
                            <Text style={styles.refreshText}>Updating places...</Text>
                        </View>
                    )}
                </View>
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
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: width,
        height: height,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    error: {
        color: '#ff3b30',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 8,
        fontWeight: '500',
    },
    retryText: {
        color: '#666',
        textAlign: 'center',
        fontSize: 14,
    },
    infoOverlay: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    refreshOverlay: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    refreshText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
});