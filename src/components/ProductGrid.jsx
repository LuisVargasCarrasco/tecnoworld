import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Importa la configuración de Firestore
import { collection, getDocs } from "firebase/firestore";
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

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "product")); // Cambia "product" por el nombre exacto de tu colección
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error obteniendo los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Grid container spacing={3}>
        {products.map((product) => (
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
                >
                  Comprar ahora
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
