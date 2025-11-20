import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
    const { currentLocation, places, loading, error } = useLocation();

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading your location...</Text>
            </View>
        );
    }

    if (error || !currentLocation) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>
                    {error || 'Unable to get your location'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* User location marker */}
                <Marker
                    coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                    }}
                    title="Your Location"
                    pinColor="blue"
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
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: width,
        height: height,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 50,
    },
});