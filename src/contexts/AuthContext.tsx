import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // check if user is already logged in
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // hardcoded user authentication as per requirements
            if (email === 'test@test.com' && password === '123456') {
                const userData: User = {
                    id: 1,
                    email: 'test@test.com',
                    password: '123456',
                };

                await AsyncStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
