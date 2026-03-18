import { Alert, Linking, Platform } from 'react-native';

interface CoordinateLike {
    lat: number;
    lng: number;
}

export async function openDirectionsForLocation(location: CoordinateLike) {
    const { lat, lng } = location;
    const primaryUrl = Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${lat},${lng}`
        : `geo:${lat},${lng}?q=${lat},${lng}`;
    const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    try {
        const url = await Linking.canOpenURL(primaryUrl) ? primaryUrl : fallbackUrl;
        await Linking.openURL(url);
    } catch (error) {
        console.error('Error opening directions:', error);
        Alert.alert('Unable to open directions right now.');
    }
}
