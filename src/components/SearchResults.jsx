import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsCollection = collection(db, "product");
        const q = query(productsCollection, where("name", ">=", searchQuery), where("name", "<=", searchQuery + "\uf8ff"));
        const productsSnapshot = await getDocs(q);
        const productsList = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchProducts();
    }
  }, [searchQuery]);

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      image={product.imageURL || "/placeholder.jpg"}
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
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", width: "100%", color: "#777" }}>
              No se encontraron productos.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SearchResults;