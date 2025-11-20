# What’s Around Me?
Location-based discovery app built with **React Native (Expo)** and a **Node.js + Express backend**. The app retrieves the user’s current location, fetches nearby points of interest using the **Google Places API**, and displays results on both an interactive map and a searchable list.

## Features

### Core
- Location permission handling (iOS-compatible via Expo Go).
- Accurate current-location retrieval using `expo-location`.
- Interactive map using `react-native-maps`.
- Nearby places search with filters:
  - Category filtering
  - Keyword search
- List and Map views with independent refresh and loading logic.
- Place detail screen with:
  - Address
  - Opening hours
  - Ratings
  - Website
  - Phone
  - Navigation link

### Backend
- Express server providing:
  - `/api/places/nearby`
  - `/api/places/details/:placeId`
  - `/api/places/categories`
- Internal service layer using Axios for Google Places API.
- CORS configured for Expo development.
- Error handling middleware.

## Tech Stack

### Mobile App
- **React Native (Expo)**
- **TypeScript**
- **React Navigation** (Stack + Tabs)
- **react-native-maps**
- **expo-location**
- **Axios**
- **Context API** for state

### Backend
- **Node.js + Express**
- **Axios**
- **Google Places API**
- **Helmet + Morgan**
- **dotenv**

## Folder Structure (Simplified)

```
WhatsAroundMe/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── .env
│
├── src/
│   ├── screens/
│   ├── navigation/
│   ├── context/
│   ├── services/
│   ├── components/
│   └── types/
│
├── App.tsx
├── app.json
├── .env
└── package.json
```

## Environment Variables

### Mobile `.env`
```
API_URL=http://YOUR_LOCAL_IP:3001/api
```

### Server `.env`
```
PORT=3001
NODE_ENV=development
GOOGLE_PLACES_API_KEY=YOUR_KEY
CORS_ORIGIN=http://localhost:3000,exp://192.168.*.*:8081
```

## Running the Project

### 1. Start Backend
```
cd server
npm install
npm run dev
```

### 2. Start Mobile App
```
npm install
npm run dev
```

Open the Expo Go app on iOS and scan the QR code. Ensure backend IP matches your LAN network IP.

## API Endpoints

### `GET /api/places/nearby`
Query params:
- `lat`
- `lng`
- `radius` (optional)
- `type` (optional)
- `keyword` (optional)

### `GET /api/places/details/:placeId`

### `GET /api/places/categories`

## How It Works

### Location Flow
1. Request foreground permission.
2. Retrieve coordinates.
3. Update global context.
4. Trigger nearby search.

### Places Retrieval Flow
1. Mobile calls backend with coordinates.
2. Backend calls Google Places Nearby Search.
3. Response normalized.
4. Results displayed in map/list.
5. Filters modify query.

### Place Detail Flow
1. Mobile calls `/details/:placeId`.
2. Backend queries Place Details API.
3. Response normalized for display.

## Known Constraints
- iOS builds require Mac or EAS.
- Google Places API quota limits.
- No marker clustering yet.
- No offline caching.

## Future Enhancements
- Favorites.
- Marker clustering.
- Infinite scrolling.
- Offline caching.
- Reviews.
- Theme switching.