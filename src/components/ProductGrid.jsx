import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const ProductGrid = ({ priceRange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'product');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
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
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image={product.imageURL}
                  alt={product.name}
                  sx={{
                    objectFit: "contain",
                    objectPosition: "center",
                    backgroundColor: "#e0e0e0",
                    height: "300px",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "10px" }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: "10px", color: "#ff5722" }}>
                    €{product.price}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <Button
                      component={Link}
                      to={`/product/${product.id}`}
                      variant="contained"
                      color="primary"
                    >
                      Ver Producto
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Añadir al Carrito
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductGrid;