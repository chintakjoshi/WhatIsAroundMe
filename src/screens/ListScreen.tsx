import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLocation } from '../context/LocationContext';
import SearchHeader from '../components/SearchHeader';
import NetworkStatus from '../components/NetworkStatus';
import PlaceCard from '../components/PlaceCard';

// Define the EmptyComponent separately
const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No places found</Text>
        <Text style={styles.emptyText}>
            Try adjusting your search or filters
        </Text>
    </View>
);

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function ListScreen() {
    const navigation = useNavigation<ListScreenNavigationProp>();
    const {
        places,
        loading,
        refreshLocation,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory
    } = useLocation();

    const showInitialLoading = loading && places.length === 0;

    const onRefresh = () => {
        refreshLocation();
    };

    const handlePlacePress = (placeId: string) => {
        navigation.navigate('PlaceDetail', { placeId });
    };

    if (showInitialLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>
                        {searchQuery || selectedCategory
                            ? `Searching for ${searchQuery || selectedCategory}...`
                            : 'Finding places near you...'
                        }
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show loading only on initial load, not during refresh
    if (loading && places.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Finding places near you...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <SearchHeader
                onSearch={setSearchQuery}
                onCategoryFilter={setSelectedCategory}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
            />
            <NetworkStatus />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nearby Places</Text>
                    <Text style={styles.subtitle}>
                        {places.length > 0
                            ? `Found ${places.length} places`
                            : 'No places found'
                        }
                        {(searchQuery || selectedCategory) && ' with current filters'}
                    </Text>
                </View>

                <FlatList
                    data={places}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading && places.length > 0}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                            colors={['#007AFF']}
                        />
                    }
                    renderItem={({ item, index }) => (
                        <PlaceCard
                            place={item}
                            onPress={() => handlePlacePress(item.id)}
                            showActions={true}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={places.length === 0 && !loading ? EmptyComponent : undefined}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 16,
        paddingBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 30,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        lineHeight: 22,
    },
    searchLoadingOverlay: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchLoadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
});
