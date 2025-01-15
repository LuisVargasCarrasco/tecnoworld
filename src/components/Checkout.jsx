import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const { cartItems } = location.state;
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
  };

  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  const isShippingValid = () => {
    return (
      shippingDetails.name &&
      shippingDetails.address &&
      shippingDetails.city &&
      shippingDetails.postalCode
    );
  };

  const handlePayment = async () => {
    if (!isShippingValid()) {
      alert("Por favor, completa todos los datos de envío.");
      return;
    }

    setPaymentProcessing(true);

    try {
      // Redirigir a la página de pago con los datos de envío y los artículos del carrito
      navigate("/PagmentStripe", { state: { cartItems, shippingDetails } });
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Error al procesar el pago. Por favor, inténtalo de nuevo.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>Checkout</Typography>
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TextField
          label="Nombre"
          name="name"
          value={shippingDetails.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Dirección"
          name="address"
          value={shippingDetails.address}
          onChange={handleChange}
          required
        />
        <TextField
          label="Ciudad"
          name="city"
          value={shippingDetails.city}
          onChange={handleChange}
          required
        />
        <TextField
          label="Código Postal"
          name="postalCode"
          value={shippingDetails.postalCode}
          onChange={handleChange}
          required
        />
        <Typography variant="h6">Total: €{calculateTotal()}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayment}
          disabled={paymentProcessing}
        >
          {paymentProcessing ? <CircularProgress size={24} /> : "Proceder al Pago"}
        </Button>
      </Box>
    </Box>
  );
};

export default Checkout;