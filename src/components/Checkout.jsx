import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, Container } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = auth.currentUser;
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items);
        }
      }
    };

    fetchCartItems();
  }, [auth, db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { cartItems, shippingDetails } });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h4" sx={{ marginBottom: "20px" }} align="center">
          Checkout
        </Typography>
        {step === 1 && (
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <TextField
              label="Nombre"
              name="name"
              value={shippingDetails.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Dirección"
              name="address"
              value={shippingDetails.address}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Ciudad"
              name="city"
              value={shippingDetails.city}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Código Postal"
              name="postalCode"
              value={shippingDetails.postalCode}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleNextStep} fullWidth>
              Siguiente
            </Button>
          </Box>
        )}
        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography variant="h6" align="center">
              Total: €{calculateTotal().toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProceedToPayment}
              fullWidth
            >
              Proceder al Pago
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;