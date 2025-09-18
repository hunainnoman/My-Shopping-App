import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../types';
import { colors } from '../constants/colors';


export const CartScreen: React.FC = ({ navigation }: any) => {
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        getTotalPrice,
        getTotalItems,
        clearCart
    } = useCart();

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleRemoveItem = (productId: number) => {
        Alert.alert(
            'Remove Item',
            'Are you sure you want to remove this item from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => removeFromCart(productId)
                },
            ]
        );
    };

    const handleClearCart = () => {
        if (cartItems.length === 0) return;

        Alert.alert(
            'Clear Cart',
            'Are you sure you want to remove all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: clearCart
                },
            ]
        );
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.product.image }} style={styles.productImage} />

            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.product.name}
                </Text>
                <Text style={styles.productPrice}>Rs{item.product.price}</Text>
                <Text style={styles.itemTotal}>
                    Subtotal: Rs{(item.product.price * item.quantity).toFixed(2)}
                </Text>
            </View>

            <View style={styles.quantityControls}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                >
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantityText}>{item.quantity}</Text>

                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.product.id)}
            >
                <Text style={styles.removeButtonText}>x</Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmptyCart = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add some products</Text>
            <TouchableOpacity
                style={styles.shopNowButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Shopping Cart</Text>

                {cartItems.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearCart}
                    >
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </TouchableOpacity>
                )}
            </View>

            {cartItems.length === 0 ? (
                renderEmptyCart()
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.product.id.toString()}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.cartList}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.cartSummary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Items:</Text>
                            <Text style={styles.summaryValue}>{getTotalItems()}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Price:</Text>
                            <Text style={styles.totalPrice}>Rs{getTotalPrice().toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity style={styles.checkoutButton}>
                            <Text style={styles.checkoutButtonText}>
                                Proceed to Checkout - Rs{getTotalPrice().toFixed(2)}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.continueShoppingButton}
                            onPress={() => navigation.navigate('Home')}
                        >
                            <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.buttonSecondary,
        borderRadius: 6,
    },
    backButtonText: {
        fontSize: 16,
        color: colors.textTertiary,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.danger,
        borderRadius: 6,
    },
    clearButtonText: {
        fontSize: 14,
        color: colors.white,
        fontWeight: '500',
    },
    cartList: {
        padding: 16,
    },
    cartItem: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
        marginRight: 12,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    quantityButton: {
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        backgroundColor: colors.danger,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 32,
        textAlign: 'center',
    },
    shopNowButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    shopNowButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cartSummary: {
        backgroundColor: colors.white,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    checkoutButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 12,
    },
    checkoutButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    continueShoppingButton: {
        backgroundColor: colors.buttonSecondary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    continueShoppingButtonText: {
        color: colors.textTertiary,
        fontSize: 16,
        fontWeight: '500',
    },
});
