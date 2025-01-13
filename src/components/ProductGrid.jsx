import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig"; // Importa la configuración de Firestore y Auth
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

const ProductGrid = ({ priceRange }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'product');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

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

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.imageURL} // Usar la propiedad correcta de Firestore
                alt={product.name}
                sx={{
                  objectFit: "contain", // Cambiar a "contain" para mostrar toda la imagen
                  objectPosition: "center", // Centrar la imagen
                  backgroundColor: "#f5f5f5", // Fondo gris claro para imágenes más pequeñas
                  height: "300px", // Altura uniforme para todas las tarjetas
                }}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "10px" }}>
                  €{product.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: "10px" }}
                  onClick={() => handleAddToCart(product)}
                >
                  Afegir al Carrito
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;