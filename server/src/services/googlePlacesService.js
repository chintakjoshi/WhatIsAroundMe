const axios = require('axios');

class GooglePlacesService {
    constructor() {
        this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
        this.baseURL = 'https://maps.googleapis.com/maps/api/place';
    }

    async nearbySearch(lat, lng, radius = 1500, type = null, keyword = null) {
        try {
            const params = {
                location: `${lat},${lng}`,
                radius: radius,
                key: this.apiKey,
            };

            if (type) params.type = type;
            if (keyword) params.keyword = keyword;

            const response = await axios.get(`${this.baseURL}/nearbysearch/json`, {
                params,
                timeout: 10000,
            });

            if (response.data.status === 'OK') {
                return {
                    success: true,
                    data: response.data.results,
                    nextPageToken: response.data.next_page_token,
                };
            } else {
                return {
                    success: false,
                    error: response.data.status,
                    message: this.getErrorMessage(response.data.status),
                };
            }
        } catch (error) {
            console.error('Google Places API Error:', error.message);
            return {
                success: false,
                error: 'API_ERROR',
                message: 'Failed to fetch places data',
            };
        }
    }

    async getPlaceDetails(placeId) {
        try {
            const response = await axios.get(`${this.baseURL}/details/json`, {
                params: {
                    place_id: placeId,
                    fields: 'name,formatted_address,geometry,rating,opening_hours,photos,types,website,formatted_phone_number',
                    key: this.apiKey,
                },
                timeout: 10000,
            });

            if (response.data.status === 'OK') {
                return {
                    success: true,
                    data: response.data.result,
                };
            } else {
                return {
                    success: false,
                    error: response.data.status,
                };
            }
        } catch (error) {
            console.error('Place Details API Error:', error.message);
            return {
                success: false,
                error: 'API_ERROR',
            };
        }
    }

    getErrorMessage(status) {
        const errorMessages = {
            'ZERO_RESULTS': 'No places found in this area',
            'OVER_QUERY_LIMIT': 'API quota exceeded',
            'REQUEST_DENIED': 'API request denied',
            'INVALID_REQUEST': 'Invalid request parameters',
            'UNKNOWN_ERROR': 'Unknown error occurred',
        };

        return errorMessages[status] || 'Failed to fetch places';
    }
}

module.exports = new GooglePlacesService();