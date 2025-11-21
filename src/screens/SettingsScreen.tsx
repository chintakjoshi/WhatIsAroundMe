import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, Check, Moon, Sun, Smartphone } from 'lucide-react-native';

export default function SettingsScreen({ navigation }: any) {
    const { theme, setTheme, colors } = useTheme();

    const themeOptions = [
        {
            id: 'default' as const,
            name: 'System Default',
            description: 'Use your device theme settings',
            icon: Smartphone,
        },
        {
            id: 'light' as const,
            name: 'Light Mode',
            description: 'Always use light theme',
            icon: Sun,
        },
        {
            id: 'dark' as const,
            name: 'Dark Mode',
            description: 'Always use dark theme',
            icon: Moon,
        },
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeft size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={[styles.container, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Theme Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Appearance
                    </Text>
                    <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                        Choose how the app looks
                    </Text>

                    <View style={styles.themeOptions}>
                        {themeOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = theme === option.id;

                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.themeOption,
                                        {
                                            backgroundColor: colors.searchBackground,
                                            borderColor: isSelected ? colors.primary : colors.border,
                                        }
                                    ]}
                                    onPress={() => setTheme(option.id)}
                                >
                                    <View style={styles.themeOptionContent}>
                                        <View style={styles.themeOptionLeft}>
                                            <View style={[
                                                styles.themeIconContainer,
                                                { backgroundColor: colors.primary + '20' }
                                            ]}>
                                                <Icon size={20} color={colors.primary} />
                                            </View>
                                            <View style={styles.themeTextContainer}>
                                                <Text style={[styles.themeName, { color: colors.text }]}>
                                                    {option.name}
                                                </Text>
                                                <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                                                    {option.description}
                                                </Text>
                                            </View>
                                        </View>

                                        {isSelected && (
                                            <Check size={20} color={colors.primary} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* App Info Section */}
                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        About
                    </Text>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Version
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            1.0.0
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Built with
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            React Native & Expo
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    placeholder: {
        width: 32,
    },
    container: {
        flex: 1,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 16,
    },
    themeOptions: {
        gap: 12,
    },
    themeOption: {
        borderRadius: 12,
        borderWidth: 2,
        padding: 16,
    },
    themeOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    themeOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    themeIconContainer: {
        padding: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    themeTextContainer: {
        flex: 1,
    },
    themeName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    themeDescription: {
        fontSize: 14,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    infoLabel: {
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
    },
});