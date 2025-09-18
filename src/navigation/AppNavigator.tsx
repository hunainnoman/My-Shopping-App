import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { AddProductScreen } from '../screens/AddProductScreen';
import { CartScreen } from '../screens/CartScreen';
import { Product } from '../types';

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    ProductDetails: { product: Product };
    AddProduct: undefined;
    Cart: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                }}
            >
                {!isAuthenticated ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
                        <Stack.Screen name="AddProduct" component={AddProductScreen} />
                        <Stack.Screen name="Cart" component={CartScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
