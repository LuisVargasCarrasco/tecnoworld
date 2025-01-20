import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import PriceFilter from "./components/PriceFilter";
import CategoryFilter from "./components/CategoryFilter";
import UserProfile from "./components/UserProfile";
import SellerProfile from "./components/SellerProfile";
import SearchResults from "./components/SearchResults";
import Recommendations from "./components/Recommendations";
import ChatBot from "./components/ChatBot";
import { Box, CssBaseline, Grid } from "@mui/material";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Success = () => <h1>Pagament completat!</h1>;
const Cancel = () => <h1>El pagament s'ha cancel·lat.</h1>;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  return (
    <Router>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <PriceFilter onPriceChange={handlePriceChange} />
                <CategoryFilter onCategoryChange={handleCategoryChange} />
              </Grid>
              <Grid item xs={9}>
                <Banner />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <ProductGrid priceRange={priceRange} selectedCategories={selectedCategories} />
                </motion.div>
              </Grid>
            </Grid>
          } />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
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
        <Footer />
        <ChatBot />
      </Box>
    </Router>
  );
};

export default App;