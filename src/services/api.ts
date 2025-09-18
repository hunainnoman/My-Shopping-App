import { Product } from '../types';
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine localhost
      return 'http://10.0.2.2:3000';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:3000';
    }
  }
  // Production URL would go here
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();
console.log('API_BASE_URL:', API_BASE_URL);

export const apiService = {
  // get all products from the API
  getProducts: async (): Promise<Product[]> => {
    try {
      console.log('Fetching from:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();
      console.log('Products loaded:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // add a new product to the API
  addProduct: async (product: any): Promise<Product> => {
    try {
      console.log('Adding product:', product.name);
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.status}`);
      }
      
      const newProduct = await response.json();
      console.log('Product added successfully:', newProduct.id);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },
};
