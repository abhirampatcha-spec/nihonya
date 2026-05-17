import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import { products as localProducts } from "../src/shared/data/products";
import { categories } from "../src/shared/constants/categories";
import {
  addToCart as addToCartHelper,
  getItemCount,
  getSubtotal,
  removeFromCart as removeFromCartHelper,
  updateQuantity as updateQuantityHelper,
  clearCart as clearCartHelper,
} from "../src/shared/cart/cartUtils";

const screens = {
  HOME: "home",
  DETAILS: "details",
  CART: "cart",
  FAVORITES: "favorites",
  PROFILE: "profile",
  CHECKOUT: "checkout",
};

const BACKEND_HOSTS =
  Platform.OS === "android"
    ? ["http://10.0.2.2:4000", "http://127.0.0.1:4000"]
    : ["http://localhost:4000", "http://127.0.0.1:4000"];

export default function App() {
  const [screen, setScreen] = useState(screens.HOME);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLaunchOffer, setShowLaunchOffer] = useState(true);
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);

  const bankOffers = [
    { label: "HDFC Bank", discount: "5% off" },
    { label: "ICICI Bank", discount: "4% cashback" },
    { label: "SBI Card", discount: "EMI 6 months" },
  ];


  const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
let response = null;
      for (const host of BACKEND_HOSTS) {
        try {
          response = await fetch(`${host}/api/products`);
          if (!response.ok) {
            continue;
          }
          break;
        } catch (fetchError) {
          response = null;
        }
      }

      if (!response || !response.ok) {
          throw new Error("Unable to load products from backend");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load products";
        setError(message);
        setProducts(localProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const retryFetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let response = null;
      for (const host of BACKEND_HOSTS) {
        try {
          response = await fetch(`${host}/api/products`);
          if (!response.ok) continue;
          break;
        } catch (e) {
          response = null;
        }
      }

      if (!response || !response.ok) throw new Error("Unable to load products from backend");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load products";
      setError(message);
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    setDetailLoading(true);
    setDetailError(null);
    setDetailProduct(null);
    try {
      let response = null;
      for (const host of BACKEND_HOSTS) {
        try {
          response = await fetch(`${host}/api/products/${id}`);
          if (!response.ok) continue;
          break;
        } catch (e) {
          response = null;
        }
      }

      if (!response || !response.ok) throw new Error("Unable to load product from backend");
      const data = await response.json();
      setDetailProduct(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load product";
      setDetailError(message);
      setDetailProduct(selectedProduct || null);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (screen !== screens.DETAILS) return;
    if (!selectedProduct || !selectedProduct.id) return;
    fetchProductById(selectedProduct.id);
  }, [screen, selectedProduct]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) =>
        selectedCategory === "All"
          ? true
          : item.category === selectedCategory
      )
      .filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
  }, [search, selectedCategory]);

  const favoriteProducts = useMemo(
    () => products.filter((item) => favorites.has(item.id)),
    [favorites]
  );

  const itemCount = useMemo(() => getItemCount(cartItems), [cartItems]);
  const subtotal = useMemo(() => getSubtotal(cartItems), [cartItems]);

  const addToCart = (product, amount = 1) => {
    setCartItems((current) => addToCartHelper(current, product, amount));
  };

  const updateQuantity = (productId, nextQuantity) => {
    setCartItems((current) =>
      updateQuantityHelper(current, productId, nextQuantity)
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((current) => removeFromCartHelper(current, productId));
  };

  const clearCart = () => {
    setCartItems(clearCartHelper());
  };

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setScreen(screens.DETAILS);
  };

  const renderHeader = () => (
    <View
      style={{
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: "900", color: "#111" }}>
            Nihonya
          </Text>
          <Text style={{ marginTop: 4, color: "#777", fontSize: 14 }}>
            Premium Japanese furniture in India
          </Text>
        </View>
        <View style={{ backgroundColor: "#F4F1EC", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24 }}>
          <Text style={{ color: "#111", fontWeight: "700" }}>Launch Offer</Text>
          <Text style={{ color: "#555", fontSize: 12, marginTop: 2 }}>
            Flat 25% off selected products
          </Text>
        </View>
      </View>
    </View>
  );

  const renderLaunchModal = () => (
    <Modal visible={showLaunchOffer} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#fff",
            borderRadius: 30,
            padding: 24,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "900", color: "#111" }}>
            Launch Offer
          </Text>
          <Text style={{ marginTop: 12, color: "#555", fontSize: 16, lineHeight: 24 }}>
            Flat 25% off on selected products. Use code NIHONYA25 at checkout and enjoy extra bank offers with HDFC, ICICI, and SBI.
          </Text>
          <View style={{ marginTop: 20 }}>
            {bankOffers.map((offer) => (
              <Text key={offer.label} style={{ marginTop: 10, color: "#333", fontSize: 15 }}>
                • {offer.label}: {offer.discount}
              </Text>
            ))}
          </View>
          <Pressable
            onPress={() => setShowLaunchOffer(false)}
            style={{
              marginTop: 24,
              backgroundColor: "#111",
              borderRadius: 24,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Got it
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const renderProductCard = (item) => (
    <View
      key={item.id}
      style={{
        backgroundColor: "#fff",
        marginHorizontal: 25,
        marginTop: 25,
        borderRadius: 35,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: "100%",
          height: 320,
          borderRadius: 25,
        }}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: "700" }}>{item.name}</Text>
        <Text
          style={{
            marginTop: 8,
            color: "#777",
            fontSize: 16,
            lineHeight: 22,
          }}
        >
          {item.description}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 25,
          }}
        >
          <Text style={{ fontSize: 34, fontWeight: "800" }}>{formatINR(item.price)}</Text>
          <TouchableOpacity
            onPress={() => handleViewDetails(item)}
            style={{
              backgroundColor: "#111",
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 30,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => addToCart(item)}
            style={{
              backgroundColor: "#111",
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 30,
              marginRight: 12,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Add to Cart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addToCart(item);
              setScreen(screens.CART);
            }}
            style={{
              backgroundColor: "#F4F1EC",
              borderRadius: 30,
              paddingHorizontal: 24,
              paddingVertical: 16,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#111", fontWeight: "700" }}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={{
            marginTop: 20,
            alignSelf: "flex-start",
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderRadius: 30,
            backgroundColor: favorites.has(item.id)
              ? "#EF4444"
              : "#F4F1EC",
          }}
        >
          <Text
            style={{
              color: favorites.has(item.id) ? "#fff" : "#111",
              fontWeight: "700",
            }}
          >
            {favorites.has(item.id) ? "♥ Favorited" : "♡ Favorite"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHome = () => (
    <>
      {renderHeader()}
      {error ? (
        <View
          style={{
            marginHorizontal: 25,
            marginTop: 20,
            padding: 16,
            borderRadius: 24,
            backgroundColor: "#fee2e2",
          }}
        >
          <Text style={{ color: "#92400e", fontWeight: "700" }}>
            Local backend unreachable
          </Text>
          <Text style={{ color: "#92400e", marginTop: 8 }}>
            {error}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <TouchableOpacity onPress={retryFetchProducts} style={{ backgroundColor: "#111", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setError(null)} style={{ backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#E8E1D8" }}>
              <Text style={{ color: "#111", fontWeight: "700" }}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View style={{ paddingHorizontal: 25, paddingBottom: 20 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products..."
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            height: 55,
            paddingHorizontal: 20,
            fontSize: 16,
            marginTop: 10,
          }}
        />


        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={{
                backgroundColor:
                  selectedCategory === item ? "#111" : "#E8E1D8",
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderRadius: 30,
                marginRight: 15,
              }}
            >
              <Text
                style={{
                  color: selectedCategory === item ? "#fff" : "#111",
                  fontWeight: "700",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View
          style={{
            marginHorizontal: 25,
            marginTop: 20,
            padding: 25,
            borderRadius: 30,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#111" />
          <Text style={{ marginTop: 12, color: "#777", fontSize: 16 }}>
            Loading products...
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View
          style={{
            marginHorizontal: 25,
            marginTop: 20,
            padding: 25,
            borderRadius: 30,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "800", marginBottom: 10 }}>
            Nothing found
          </Text>
          <Text style={{ color: "#777", fontSize: 16 }}>
            Try a different search term or category.
          </Text>
        </View>
      ) : (
        filteredProducts.map(renderProductCard)
      )}

      <View style={{ paddingHorizontal: 25, marginTop: 35, marginBottom: 120 }}>
        <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>
          New Collections
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.slice(0, 2).map((item) => (
            <View
              key={item.id}
              style={{
                width: 220,
                backgroundColor: "#fff",
                borderRadius: 30,
                padding: 15,
                marginRight: 20,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  marginTop: 15,
                }}
              >
                {item.name}
              </Text>

              <Text style={{ color: "#777", marginTop: 5 }}>
                {item.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );

  const renderDetails = () => {
    const product = selectedProduct || products[0];
    const inCart = cartItems.some((item) => item.id === product.id);

    return (
      <View style={{ paddingHorizontal: 25, paddingBottom: 120 }}>
        <TouchableOpacity
          onPress={() => setScreen(screens.HOME)}
          style={{ marginTop: 30, marginBottom: 20 }}
        >
          <Text style={{ color: "#111", fontWeight: "700" }}>← Back</Text>
        </TouchableOpacity>

        <Image
          source={{ uri: product.image }}
          style={{ width: "100%", height: 320, borderRadius: 30 }}
        />

        <Text style={{ marginTop: 20, color: "#777", fontSize: 14 }}>
          {product.category}
        </Text>
        <Text style={{ fontSize: 36, fontWeight: "900", marginTop: 10 }}>
          {product.name}
        </Text>
        <Text style={{ marginTop: 15, color: "#777", fontSize: 16, lineHeight: 24 }}>
          {product.description}
        </Text>

        <View style={{ marginTop: 22, padding: 18, borderRadius: 30, backgroundColor: "#F4F1EC" }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#111" }}>
            Bank offers available
          </Text>
          {bankOffers.map((offer) => (
            <Text key={offer.label} style={{ marginTop: 10, color: "#555", fontSize: 14, lineHeight: 22 }}>
              • {offer.label}: {offer.discount}
            </Text>
          ))}
        </View>

        <View style={{ marginTop: 25, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 34, fontWeight: "800" }}>{formatINR(product.price)}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setQuantity((qty) => Math.max(1, qty - 1))}
              style={{
                width: 45,
                height: 45,
                borderRadius: 16,
                backgroundColor: "#F4F1EC",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Text style={{ fontSize: 24 }}>−</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: "800" }}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity((qty) => qty + 1)}
              style={{
                width: 45,
                height: 45,
                borderRadius: 16,
                backgroundColor: "#F4F1EC",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Text style={{ fontSize: 24 }}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 14, fontSize: 18, fontWeight: "700", color: "#111" }}>
            Total: {formatINR(product.price * quantity)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
          <TouchableOpacity
            onPress={() => {
              addToCart(product, quantity);
            }}
            style={{
              flex: 1,
              backgroundColor: "#111",
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {inCart ? "Add More" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              addToCart(product, quantity);
              setScreen(screens.CART);
            }}
            style={{
              flex: 1,
              backgroundColor: "#F4F1EC",
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "700" }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCart = () => (
    <View style={{ paddingHorizontal: 25, paddingBottom: 120 }}>
      <Text style={{ marginTop: 30, color: "#111", fontWeight: "700", marginBottom: 20, fontSize: 28 }}>
        Your Cart
      </Text>

      {cartItems.length === 0 ? (
        <View style={{ padding: 25, borderRadius: 30, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 26, fontWeight: "800", marginBottom: 10 }}>
            Cart is empty
          </Text>
          <Text style={{ color: "#777", fontSize: 16 }}>
            Add a product to start your order.
          </Text>
          <TouchableOpacity
            onPress={() => setScreen(screens.HOME)}
            style={{
              marginTop: 20,
              backgroundColor: "#111",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              Browse Products
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {cartItems.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: 30,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.name}</Text>
                <Text style={{ fontSize: 20, fontWeight: "800" }}>{formatINR(item.price)}</Text>
              </View>
              <Text style={{ color: "#777", marginTop: 8 }}>{item.description}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 16,
                      backgroundColor: "#F4F1EC",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>−</Text>
                  </TouchableOpacity>
                  <Text style={{ marginHorizontal: 15, fontSize: 18, fontWeight: "700" }}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 16,
                      backgroundColor: "#F4F1EC",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={{ color: "#EF4444", fontWeight: "700" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={{ backgroundColor: "#fff", borderRadius: 30, padding: 20, marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ color: "#777" }}>Subtotal</Text>
              <Text style={{ fontWeight: "700" }}>{formatINR(subtotal)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setScreen(screens.CHECKOUT)}
              style={{
                backgroundColor: "#111",
                paddingVertical: 18,
                borderRadius: 30,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  const renderFavorites = () => (
    <View style={{ paddingHorizontal: 25, paddingBottom: 120 }}>
      <Text style={{ marginTop: 30, color: "#111", fontWeight: "700", marginBottom: 20, fontSize: 28 }}>
        Favorites
      </Text>
      {favoriteProducts.length === 0 ? (
        <View style={{ padding: 25, borderRadius: 30, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 26, fontWeight: "800", marginBottom: 10 }}>
            No favorites yet
          </Text>
          <Text style={{ color: "#777", fontSize: 16 }}>
            Tap the heart icon on a product to save it here.
          </Text>
        </View>
      ) : (
        favoriteProducts.map(renderProductCard)
      )}
    </View>
  );

  const renderProfile = () => (
    <View style={{ paddingHorizontal: 25, paddingBottom: 120 }}>
      <Text style={{ marginTop: 30, color: "#111", fontWeight: "700", marginBottom: 20, fontSize: 28 }}>
        Profile
      </Text>
      <View style={{ backgroundColor: "#fff", borderRadius: 30, padding: 25 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Guest Shopper</Text>
        <Text style={{ color: "#777", marginTop: 10 }}>Save your favorites and checkout faster.</Text>
      </View>
    </View>
  );

  const renderCheckout = () => (
    <View style={{ paddingHorizontal: 25, paddingBottom: 120 }}>
      <Text style={{ marginTop: 30, color: "#111", fontWeight: "700", marginBottom: 20, fontSize: 28 }}>
        Checkout
      </Text>
      {cartItems.length === 0 ? (
        <View style={{ padding: 25, borderRadius: 30, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 26, fontWeight: "800", marginBottom: 10 }}>
            No items to checkout
          </Text>
          <Text style={{ color: "#777", fontSize: 16 }}>
            Add products to your cart before checking out.
          </Text>
        </View>
      ) : (
        <View style={{ backgroundColor: "#fff", borderRadius: 30, padding: 25 }}>
          {cartItems.map((item) => (
            <View key={item.id} style={{ marginBottom: 18 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.name}</Text>
              <Text style={{ color: "#777", marginTop: 6 }}>Qty: {item.quantity}</Text>
            </View>
          ))}
          <Text style={{ marginTop: 10, color: "#777" }}>Total</Text>
          <Text style={{ fontSize: 32, fontWeight: "900", marginTop: 10 }}>{formatINR(subtotal)}</Text>
          <TouchableOpacity
            onPress={() => {
              setShowPaymentModal(true);
            }}
            style={{
              marginTop: 25,
              backgroundColor: "#111",
              paddingVertical: 18,
              borderRadius: 30,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (screen) {
      case screens.CART:
        return renderCart();
      case screens.FAVORITES:
        return renderFavorites();
      case screens.DETAILS:
        return renderDetails();
      case screens.PROFILE:
        return renderProfile();
      case screens.CHECKOUT:
        return renderCheckout();
      default:
        return renderHome();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F1EC" }}>
      <ScrollView showsVerticalScrollIndicator={false}>{renderContent()}</ScrollView>
      {renderLaunchModal()}

      {/* Payment modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "800" }}>Choose payment method</Text>
            <Text style={{ marginTop: 10, color: "#777" }}>Total: {formatINR(subtotal)}</Text>

            <View style={{ marginTop: 18 }}>
              <Pressable onPress={() => {
                // Simulate cash on delivery order placement
                const order = {
                  id: `ORD-${Date.now()}`,
                  items: cartItems,
                  total: subtotal,
                  method: 'Cash on Delivery',
                  status: 'Placed',
                  createdAt: new Date().toISOString(),
                };
                clearCart();
                setShowPaymentModal(false);
                setOrderConfirmation(order);
                setScreen(screens.HOME);
              }} style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#F4F1EC", marginBottom: 12 }}>
                <Text style={{ fontWeight: "700" }}>Cash on Delivery</Text>
                <Text style={{ color: "#555", marginTop: 6 }}>Pay when the order arrives</Text>
              </Pressable>

              <Pressable onPress={() => {
                // For non-COD options we just show a message for now
                setShowPaymentModal(false);
                setOrderConfirmation({ id: null, message: 'Online payments are not enabled in this demo.' });
              }} style={{ paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E8E1D8" }}>
                <Text style={{ fontWeight: "700" }}>Pay with UPI / Card (Demo)</Text>
                <Text style={{ color: "#555", marginTop: 6 }}>Simulate an online payment flow</Text>
              </Pressable>
            </View>

            <Pressable onPress={() => setShowPaymentModal(false)} style={{ marginTop: 18, alignItems: "center" }}>
              <Text style={{ color: "#111", fontWeight: "700" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Order confirmation modal */}
      <Modal visible={!!orderConfirmation} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{ width: "100%", maxWidth: 420, backgroundColor: "#fff", borderRadius: 20, padding: 20 }}>
            {orderConfirmation && orderConfirmation.id ? (
              <>
                <Text style={{ fontSize: 22, fontWeight: "800" }}>Order Placed</Text>
                <Text style={{ marginTop: 10, color: "#555" }}>Your order {orderConfirmation.id} has been placed.</Text>
                <Text style={{ marginTop: 8, color: "#777" }}>Amount: {formatINR(orderConfirmation.total)}</Text>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 20, fontWeight: "800" }}>Notice</Text>
                <Text style={{ marginTop: 10, color: "#555" }}>{orderConfirmation && orderConfirmation.message}</Text>
              </>
            )}

            <Pressable onPress={() => setOrderConfirmation(null)} style={{ marginTop: 18, backgroundColor: "#111", paddingVertical: 14, borderRadius: 12, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "#fff",
          borderRadius: 30,
          height: 70,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
        }}
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "#fff",
          borderRadius: 30,
          height: 70,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <TouchableOpacity onPress={() => setScreen(screens.HOME)}>
          <Text style={{ fontSize: 16, fontWeight: screen === screens.HOME ? "800" : "600", color: screen === screens.HOME ? "#111" : "#777" }}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen(screens.FAVORITES)}>
          <Text style={{ fontSize: 16, fontWeight: screen === screens.FAVORITES ? "800" : "600", color: screen === screens.FAVORITES ? "#111" : "#777" }}>
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen(screens.CART)}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: screen === screens.CART ? "800" : "600", color: screen === screens.CART ? "#111" : "#777" }}>
              Cart
            </Text>
            {itemCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  backgroundColor: "#111",
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>{itemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen(screens.PROFILE)}>
          <Text style={{ fontSize: 16, fontWeight: screen === screens.PROFILE ? "800" : "600", color: screen === screens.PROFILE ? "#111" : "#777" }}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
