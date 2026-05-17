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
import Navbar from "./components/Navbar";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);