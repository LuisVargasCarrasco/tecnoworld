import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase
import { Box, Typography, Button } from "@mui/material";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "product", productId); // Asegúrate de que el nombre de la colección sea correcto
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async (product) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Por favor, inicia sesión para agregar productos al carrito.");
      return;
    }

    const cartDocRef = doc(db, "carts", currentUser.uid);
    const cartDoc = await getDoc(cartDocRef);

    let cartItems = [];
    if (cartDoc.exists()) {
      cartItems = cartDoc.data().items;
    }

    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    await setDoc(cartDocRef, { items: cartItems });
  };

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">{product.name}</Typography>
      <Typography variant="body1">Precio: €{product.price}</Typography>
      <Typography variant="body2">{product.description}</Typography>
      <img src={product.imageURL} alt={product.name} style={{ width: "100%", maxHeight: "400px", objectFit: "contain", marginTop: "20px" }} />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddToCart(product)}
        sx={{ marginTop: "20px" }}
      >
        Afegir al Carret
      </Button>
    </Box>
  );
};

export default ProductDetails;