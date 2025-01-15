import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const ProductGrid = ({ priceRange = [0, Infinity], selectedCategories = [] }) => {
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
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid);
      const cartDoc = await getDoc(cartDocRef);
      let cartItems = [];
      if (cartDoc.exists()) {
        cartItems = cartDoc.data().items;
      }
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }
      await setDoc(cartDocRef, { items: cartItems });
    }
  };

  const filteredProducts = products.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1] &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.category))
  );

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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    image={product.imageURL || "/placeholder.jpg"} // Fallback en caso de que no haya imagen
                    alt={product.name || "Producto"}
                    sx={{
                      objectFit: "contain",
                      objectPosition: "center",
                      backgroundColor: "#e0e0e0",
                      height: "300px",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {product.name || "Producto sin nombre"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "10px" }}>
                      {product.description || "Sin descripción disponible."}
                    </Typography>
                    <Typography variant="h6" sx={{ marginTop: "10px", color: "#ff5722" }}>
                      €{product.price !== undefined ? product.price : "N/A"}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        Añadir al carrito
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductGrid;