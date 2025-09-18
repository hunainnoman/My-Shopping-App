import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../services/api';
import { fallbackProducts } from '../data/fallbackProducts';
import { Product } from '../types';
import { colors } from '../constants/colors';

export const HomeScreen: React.FC = ({ navigation }: any) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { logout, user } = useAuth();
    const { getTotalItems, clearCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, products]);

    useFocusEffect(
        React.useCallback(() => {
            if (products.length > 0) {
                fetchProducts();
            }
        }, [products.length])
    );


    // fetch products from api or use fallback dummy data if api fails
    const fetchProducts = async () => {
        try {
            const fetchedProducts = await apiService.getProducts();
            setProducts(fetchedProducts);
            setFilteredProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts(fallbackProducts);
            setFilteredProducts(fallbackProducts);
            Alert.alert('Using demo products (API server not available)');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const fetchedProducts = await apiService.getProducts();
            setProducts(fetchedProducts);
            setFilteredProducts(fetchedProducts);
        } catch (error) {
            console.error('Error refreshing products:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const filterProducts = () => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
        } else {
            // this filters by name
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure? This will clear your cart too.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'yes, Logout',
                    style: 'destructive',
                    onPress: () => {
                        clearCart();
                        logout();
                    }
                },
            ]
        );
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.productPrice}>Rs {item.price}</Text>
                <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => navigation.navigate('ProductDetails', { product: item })}
                >
                    <Text style={styles.viewDetailsButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
                        <Text style={styles.cartButtonText}>Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <TouchableOpacity
                style={styles.addProductButton}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Text style={styles.addProductButtonText}>+ Add New Product</Text>
            </TouchableOpacity>

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderProduct}
                numColumns={2}
                contentContainerStyle={styles.productsContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'No products found' : 'No products available'}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textSecondary,
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
    headerLeft: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    userEmail: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: colors.primary,
        borderRadius: 6,
        marginRight: 8,
    },
    cartButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    cartBadgeText: {
        color: colors.white,
        fontSize: 11,
        paddingRight: 5,
        fontWeight: 'bold',
    },
    logoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.danger,
        borderRadius: 6,
    },
    logoutButtonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    searchInput: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderInput,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.textPrimary,
    },
    addProductButton: {
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    addProductButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    productsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    productCard: {
        width: '47%',
        backgroundColor: colors.white,
        borderRadius: 12,
        margin: 6,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 4,
        minHeight: 34,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },
    viewDetailsButton: {
        backgroundColor: colors.buttonSecondary,
        borderRadius: 6,
        paddingVertical: 6,
        alignItems: 'center',
    },
    viewDetailsButtonText: {
        color: colors.textTertiary,
        fontSize: 12,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
});
