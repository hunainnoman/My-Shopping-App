import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
