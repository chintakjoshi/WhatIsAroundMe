const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');

router.get('/nearby', placesController.getNearbyPlaces);
router.get('/categories', placesController.getPlaceCategories);
router.get('/details/:placeId', placesController.getPlaceDetails);

module.exports = router;