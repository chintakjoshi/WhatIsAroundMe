import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Text,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Search, Filter, X, Settings, Utensils, Coffee, Trees, Landmark, Glasses, ShoppingBag, Fuel, Heart, Plus, DollarSign } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';

const iconMap: { [key: string]: React.ComponentType<any> } = {
    utensils: Utensils,
    coffee: Coffee,
    tree: Trees,
    landmark: Landmark,
    glass: Glasses,
    'shopping-bag': ShoppingBag,
    fuel: Fuel,
    heart: Heart,
    plus: Plus,
    'dollar-sign': DollarSign,
};

interface SearchHeaderProps {
    onSearch: (query: string) => void;
    onCategoryFilter: (category: string | null) => void;
    searchQuery: string;
    selectedCategory: string | null;
}

type SearchHeaderNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function SearchHeader({
    onSearch,
    onCategoryFilter,
    searchQuery,
    selectedCategory
}: SearchHeaderProps) {
    const navigation = useNavigation<SearchHeaderNavigationProp>();
    const { colors, isDark } = useTheme();
    const { categories, loadingCategories } = useLocation();
    const [showFilters, setShowFilters] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

    useEffect(() => {
        setLocalSearchQuery(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (text: string) => {
        setLocalSearchQuery(text);
        onSearch(text);
    };

    const handleCategorySelect = (categoryType: string) => {
        const newCategory = selectedCategory === categoryType ? null : categoryType;
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

    const getCategoryIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        if (IconComponent) {
            return <IconComponent size={16} color={colors.textSecondary} />;
        }
        return <Utensils size={16} color={colors.textSecondary} />;
    };

    const getSelectedCategoryName = () => {
        if (!selectedCategory) return null;
        const category = categories.find(cat => cat.type === selectedCategory);
        return category ? category.name : selectedCategory;
    };

    const containerBgColor = isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)';

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={[styles.searchInputContainer, { backgroundColor: containerBgColor }]}>
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
                            { backgroundColor: containerBgColor },
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
                        style={[styles.settingsButton, { backgroundColor: containerBgColor }]}
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
                    {loadingCategories ? (
                        <View style={[styles.loadingContainer, { backgroundColor: containerBgColor }]}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                Loading categories...
                            </Text>
                        </View>
                    ) : (
                        categories.map((category) => {
                            const isSelected = selectedCategory === category.type;

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryButton,
                                        { backgroundColor: containerBgColor },
                                        isSelected && [styles.categoryButtonSelected, { backgroundColor: colors.primary }]
                                    ]}
                                    onPress={() => handleCategorySelect(category.type)}
                                >
                                    {(() => {
                                        const IconComponent = iconMap[category.icon] || Utensils;
                                        return <IconComponent size={16} color={isSelected ? 'white' : colors.textSecondary} />;
                                    })()}
                                    <Text style={[
                                        styles.categoryText,
                                        { color: colors.textSecondary },
                                        isSelected && styles.categoryTextSelected
                                    ]}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            )}

            {hasActiveFilters && !showFilters && (
                <View style={styles.activeFiltersContainer}>
                    <View style={[styles.activeFiltersBadge, { backgroundColor: containerBgColor }]}>
                        <Text style={[styles.activeFiltersText, { color: colors.primary }]}>
                            Active filters:
                            {searchQuery && ` "${searchQuery}"`}
                            {selectedCategory && ` ${getSelectedCategoryName()}`}
                        </Text>
                    </View>
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
        backgroundColor: 'transparent',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filterButtonActive: {
        opacity: 1,
    },
    settingsButton: {
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoriesContainer: {
        maxHeight: 60,
        marginTop: 8,
    },
    categoriesContent: {
        paddingVertical: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loadingText: {
        fontSize: 14,
        marginLeft: 8,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryButtonSelected: {
        // Background color handled inline
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
        alignItems: 'flex-start',
    },
    activeFiltersBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activeFiltersText: {
        fontSize: 12,
        fontWeight: '500',
    },
});