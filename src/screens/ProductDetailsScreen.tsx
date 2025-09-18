import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
    Dimensions,
    Platform,
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { colors } from '../constants/colors';


export const ProductDetailsScreen: React.FC = ({ navigation, route }: any) => {
    const { product } = route.params;
    console.log('product', product);
    const {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems
    } = useCart();

    // find if product is in cart and get quantity
    const cartItem = cartItems.find(item => item.product.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleRemoveFromCart = () => {
        if (quantityInCart > 0) {
            console.log('removeeee', product.id);
            removeFromCart(product.id);
            Alert.alert('Success', `${product.name} removed from cart!`);
        }
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        console.log('handleUpdateQuantity', newQuantity);
        if (newQuantity < 0) return;

        if (newQuantity === 0) {
            handleRemoveFromCart();
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cartInfo}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Text style={styles.cartText}>Cart: {getTotalItems()} items</Text>
                    <Text style={styles.totalText}>Rs{getTotalPrice().toFixed(2)}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>
                </View>

                {quantityInCart > 0 && (
                    <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>Quantity in Cart:</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleUpdateQuantity(quantityInCart - 1)}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.quantityText}>{quantityInCart}</Text>

                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => handleUpdateQuantity(quantityInCart + 1)}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={handleAddToCart}
                    >
                        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                    </TouchableOpacity>

                    {quantityInCart > 0 && (
                        <TouchableOpacity
                            style={styles.removeFromCartButton}
                            onPress={handleRemoveFromCart}
                        >
                            <Text style={styles.removeFromCartButtonText}>Remove from Cart</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.viewCartButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.viewCartButtonText}>
                            View Cart ({getTotalItems()} items)
                        </Text>
                    </TouchableOpacity>
                </View>

                {cartItems.length > 0 && (
                    <View style={styles.cartSummary}>
                        <Text style={styles.cartSummaryTitle}>Cart Summary</Text>
                        {cartItems.map(item => (
                            <View key={item.product.id} style={styles.cartItem}>
                                <Text style={styles.cartItemName} numberOfLines={1}>
                                    {item.product.name}
                                </Text>
                                <Text style={styles.cartItemDetails}>
                                    {item.quantity} x Rs {item.product.price} = Rs {(item.quantity * item.product.price).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                        <View style={styles.cartTotal}>
                            <Text style={styles.cartTotalText}>
                                Total: Rs {getTotalPrice().toFixed(2)}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>
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
    cartInfo: {
        alignItems: 'flex-end',
    },
    cartText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        backgroundColor: colors.white,
        padding: 20,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    productInfo: {
        backgroundColor: colors.white,
        marginTop: 12,
        padding: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 16,
    },
    productDescription: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    quantityContainer: {
        backgroundColor: colors.white,
        marginTop: 12,
        padding: 20,
        alignItems: 'center',
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textTertiary,
        marginBottom: 12,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginHorizontal: 20,
        minWidth: 30,
        textAlign: 'center',
    },
    actionsContainer: {
        backgroundColor: colors.white,
        marginTop: 12,
        padding: 20,
    },
    addToCartButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    addToCartButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    removeFromCartButton: {
        backgroundColor: colors.danger,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    removeFromCartButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    viewCartButton: {
        backgroundColor: colors.buttonGray,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    viewCartButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    cartSummary: {
        backgroundColor: colors.white,
        marginTop: 12,
        marginBottom: 20,
        padding: 20,
    },
    cartSummaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cartItemName: {
        flex: 1,
        fontSize: 14,
        color: colors.textTertiary,
        marginRight: 8,
    },
    cartItemDetails: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    cartTotal: {
        paddingTop: 12,
        marginTop: 8,
        borderTopWidth: 2,
        borderTopColor: colors.border,
    },
    cartTotalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textPrimary,
        textAlign: 'right',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});
