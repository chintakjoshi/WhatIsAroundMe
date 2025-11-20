import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Place } from '../types';
import { LocationService } from '../services/locationService';
import PlacesService from '../services/placesService';

interface LocationContextType {
    currentLocation: Location | null;
    places: Place[];
    loading: boolean;
    error: string | null;
    refreshLocation: () => Promise<void>;
    searchPlaces: (type?: string) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = async (type?: string) => {
        if (!currentLocation) return;

        try {
            setError(null);
            const nearbyPlaces = await PlacesService.fetchNearbyPlaces(
                currentLocation.latitude,
                currentLocation.longitude,
                1500,
                type
            );
            setPlaces(nearbyPlaces);
        } catch (err: any) {
            console.error('Search places error:', err);
            setError(err.message || 'Failed to fetch nearby places');
        }
    };

    const refreshLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            const location = await LocationService.getCurrentLocation();
            if (location) {
                setCurrentLocation(location);
                await searchPlaces();
            } else {
                setError('Unable to get your current location');
            }
        } catch (err: any) {
            console.error('Refresh location error:', err);
            setError(err.message || 'Failed to refresh location');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshLocation();
    }, []);

    return (
        <LocationContext.Provider
            value={{
                currentLocation,
                places,
                loading,
                error,
                refreshLocation,
                searchPlaces,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};