import axios from 'axios';
import { API_URL } from '@env';
import { Place, PlaceCategory } from '../types';

// For development - replace with your Windows machine's IP address
const BACKEND_BASE_URL = API_URL;

class PlacesService {
    private api = axios.create({
        baseURL: BACKEND_BASE_URL,
        timeout: 10000,
    });

    async fetchNearbyPlaces(
        latitude: number,
        longitude: number,
        radius: number = 1500,
        type?: string
    ): Promise<Place[]> {
        try {
            console.log('Fetching places from:', `${BACKEND_BASE_URL}/places/nearby`);

            const response = await this.api.get('/places/nearby', {
                params: {
                    lat: latitude,
                    lng: longitude,
                    radius,
                    type: type || undefined,
                },
            });

            console.log('Places response:', response.data);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch places');
            }
        } catch (error: any) {
            console.error('Error fetching nearby places:', error);
            console.error('Error details:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Network error - check if server is running');
        }
    }

    async getPlaceDetails(placeId: string): Promise<any> {
        try {
            const response = await this.api.get(`/places/details/${placeId}`);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error('Failed to fetch place details');
            }
        } catch (error: any) {
            console.error('Error fetching place details:', error);
            throw new Error(error.response?.data?.message || 'Network error');
        }
    }

    async getPlaceCategories(): Promise<PlaceCategory[]> {
        try {
            const response = await this.api.get('/places/categories');

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error('Failed to fetch categories');
            }
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            // Return default categories as fallback
            return this.getDefaultCategories();
        }
    }

    private getDefaultCategories(): PlaceCategory[] {
        return [
            { id: 'restaurant', name: 'Restaurants', icon: 'utensils', type: 'restaurant' },
            { id: 'cafe', name: 'Cafés', icon: 'coffee', type: 'cafe' },
            { id: 'park', name: 'Parks', icon: 'tree', type: 'park' },
            { id: 'museum', name: 'Museums', icon: 'landmark', type: 'museum' },
            { id: 'bar', name: 'Bars', icon: 'glass', type: 'bar' },
            { id: 'store', name: 'Stores', icon: 'shopping-bag', type: 'store' },
            { id: 'gas_station', name: 'Gas Stations', icon: 'fuel', type: 'gas_station' },
            { id: 'hospital', name: 'Hospitals', icon: 'heart', type: 'hospital' },
        ];
    }
}

export default new PlacesService();