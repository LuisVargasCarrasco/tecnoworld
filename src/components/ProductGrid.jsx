import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

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
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
                  <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <Button
                      component={Link}
                      to={`/product/${product.id}`}
                      variant="contained"
                      color="primary"
                    >
                      Ver Producto
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