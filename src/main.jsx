import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";
import Products from "./src/pages/products";
import ProductDetails from "./src/pages/productdetails";
import Cart from "./src/pages/cart";
import Checkout from "./src/pages/checkout";
import { CartProvider } from "./src/context/CartContext";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import { AuthProvider } from "./src/context/AuthContext";
import Login from "./src/pages/login";
import Signup from "./src/pages/signup";
import Account from "./src/pages/account";
import Orders from "./src/pages/orders";
import Addresses from "./src/pages/addresses";
import Contact from "./src/pages/contact";
import NotFound from "./src/pages/notfound";
import Navbar from "./components/Navbar";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<Account />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/product/:id"
                element={<ProductDetails />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);