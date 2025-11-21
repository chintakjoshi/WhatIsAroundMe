import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'default' | 'light' | 'dark';

interface ThemeColors {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    tabIcon: string;
    tabIconSelected: string;
    header: string;
    searchBackground: string;
}

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    colors: ThemeColors;
    isDark: boolean;
    actualTheme: 'light' | 'dark';
}

const lightColors: ThemeColors = {
    background: '#ffffff',
    card: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    border: '#f0f0f0',
    primary: '#007AFF',
    tabIcon: '#8e8e93',
    tabIconSelected: '#007AFF',
    header: '#ffffff',
    searchBackground: '#f8f9fa',
};

const darkColors: ThemeColors = {
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#98989f',
    border: '#38383a',
    primary: '#0a84ff',
    tabIcon: '#98989f',
    tabIconSelected: '#0a84ff',
    header: '#1c1c1e',
    searchBackground: '#2c2c2e',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@whats_around_me_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setThemeState] = useState<ThemeMode>('default');
    const [isReady, setIsReady] = useState(false);

    // Load saved theme from storage
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedTheme) {
                    setThemeState(savedTheme as ThemeMode);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsReady(true);
            }
        };

        loadTheme();
    }, []);

    // Save theme when it changes
    const setTheme = async (newTheme: ThemeMode) => {
        try {
            setThemeState(newTheme);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };

    // Determine which colors to use based on theme preference
    const getActualTheme = (): 'light' | 'dark' => {
        if (theme === 'default') {
            return systemColorScheme === 'dark' ? 'dark' : 'light';
        }
        return theme;
    };

    const actualTheme = getActualTheme();
    const colors = actualTheme === 'dark' ? darkColors : lightColors;
    const isDark = actualTheme === 'dark';

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        });

        return () => subscription.remove();
    }, []);

    // Don't render until theme is loaded to avoid flash
    if (!isReady) {
        return null;
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                colors,
                isDark,
                actualTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};