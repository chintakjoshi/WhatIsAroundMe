const express = require('express');
const router = express.Router();

// GET /api/places/nearby
router.get('/nearby', (req, res) => {
    const { lat, lng, radius = 1500, type } = req.query;

    // Mock response for now - we'll integrate Google Places later
    res.json({
        success: true,
        data: [
            {
                id: '1',
                name: 'Test Restaurant',
                vicinity: '123 Test Street',
                geometry: {
                    location: {
                        lat: parseFloat(lat) + 0.001,
                        lng: parseFloat(lng) + 0.001
                    }
                },
                rating: 4.5,
                types: ['restaurant', 'food'],
                opening_hours: { open_now: true }
            },
            {
                id: '2',
                name: 'Test Park',
                vicinity: '456 Park Avenue',
                geometry: {
                    location: {
                        lat: parseFloat(lat) - 0.001,
                        lng: parseFloat(lng) - 0.001
                    }
                },
                rating: 4.2,
                types: ['park', 'point_of_interest'],
                opening_hours: { open_now: true }
            }
        ],
        count: 2,
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: parseInt(radius)
    });
});

// GET /api/places/categories
router.get('/categories', (req, res) => {
    const categories = [
        { id: 'restaurant', name: 'Restaurants', icon: 'utensils', type: 'restaurant' },
        { id: 'cafe', name: 'Cafés', icon: 'coffee', type: 'cafe' },
        { id: 'bar', name: 'Bars', icon: 'glass', type: 'bar' },
        { id: 'park', name: 'Parks', icon: 'tree', type: 'park' },
        { id: 'museum', name: 'Museums', icon: 'landmark', type: 'museum' },
        { id: 'store', name: 'Stores', icon: 'shopping-bag', type: 'store' },
        { id: 'gas_station', name: 'Gas Stations', icon: 'fuel', type: 'gas_station' },
        { id: 'hospital', name: 'Hospitals', icon: 'heart', type: 'hospital' },
    ];

    res.json({
        success: true,
        data: categories
    });
});

// GET /api/places/details/:placeId
router.get('/details/:placeId', (req, res) => {
    const { placeId } = req.params;

    res.json({
        success: true,
        data: {
            id: placeId,
            name: 'Test Place Details',
            formatted_address: '123 Test Street, City, State',
            geometry: {
                location: {
                    lat: 40.7128,
                    lng: -74.0060
                }
            },
            rating: 4.5,
            types: ['restaurant'],
            opening_hours: {
                open_now: true,
                weekday_text: [
                    'Monday: 9:00 AM - 10:00 PM',
                    'Tuesday: 9:00 AM - 10:00 PM',
                    'Wednesday: 9:00 AM - 10:00 PM',
                    'Thursday: 9:00 AM - 10:00 PM',
                    'Friday: 9:00 AM - 11:00 PM',
                    'Saturday: 10:00 AM - 11:00 PM',
                    'Sunday: 10:00 AM - 9:00 PM'
                ]
            },
            photos: [],
            website: 'http://example.com',
            formatted_phone_number: '+1 (555) 123-4567'
        }
    });
});

module.exports = router;