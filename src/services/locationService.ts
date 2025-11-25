import * as Location from 'expo-location';
import { Location as LocationType, Place } from '../types';

export class LocationService {
    static async requestPermissions(): Promise<boolean> {
        try {
            const existingPermissions = await Location.getForegroundPermissionsAsync();

            if (existingPermissions.status === 'granted') {
                return true;
            }

            const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                return true;
            }

            if (!canAskAgain) {
                throw new Error(
                    'Location permission is denied. Please enable location access for this app in Settings.'
                );
            }

            throw new Error('Location permission not granted.');
        } catch (error: any) {
            console.error('Error requesting location permissions:', error);
            throw error instanceof Error
                ? error
                : new Error('Failed to request location permissions.');
        }
    }

    static async getCurrentLocation(): Promise<LocationType | null> {
        try {
            const hasPermission = await this.requestPermissions();

            if (!hasPermission) {
                return null;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                maximumAge: 5000,
                timeout: 15000,
            } as any);

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        } catch (error: any) {
            console.error('Error getting location:', error);

            if (error?.message?.includes('Location permission')) {
                throw error;
            }

            throw new Error(
                'Unable to get your location. Make sure location services are turned on and try again.'
            );
        }
    }

    static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    }

    static formatDistance(distanceInMeters: number): string {
        if (distanceInMeters < 1000) {
            return `${Math.round(distanceInMeters)}m away`;
        } else {
            return `${(distanceInMeters / 1000).toFixed(1)}km away`;
        }
    }
}