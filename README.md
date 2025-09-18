# MyShoppingApp - React Native Shopping Application

## Features

### Authentication

- **Login Screen**: Users sign in with an email and password
- **Test User**: You can log in using `test@test.com` with password `123456`
- **Form Validation**: Makes sure the email is in the right format and that all fields are filled
- **Success/Error Handling**: On successful login, the app navigates to the Home screen; otherwise, it shows an error message.
- **Persistent Login**: User stays logged in using AsyncStorage

### Home Page (Products List)

- **Product Catalog**: Loads products from the JSON server and displays
- **Product Cards**: Each card shows the product’s image, name, price, and a “View Details” button
- **Search Functionality**: Lets users filter products by name instantly as they type
- **Pull-to-Refresh**: Users can swipe down to reload the product list
- **Cart Badge**: Displays the total number of items currently in the cart
- **Add Product Button**: Navigate to Add Product screen

### Product Details Page

- **Product Information**: Display image, name, description, and price
- **Cart Management**: Add to cart, remove from cart, update quantity
- **Dynamic Cart Controls**: Show quantity controls when item is in cart
- **Cart Summary**: Real-time display of all cart items and total price

### Search Products

- **Real-time Filtering**: Filter products by name as user types in the field

### Shopping Cart

- **Dedicated Cart Screen**: Full-featured cart management interface
- **Local State Management**: Using React Context and AsyncStorage
- **Cart Operations**: Add, remove, update quantity, clear cart
- **Total Calculation**: total price and item count
- **Cart Navigation**: Access cart from Home, Product Details screens

### JSON Mock Server

- **json-server**: Mock REST API backend
- **Database**: `db.json` with products and users
- **Endpoints**:
  - `GET /products` - Fetch all products
  - `POST /products` - Add new product
- **Sample Data**: Pre-populated with 4 sample products

## Setup Instructions

### Prerequisites

- Node.js >= 18
- React Native cli development environment set up
- Android Studio (for Android) or Xcode (for iOS)

### Installation

1. **Clone the repository**
   cd MyShoppingApp

2. **Install dependencies**
   yarn install

3. **Install iOS dependencies** (iOS only)
   cd ios && pod install

4. **Start the JSON server** (in a separate terminal)
   yarn run json-server
   This will start the mock server at `http://localhost:3000`

## For Evaluators/Reviewers

### Recommended: Android Emulator (Easiest)

1. Use **Android Emulator** (not real device)
2. Run `yarn install`
3. Run `yarn run json-server` (in separate terminal)
4. Run `yarn run android`
5. App will automatically connect to API via (emulator default url) `http://10.0.2.2:3000`

6. **Start the Metro**

   yarn start

7. **Run on device/simulator**

   # For Android

   yarn run android

   # For iOS

   yarn run ios

## API Endpoints

The JSON server provides the following endpoints:

- `GET http://localhost:3000/products` - Get all products
- `POST http://localhost:3000/products` - Add new product
- `GET http://localhost:3000/users` - Get users (for reference)

## Test Credentials

- **Email**: `test@test.com`
- **Password**: `123456`
