import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import { Box, CssBaseline, Grid } from "@mui/material";
import { db, auth } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Success = () => <h1>Pagament completat!</h1>;
const Cancel = () => <h1>El pagament s'ha cancel·lat.</h1>;

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [priceRange, setPriceRange] = useState([1, 100000]);

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

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Grid container>
                <Grid item xs={3}>
                  <PriceFilter onPriceChange={handlePriceChange} />
                </Grid>
                <Grid item xs={9}>
                  <Banner />
                  <ProductGrid priceRange={priceRange} />
                </Grid>
              </Grid>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/authentication" element={<Authentication />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;