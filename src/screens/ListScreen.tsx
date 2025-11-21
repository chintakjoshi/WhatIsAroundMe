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
import { useTheme } from '../context/ThemeContext';

const EmptyComponent = () => {
    const { colors } = useTheme();
    return (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No places found</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Try adjusting your search or filters
            </Text>
        </View>
    );
};

type ListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function ListScreen() {
    const navigation = useNavigation<ListScreenNavigationProp>();
    const { colors } = useTheme();
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
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>
                        {searchQuery || selectedCategory
                            ? `Searching for ${searchQuery || selectedCategory}...`
                            : 'Finding places near you...'
                        }
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <SearchHeader
                onSearch={setSearchQuery}
                onCategoryFilter={setSelectedCategory}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
            />
            <NetworkStatus />

            {/* Show search loading overlay */}
            {loading && places.length > 0 && (
                <View style={[styles.searchLoadingOverlay, { backgroundColor: colors.card }]}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.searchLoadingText, { color: colors.text }]}>Searching...</Text>
                </View>
            )}

            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Nearby Places</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
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
                            tintColor={colors.primary}
                            colors={[colors.primary]}
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
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
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    searchLoadingOverlay: {
        position: 'absolute',
        top: 100,
        alignSelf: 'center',
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
    },
});