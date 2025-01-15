import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Box, Typography, List, ListItem, ListItemText, IconButton, Divider, Paper, Button, CardMedia, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

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

  const updateCart = async (updatedItems) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartDocRef, { items: updatedItems });
      setCartItems(updatedItems);
    }
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateCart(updatedItems);
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedItems = cartItems
      .map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    updateCart(updatedItems);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>Carrito</Typography>
      <Paper elevation={3} sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <List>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <CardMedia
                        component="img"
                        image={item.imageURL}
                        alt={item.name}
                        sx={{ width: "100%", height: "auto", objectFit: "contain" }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Cantidad: ${item.quantity} - Precio: €${(item.price * item.quantity).toFixed(2)}`}
                        sx={{ color: "#555" }}
                      />
                    </Grid>
                    <Grid item xs={3} sx={{ textAlign: "right" }}>
                      <IconButton onClick={() => handleIncreaseQuantity(item.id)} color="primary">
                        <AddIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDecreaseQuantity(item.id)} color="secondary">
                        <RemoveIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
              Tu carrito está vacío.
            </Typography>
          )}
        </List>
        {cartItems.length > 0 && (
          <>
            <Typography variant="h6" sx={{ marginTop: "20px", textAlign: "right", color: "#333" }}>
              Precio Total: €{calculateTotalPrice()}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px", float: "right" }}
              onClick={handleCheckout}
            >
              Proceder al Pago
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Cart;