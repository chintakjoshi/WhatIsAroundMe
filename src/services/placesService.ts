import axios from 'axios';
import { API_URL } from '@env';
import { Place, PlaceCategory } from '../types';

class PlacesService {
    private api = axios.create({
        baseURL: API_URL,
        timeout: 15000,
    });

    async fetchNearbyPlaces(
        latitude: number,
        longitude: number,
        radius: number = 1500,
        type?: string | null,
        keyword?: string
    ): Promise<Place[]> {
        try {

            const params: any = {
                lat: latitude,
                lng: longitude,
                radius,
            };

            if (type) params.type = type;
            if (keyword) params.keyword = keyword;

            const response = await this.api.get('/places/nearby', { params });

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch places');
            }
        } catch (error: any) {
            console.error('Places API Error:', {
                message: error.message,
                code: error.code,
                url: error.config?.url
            });

            // Handle specific error cases
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Cannot connect to server. Make sure your server is running on ' + API_URL);
            } else if (error.response?.status === 400) {
                throw new Error(error.response.data.message || 'Invalid request parameters');
            } else {
                throw new Error(error.response?.data?.message || 'Failed to load places. Check your connection.');
            }
        }
    }

    async getPlaceDetails(placeId: string): Promise<any> {
        try {
            const response = await this.api.get(`/places/details/${placeId}`);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.error || 'Failed to fetch place details');
            }
        } catch (error: any) {
            console.error('Error fetching place details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || 'Failed to load place details');
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