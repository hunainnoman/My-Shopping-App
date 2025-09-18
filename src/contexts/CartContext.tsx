import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContextType, CartItem, Product } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        loadCartFromStorage();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            saveCartToStorage();
        }
    }, [cartItems]);


    const loadCartFromStorage = async () => {
        try {
            const cartData = await AsyncStorage.getItem('cart');
            if (cartData) {
                setCartItems(JSON.parse(cartData));
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
        }
    };

    const saveCartToStorage = async () => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    };

    const addToCart = (product: Product) => {
        // see if the product is already in the cart
        const existingItem = cartItems.find(item => item.product.id === product.id);

        if (existingItem) {
            // if product exists then add by 1
            const updatedItems = [];
            for (const item of cartItems) {
                if (item.product.id === product.id) {
                    updatedItems.push({ ...item, quantity: item.quantity + 1 });
                } else {
                    updatedItems.push(item);
                }
            }
            setCartItems(updatedItems);
        } else {
            // ff the product is not in the cart, add it with a quantity of 1
            const newItem = { product, quantity: 1 };
            setCartItems([...cartItems, newItem]);
        }
    };

    const removeFromCart = (productId: number) => {
        // create new array without the product to remove
        const updatedItems = [];
        for (const item of cartItems) {
            if (item.product.id !== productId) {
                updatedItems.push(item);
            }
        }
        setCartItems(updatedItems);
    };

    const updateQuantity = (productId: number, quantity: number) => {
        // ff quantity get to 0 or less, remove the item completely
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // update the quantity for the specific product
        const updatedItems = [];
        for (const item of cartItems) {
            if (item.product.id === productId) {
                // found the product then update its quantity
                updatedItems.push({ ...item, quantity: quantity });
            } else {
                updatedItems.push(item);
            }
        }
        setCartItems(updatedItems);
    };

    const getTotalPrice = (): number => {
        if (!cartItems || cartItems.length === 0) return 0;
        let total = 0;
        for (const item of cartItems) {
            total += item.product.price * item.quantity;
        }
        return total;
    };

    const getTotalItems = (): number => {
        if (!cartItems || cartItems.length === 0) return 0;
        let total = 0;
        for (const item of cartItems) {
            total += item.quantity;
        }
        return total;
    };

    const clearCart = () => {
        setCartItems([]);
        AsyncStorage.removeItem('cart');
    };

    const value: CartContextType = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
