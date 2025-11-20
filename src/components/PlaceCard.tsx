import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking,
    Alert
} from 'react-native';
import { Navigation, Phone, Globe, MapPin } from 'lucide-react-native';
import { Place } from '../types';
import PlacesService from '../services/placesService';

interface PlaceCardProps {
    place: Place;
    onPress?: () => void;
    showActions?: boolean;
}

export default function PlaceCard({ place, onPress, showActions = true }: PlaceCardProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    // Load place image if available
    useEffect(() => {
        const loadPlaceImage = async () => {
            if (place.photos && place.photos.length > 0) {
                try {
                    setImageLoading(true);
                    const photoUrl = await PlacesService.getPlacePhoto(place.photos[0].photo_reference);
                    setImageUrl(photoUrl);
                } catch (error) {
                    console.error('Error loading place image:', error);
                } finally {
                    setImageLoading(false);
                }
            }
        };

        loadPlaceImage();
    }, [place.photos]);

    const openDirections = () => {
        if (place.geometry?.location) {
            const { lat, lng } = place.geometry.location;
            const url = `https://maps.apple.com/?q=${lat},${lng}&dirflg=w`; // Walking directions
            Linking.openURL(url).catch(err =>
                console.error('Error opening maps:', err)
            );
        }
    };

    const openPhone = () => {
        if (place.formatted_phone_number) {
            Linking.openURL(`tel:${place.formatted_phone_number}`);
        }
    };

    const openWebsite = () => {
        if (place.website) {
            Linking.openURL(place.website);
        }
    };

    const handleActionPress = (action: string) => {
        switch (action) {
            case 'directions':
                openDirections();
                break;
            case 'phone':
                if (place.formatted_phone_number) {
                    openPhone();
                } else {
                    Alert.alert('Phone number not available');
                }
                break;
            case 'website':
                if (place.website) {
                    openWebsite();
                } else {
                    Alert.alert('Website not available');
                }
                break;
        }
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            disabled={!onPress}
        >
            {/* Place Image */}
            {imageUrl && !imageLoading && (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {/* Image Loading Placeholder */}
            {imageLoading && (
                <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text style={styles.placeholderText}>Loading image...</Text>
                </View>
            )}

            <View style={styles.content}>
                {/* Header Row */}
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={2}>{place.name}</Text>
                    {place.formattedDistance && (
                        <Text style={styles.distance}>{place.formattedDistance}</Text>
                    )}
                </View>

                {/* Address */}
                {place.vicinity && (
                    <View style={styles.addressRow}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.address} numberOfLines={2}>{place.vicinity}</Text>
                    </View>
                )}

                {/* Details Row */}
                <View style={styles.detailsRow}>
                    {/* Rating */}
                    {(place.rating || place.rating === 0) && (
                        <View style={styles.ratingContainer}>
                            <Text style={styles.rating}>⭐ {place.rating}</Text>
                            {place.user_ratings_total && (
                                <Text style={styles.ratingCount}>({place.user_ratings_total})</Text>
                            )}
                        </View>
                    )}

                    {/* Types */}
                    {place.types && place.types.length > 0 && (
                        <Text style={styles.types} numberOfLines={1}>
                            {place.types.slice(0, 2).join(' • ')}
                        </Text>
                    )}
                </View>

                {/* Opening Status */}
                {place.opening_hours && (
                    <Text style={[
                        styles.openStatus,
                        place.opening_hours.open_now ? styles.open : styles.closed
                    ]}>
                        {place.opening_hours.open_now ? '🟢 Open Now' : '🔴 Closed'}
                    </Text>
                )}

                {/* Quick Actions */}
                {showActions && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleActionPress('directions')}
                        >
                            <Navigation size={16} color="#007AFF" />
                            <Text style={styles.actionText}>Directions</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleActionPress('phone')}
                            disabled={!place.formatted_phone_number}
                        >
                            <Phone size={16} color={place.formatted_phone_number ? "#007AFF" : "#ccc"} />
                            <Text style={[
                                styles.actionText,
                                !place.formatted_phone_number && styles.actionTextDisabled
                            ]}>
                                Call
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleActionPress('website')}
                            disabled={!place.website}
                        >
                            <Globe size={16} color={place.website ? "#007AFF" : "#ccc"} />
                            <Text style={[
                                styles.actionText,
                                !place.website && styles.actionTextDisabled
                            ]}>
                                Website
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
    },
    imagePlaceholder: {
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
        marginRight: 8,
    },
    distance: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '500',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    address: {
        fontSize: 14,
        color: '#666',
        flex: 1,
        lineHeight: 18,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9e6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: '#e6b400',
    },
    ratingCount: {
        fontSize: 11,
        color: '#999',
    },
    types: {
        fontSize: 12,
        color: '#999',
        flex: 1,
        textAlign: 'right',
        marginLeft: 12,
        fontStyle: 'italic',
    },
    openStatus: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 12,
    },
    open: {
        color: '#22c55e',
    },
    closed: {
        color: '#ef4444',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    actionButton: {
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 60,
    },
    actionText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
        marginTop: 4,
    },
    actionTextDisabled: {
        color: '#ccc',
    },
});