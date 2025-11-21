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
import { useTheme } from '../context/ThemeContext';
import { mapDarkStyle, mapLightStyle } from '../constants/mapStyles';

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

    const { colors, isDark } = useTheme();

    const onRefresh = () => {
        refreshLocation();
    };

    const renderMapContent = () => {
        if (loading && !currentLocation) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Getting your location...</Text>
                </View>
            );
        }

        if (error || !currentLocation) {
            return (
                <ScrollView
                    contentContainerStyle={styles.centerContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                >
                    <Text style={[styles.error, { color: colors.text }]}>
                        {error || 'Unable to get your location'}
                    </Text>
                    <Text style={[styles.retryText, { color: colors.textSecondary }]}>Pull down to try again</Text>
                </ScrollView>
            );
        }

        return (
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.0222,
                        longitudeDelta: 0.0121,
                    }}
                    customMapStyle={isDark ? mapDarkStyle : []}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    toolbarEnabled={false}
                    key={`map-${isDark ? 'dark' : 'light'}`}
                >
                    {/* User location marker */}
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="Your Location"
                        pinColor={colors.primary}
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
                        />
                    ))}
                </MapView>

                {/* Info overlay */}
                <View style={[styles.infoOverlay, { backgroundColor: colors.card }]}>
                    <Text style={[styles.infoText, { color: colors.text }]}>
                        📍 {places.length} places found
                        {(searchQuery || selectedCategory) && ' with current filters'}
                    </Text>
                </View>

                {/* Loading overlay when refreshing with existing data */}
                {loading && (
                    <View style={[styles.refreshOverlay, { backgroundColor: colors.card }]}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.refreshText, { color: colors.text }]}>Updating places...</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.container}>
                <SearchHeader
                    onSearch={setSearchQuery}
                    onCategoryFilter={setSelectedCategory}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                />
                <NetworkStatus />

                <View style={styles.contentArea}>
                    {renderMapContent()}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentArea: {
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
    },
    error: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 8,
        fontWeight: '500',
    },
    retryText: {
        textAlign: 'center',
        fontSize: 14,
    },
    infoOverlay: {
        position: 'absolute',
        top: 16,
        alignSelf: 'center',
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
    },
    refreshOverlay: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
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
    },
});