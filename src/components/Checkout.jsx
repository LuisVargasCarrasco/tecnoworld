import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase

const Checkout = ({ cartItems, onPlaceOrder }) => {
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
      alert("Si us plau, completa totes les dades d'enviament.");
      return;
    }

    setPaymentProcessing(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Por favor, inicia sesión para realizar el pedido.");
        setPaymentProcessing(false);
        return;
      }

      // Guardar la orden en Firestore
      await addDoc(collection(db, "orders"), {
        ...shippingDetails,
        items: cartItems,
        total: calculateTotal(),
        date: new Date(),
        status: "Pending",
        userId: currentUser.uid,
      });

      // Vaciar el carrito
      const cartDocRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartDocRef, { items: [] });

      // Llamar a la función onPlaceOrder para actualizar el estado del carrito en el componente padre
      onPlaceOrder();

      // Redirigir a la página de éxito
      navigate("/success");
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
          {paymentProcessing ? <CircularProgress size={24} /> : "Realizar Pedido"}
        </Button>
      </Box>
    </Box>
  );
};

export default Checkout;