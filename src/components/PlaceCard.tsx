import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import { Navigation, Phone, Globe, MapPin, Star } from 'lucide-react-native';
import { Place } from '../types';
import PlacesService from '../services/placesService';
import { useTheme } from '../context/ThemeContext';
import { openDirectionsForLocation } from '../utils/maps';

interface PlaceCardProps {
    place: Place;
    onPress?: () => void;
    showActions?: boolean;
}

export default function PlaceCard({ place, onPress, showActions = true }: PlaceCardProps) {
    const { colors } = useTheme();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadPlaceImage = async () => {
            if (!place.photos || place.photos.length === 0) {
                return;
            }

            try {
                setImageLoading(true);
                const photoUrl = await PlacesService.getPlacePhoto(place.photos[0].photo_reference);
                if (isMounted) {
                    setImageUrl(photoUrl);
                }
            } catch (error) {
                console.error('Error loading place image:', error);
            } finally {
                if (isMounted) {
                    setImageLoading(false);
                }
            }
        };

        loadPlaceImage();

        return () => {
            isMounted = false;
        };
    }, [place.photos]);

    const openDirections = () => {
        if (place.geometry?.location) {
            openDirectionsForLocation(place.geometry.location);
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

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {imageUrl && !imageLoading && (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {imageLoading && (
                <View style={[styles.image, styles.imagePlaceholder, { backgroundColor: colors.searchBackground }]}>
                    <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Loading image...</Text>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>{place.name}</Text>
                    {place.formattedDistance && (
                        <Text style={[styles.distance, { color: colors.primary }]}>{place.formattedDistance}</Text>
                    )}
                </View>

                {place.vicinity && (
                    <View style={styles.addressRow}>
                        <MapPin size={14} color={colors.textSecondary} />
                        <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={2}>{place.vicinity}</Text>
                    </View>
                )}

                <View style={styles.detailsRow}>
                    {(place.rating || place.rating === 0) && (
                        <View style={[styles.ratingContainer, { backgroundColor: colors.searchBackground }]}>
                            <Star size={12} color="#e6b400" fill="#e6b400" />
                            <Text style={styles.rating}>{place.rating}</Text>
                            {place.user_ratings_total && (
                                <Text style={styles.ratingCount}>({place.user_ratings_total})</Text>
                            )}
                        </View>
                    )}

                    {place.types && place.types.length > 0 && (
                        <Text style={[styles.types, { color: colors.textSecondary }]} numberOfLines={1}>
                            {place.types.slice(0, 2).join(' | ')}
                        </Text>
                    )}
                </View>

                {place.opening_hours && (
                    <Text style={[
                        styles.openStatus,
                        place.opening_hours.open_now ? styles.open : styles.closed
                    ]}>
                        {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                    </Text>
                )}

                {showActions && (
                    <View style={[styles.actions, { borderTopColor: colors.border }]}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={openDirections}
                        >
                            <Navigation size={16} color={colors.primary} />
                            <Text style={[styles.actionText, { color: colors.primary }]}>Directions</Text>
                        </TouchableOpacity>

                        {place.formatted_phone_number && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={openPhone}
                            >
                                <Phone size={16} color={colors.primary} />
                                <Text style={[styles.actionText, { color: colors.primary }]}>Call</Text>
                            </TouchableOpacity>
                        )}

                        {place.website && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={openWebsite}
                            >
                                <Globe size={16} color={colors.primary} />
                                <Text style={[styles.actionText, { color: colors.primary }]}>Website</Text>
                            </TouchableOpacity>
                        )}
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
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 2,
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
});
