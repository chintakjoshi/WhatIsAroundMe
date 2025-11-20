import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Text
} from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';

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

export default function SearchHeader({
    onSearch,
    onCategoryFilter,
    searchQuery,
    selectedCategory
}: SearchHeaderProps) {
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

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search places..."
                        value={localSearchQuery}
                        onChangeText={handleSearchChange}
                        returnKeyType="search"
                    />
                    {hasActiveFilters && (
                        <TouchableOpacity onPress={clearAll}>
                            <X size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        (showFilters || selectedCategory) && styles.filterButtonActive
                    ]}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Filter
                        size={20}
                        color={(showFilters || selectedCategory) ? "#007AFF" : "#666"}
                    />
                </TouchableOpacity>
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
                                selectedCategory === category.id && styles.categoryButtonSelected
                            ]}
                            onPress={() => handleCategorySelect(category.id)}
                        >
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text style={[
                                styles.categoryText,
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
                    <Text style={styles.activeFiltersText}>
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
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f8f9fa',
    },
    filterButtonActive: {
        backgroundColor: '#e3f2fd',
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
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
    },
    categoryButtonSelected: {
        backgroundColor: '#007AFF',
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
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
        color: '#007AFF',
        fontStyle: 'italic',
    },
});