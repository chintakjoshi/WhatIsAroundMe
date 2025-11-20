import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Linking,
    TouchableOpacity
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Star, MapPin, Phone, Globe, Clock, Navigation } from 'lucide-react-native';
import PlacesService from '../services/placesService';

interface PlaceDetails {
    id: string;
    name: string;
    rating?: number;
    user_ratings_total?: number;
    formatted_address?: string;
    geometry?: {
        location: {
            lat: number;
            lng: number;
        };
    };
    opening_hours?: {
        open_now: boolean;
        weekday_text?: string[];
    };
    website?: string;
    formatted_phone_number?: string;
    types?: string[];
    photos?: Array<{
        photo_reference: string;
    }>;
}

export default function PlaceDetailScreen() {
    const route = useRoute();
    const { placeId } = route.params as { placeId: string };

    const [place, setPlace] = useState<PlaceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const details = await PlacesService.getPlaceDetails(placeId);
                setPlace(details);
            } catch (err: any) {
                console.error('Error fetching place details:', err);
                setError(err.message || 'Failed to load place details');
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceDetails();
    }, [placeId]);

    const openWebsite = () => {
        if (place?.website) {
            Linking.openURL(place.website);
        }
    };

    const openPhone = () => {
        if (place?.formatted_phone_number) {
            Linking.openURL(`tel:${place.formatted_phone_number}`);
        }
    };

    const openMaps = () => {
        if (place?.geometry?.location) {
            const { lat, lng } = place.geometry.location;
            const url = `https://maps.apple.com/?q=${lat},${lng}&z=15&t=m`;
            Linking.openURL(url).catch(err =>
                console.error('Error opening maps:', err)
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading place details...</Text>
            </View>
        );
    }

    if (error || !place) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>❌ {error || 'Place not found'}</Text>
                <Text style={styles.retryText}>Please try again later</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{place.name}</Text>

            {/* Rating Section */}
            {place.rating && (
                <View style={styles.ratingSection}>
                    <View style={styles.ratingContainer}>
                        <Star size={20} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.rating}>{place.rating}</Text>
                        {place.user_ratings_total && (
                            <Text style={styles.ratingCount}>({place.user_ratings_total} reviews)</Text>
                        )}
                    </View>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={openMaps}>
                    <Navigation size={18} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>

                {place.website && (
                    <TouchableOpacity style={styles.actionButton} onPress={openWebsite}>
                        <Globe size={18} color="#007AFF" />
                        <Text style={styles.actionButtonText}>Website</Text>
                    </TouchableOpacity>
                )}

                {place.formatted_phone_number && (
                    <TouchableOpacity style={styles.actionButton} onPress={openPhone}>
                        <Phone size={18} color="#007AFF" />
                        <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Address */}
            {place.formatted_address && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MapPin size={20} color="#666" />
                        <Text style={styles.sectionTitle}>Address</Text>
                    </View>
                    <Text style={styles.detailText}>{place.formatted_address}</Text>
                </View>
            )}

            {/* Contact Information */}
            {(place.formatted_phone_number || place.website) && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    {place.formatted_phone_number && (
                        <TouchableOpacity style={styles.contactRow} onPress={openPhone}>
                            <Phone size={18} color="#007AFF" />
                            <Text style={[styles.contactText, styles.link]}>{place.formatted_phone_number}</Text>
                        </TouchableOpacity>
                    )}

                    {place.website && (
                        <TouchableOpacity style={styles.contactRow} onPress={openWebsite}>
                            <Globe size={18} color="#007AFF" />
                            <Text style={[styles.contactText, styles.link]} numberOfLines={1}>
                                {place.website.replace(/^https?:\/\//, '')}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Opening Hours */}
            {place.opening_hours && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Clock size={20} color="#333" />
                        <Text style={styles.sectionTitle}>Opening Hours</Text>
                    </View>

                    <View style={[
                        styles.statusBadge,
                        place.opening_hours.open_now ? styles.openBadge : styles.closedBadge
                    ]}>
                        <Text style={styles.statusText}>
                            {place.opening_hours.open_now ? '🟢 Open Now' : '🔴 Closed'}
                        </Text>
                    </View>

                    {place.opening_hours.weekday_text?.map((day: string, index: number) => (
                        <Text key={index} style={styles.hoursText}>{day}</Text>
                    ))}
                </View>
            )}

            {/* Place Types */}
            {place.types && place.types.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <View style={styles.typesContainer}>
                        {place.types.slice(0, 5).map((type: string, index: number) => (
                            <View key={index} style={styles.typeChip}>
                                <Text style={styles.typeText}>{type.replace(/_/g, ' ')}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#ffffff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#ff3b30',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '500',
    },
    retryText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
        textAlign: 'center',
    },
    ratingSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9e6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    rating: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e6b400',
    },
    ratingCount: {
        fontSize: 14,
        color: '#999',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#007AFF',
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    detailText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    contactText: {
        fontSize: 16,
        color: '#333',
    },
    link: {
        color: '#007AFF',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    openBadge: {
        backgroundColor: '#dcfce7',
    },
    closedBadge: {
        backgroundColor: '#fee2e2',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    hoursText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
        lineHeight: 20,
    },
    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeChip: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    typeText: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
});