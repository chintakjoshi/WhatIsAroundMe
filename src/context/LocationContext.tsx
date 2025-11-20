import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
let searchTimeout: NodeJS.Timeout | null = null;

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const searchPlaces = useCallback(async (searchType?: string | null, searchKeyword?: string) => {
        if (!currentLocation) return;

        try {
            setError(null);
            setLoading(true);

            const finalType = searchType !== undefined ? searchType : selectedCategory;
            const finalKeyword = searchKeyword !== undefined ? searchKeyword : searchQuery;

            const nearbyPlaces = await PlacesService.fetchNearbyPlaces(
                currentLocation.latitude,
                currentLocation.longitude,
                1500,
                finalType || undefined,
                finalKeyword || undefined
            );

            const placesWithDistances = nearbyPlaces.map(place => {
                const distance = LocationService.calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    place.geometry.location.lat,
                    place.geometry.location.lng
                );

                return {
                    ...place,
                    distance,
                    formattedDistance: LocationService.formatDistance(distance)
                };
            });
            setPlaces(placesWithDistances);
        } catch (err: any) {
            console.error('Search places error:', err);
            setError(err.message || 'Failed to fetch nearby places');
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    }, [currentLocation, selectedCategory, searchQuery]);

    const refreshLocation = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const location = await LocationService.getCurrentLocation();
            if (location) {
                setCurrentLocation(location);
                // We'll search places after location is set
            } else {
                setError('Unable to get your current location');
            }
        } catch (err: any) {
            console.error('Refresh location error:', err);
            setError(err.message || 'Failed to refresh location');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load - get location first, then places
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setLoading(true);
                const location = await LocationService.getCurrentLocation();
                if (location) {
                    setCurrentLocation(location);
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

    // Fetch places when location, searchQuery, or selectedCategory changes
    useEffect(() => {
        if (!currentLocation) return;

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            searchPlaces();
        }, 500);

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchQuery, selectedCategory, currentLocation, searchPlaces]);

    const clearFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedCategory(null);
    }, []);

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