// src/services/placesService.ts
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

    async getPlacePhoto(photoReference: string, maxWidth: number = 400): Promise<string> {
        try {
            const response = await this.api.get(`/places/photo/${photoReference}`, {
                params: { maxWidth }
            });

            if (response.data.success) {
                return response.data.data.photoUrl;
            } else {
                throw new Error('Failed to get place photo');
            }
        } catch (error: any) {
            console.error('Error fetching place photo:', error);
            throw new Error('Failed to load place photo');
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

            return [
                { id: 'restaurant', name: 'Restaurants', icon: 'utensils', type: 'restaurant' },
                { id: 'cafe', name: 'Cafés', icon: 'coffee', type: 'cafe' },
                { id: 'bar', name: 'Bars', icon: 'glass', type: 'bar' },
                { id: 'park', name: 'Parks', icon: 'tree', type: 'park' },
                { id: 'museum', name: 'Museums', icon: 'landmark', type: 'museum' },
                { id: 'store', name: 'Stores', icon: 'shopping-bag', type: 'store' },
                { id: 'gas_station', name: 'Gas Stations', icon: 'fuel', type: 'gas_station' },
                { id: 'hospital', name: 'Hospitals', icon: 'heart', type: 'hospital' },
                { id: 'pharmacy', name: 'Pharmacies', icon: 'plus', type: 'pharmacy' },
                { id: 'bank', name: 'Banks', icon: 'dollar-sign', type: 'bank' },
            ];
        }
    }
}

export default new PlacesService();