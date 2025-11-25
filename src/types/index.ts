export interface Location {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
}

export interface Place {
    id: string;
    name: string;
    vicinity?: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
    rating?: number;
    types?: string[];
    photos?: Array<{
        photo_reference: string;
        html_attributions?: string[];
    }>;
    opening_hours?: {
        open_now: boolean;
        weekday_text?: string[];
    };
    user_ratings_total?: number;
    formatted_phone_number?: string;
    website?: string;
    distance?: number;
    formattedDistance?: string;
    formatted_address?: string;
}

export interface PlaceCategory {
    id: string;
    name: string;
    icon: string;
    type: string;
}