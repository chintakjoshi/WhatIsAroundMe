import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Text
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Search, Filter, X, Settings } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface SearchHeaderProps {
    onSearch: (query: string) => void;
    onCategoryFilter: (category: string | null) => void;
    searchQuery: string;
    selectedCategory: string | null;
}

const categories = [
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️' },
    { id: 'cafe', name: 'Cafés', icon: '☕' },
    { id: 'park', name: 'Parks', icon: '🌳' },
    { id: 'museum', name: 'Museums', icon: '🏛️' },
    { id: 'bar', name: 'Bars', icon: '🍸' },
    { id: 'store', name: 'Stores', icon: '🛍️' },
    { id: 'gas_station', name: 'Gas', icon: '⛽' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
];

type SearchHeaderNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function SearchHeader({
    onSearch,
    onCategoryFilter,
    searchQuery,
    selectedCategory
}: SearchHeaderProps) {
    const navigation = useNavigation<SearchHeaderNavigationProp>();
    const { colors } = useTheme();
    const [showFilters, setShowFilters] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (text: string) => {
        setLocalSearchQuery(text);
        onSearch(text);
    };

    const handleCategorySelect = (categoryId: string) => {
        const newCategory = selectedCategory === categoryId ? null : categoryId;
        onCategoryFilter(newCategory);
    };

    const clearAll = () => {
        setLocalSearchQuery('');
        onSearch('');
        onCategoryFilter(null);
    };

    const hasActiveFilters = localSearchQuery || selectedCategory;

    const openSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.header, borderBottomColor: colors.border }]}>
            <View style={styles.searchContainer}>
                <View style={[styles.searchInputContainer, { backgroundColor: colors.searchBackground }]}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search places..."
                        placeholderTextColor={colors.textSecondary}
                        value={localSearchQuery}
                        onChangeText={handleSearchChange}
                        returnKeyType="search"
                    />
                    {hasActiveFilters && (
                        <TouchableOpacity onPress={clearAll}>
                            <X size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            { backgroundColor: colors.searchBackground },
                            (showFilters || selectedCategory) && styles.filterButtonActive
                        ]}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Filter
                            size={20}
                            color={(showFilters || selectedCategory) ? colors.primary : colors.textSecondary}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.settingsButton, { backgroundColor: colors.searchBackground }]}
                        onPress={openSettings}
                    >
                        <Settings size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {showFilters && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                { backgroundColor: colors.searchBackground },
                                selectedCategory === category.id && [styles.categoryButtonSelected, { backgroundColor: colors.primary }]
                            ]}
                            onPress={() => handleCategorySelect(category.id)}
                        >
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text style={[
                                styles.categoryText,
                                { color: colors.textSecondary },
                                selectedCategory === category.id && styles.categoryTextSelected
                            ]}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {hasActiveFilters && !showFilters && (
                <View style={styles.activeFiltersContainer}>
                    <Text style={[styles.activeFiltersText, { color: colors.primary }]}>
                        Active filters:
                        {searchQuery && ` "${searchQuery}"`}
                        {selectedCategory && ` ${categories.find(c => c.id === selectedCategory)?.name}`}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        padding: 10,
        borderRadius: 10,
    },
    filterButtonActive: {
        opacity: 0.8,
    },
    settingsButton: {
        padding: 10,
        borderRadius: 10,
    },
    categoriesContainer: {
        maxHeight: 60,
    },
    categoriesContent: {
        paddingVertical: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
    },
    categoryButtonSelected: {
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
    },
    categoryTextSelected: {
        color: 'white',
    },
    activeFiltersContainer: {
        marginTop: 8,
        paddingVertical: 4,
    },
    activeFiltersText: {
        fontSize: 12,
        fontStyle: 'italic',
    },
});