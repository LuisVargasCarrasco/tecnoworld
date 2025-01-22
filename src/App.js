import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import AdminDashboard from "./components/AdminDashboard";
import Authentication from "./components/Authentication";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Payment from "./components/PagamentStripe_";
import OrderHistory from "./components/OrderHistory";
import ProductGrid from "./components/ProductGrid";
import ProductDetails from "./components/ProductDetails";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserProfile from "./components/UserProfile";
import SellerProfile from "./components/SellerProfile";
import SearchResults from "./components/SearchResults";
import Recommendations from "./components/Recommendations";
import ChatBot from "./components/ChatBot";
import { Box, CssBaseline, Grid } from "@mui/material";
import { db, auth } from "./firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "product");
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const cartDocRef = doc(db, "carts", currentUser.uid);
        const cartDoc = await getDoc(cartDocRef);
        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items);
        }
      }
    };

    fetchCart();
  }, []);

  const handlePlaceOrder = () => {
    setCartItems([]);
  };

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const handleCategoryChange = (newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories);
  };

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <CssBaseline />
        <Navbar onPriceChange={handlePriceChange} onCategoryChange={handleCategoryChange} />
        <Routes>
          <Route path="/" element={
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Banner />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <ProductGrid products={products} priceRange={priceRange} selectedCategories={selectedCategories} />
                </motion.div>
              </Grid>
            </Grid>
          } />
          <Route path="/product/:productId" element={<ProductDetails onAddToCart={handleAddToCart} />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/seller-profile" element={<SellerProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
        <ChatBot /> {/* Activar ChatBot */}
        <Footer /> {/* Activar Footer */}
      </Box>
    </Router>
  );
};

export default App;