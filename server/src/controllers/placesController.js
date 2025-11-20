const googlePlacesService = require('../services/googlePlacesService');

class PlacesController {
    async getNearbyPlaces(req, res, next) {
        try {
            const { lat, lng, radius = 1500, type, keyword } = req.query;

            // Validation
            if (!lat || !lng) {
                return res.status(400).json({
                    error: 'Missing required parameters',
                    message: 'Latitude and longitude are required',
                });
            }

            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            const searchRadius = parseInt(radius);

            if (isNaN(latitude) || isNaN(longitude)) {
                return res.status(400).json({
                    error: 'Invalid parameters',
                    message: 'Latitude and longitude must be valid numbers',
                });
            }

            // Fetch places from Google API
            const result = await googlePlacesService.nearbySearch(
                latitude,
                longitude,
                searchRadius,
                type,
                keyword
            );

            if (!result.success) {
                return res.status(400).json({
                    error: result.error,
                    message: result.message,
                });
            }

            // Transform data for mobile app
            const places = result.data.map(place => ({
                id: place.place_id,
                name: place.name,
                vicinity: place.vicinity,
                geometry: place.geometry,
                rating: place.rating,
                types: place.types,
                photos: place.photos,
                opening_hours: place.opening_hours,
                user_ratings_total: place.user_ratings_total,
            }));

            res.json({
                success: true,
                data: places,
                count: places.length,
                location: { lat: latitude, lng: longitude },
                radius: searchRadius,
            });

        } catch (error) {
            next(error);
        }
    }

    async getPlaceDetails(req, res, next) {
        try {
            const { placeId } = req.params;

            if (!placeId) {
                return res.status(400).json({
                    error: 'Missing placeId',
                });
            }

            const result = await googlePlacesService.getPlaceDetails(placeId);

            if (!result.success) {
                return res.status(400).json({
                    error: result.error,
                });
            }

            res.json({
                success: true,
                data: result.data,
            });

        } catch (error) {
            next(error);
        }
    }

    async getPlaceCategories(req, res) {
        const categories = [
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

        res.json({
            success: true,
            data: categories,
        });
    }
}

module.exports = new PlacesController();