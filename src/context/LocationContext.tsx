import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location, Place } from '../types';
import { LocationService } from '../services/locationService';
import PlacesService from '../services/placesService';

interface LocationContextType {
    currentLocation: Location | null;
    places: Place[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    selectedCategory: string | null;
    refreshLocation: () => Promise<void>;
    searchPlaces: (type?: string, keyword?: string) => Promise<void>;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    clearFilters: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const searchPlaces = async (type?: string, keyword?: string) => {
        if (!currentLocation) return;

        try {
            setError(null);

            // Use provided parameters or fall back to state
            const searchType = type || selectedCategory;
            const searchKeyword = keyword || searchQuery;

            const nearbyPlaces = await PlacesService.fetchNearbyPlaces(
                currentLocation.latitude,
                currentLocation.longitude,
                1500,
                searchType,
                searchKeyword
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

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        if (currentLocation) {
            searchPlaces('', '');
        }
    };

    // Initial load - get location first, then places
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setLoading(true);

                const location = await LocationService.getCurrentLocation();
                if (location) {
                    setCurrentLocation(location);

                    // Get places after location is set
                    await searchPlaces();
                }
            } catch (err: any) {
                console.error('Initialization error:', err);
                setError(err.message || 'Failed to initialize app');
            } finally {
                setLoading(false);
            }
        };

        initializeApp();
    }, []);

    // Update places when search query or category changes
    useEffect(() => {
        if (currentLocation) {
            searchPlaces();
        }
    }, [searchQuery, selectedCategory]);

    return (
        <LocationContext.Provider
            value={{
                currentLocation,
                places,
                loading,
                error,
                searchQuery,
                selectedCategory,
                refreshLocation,
                searchPlaces,
                setSearchQuery,
                setSelectedCategory,
                clearFilters,
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