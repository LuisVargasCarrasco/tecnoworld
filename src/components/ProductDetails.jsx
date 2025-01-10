import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig"; // Importa la configuración de Firestore
import { doc, getDoc } from "firebase/firestore";

const ProductDetails = () => {
  const { id } = useParams(); // Obtener el ID del producto desde la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "product", id); // Cambia "product" por el nombre exacto de tu colección en Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data());
        } else {
          console.log("No se encontró el producto.");
        }
      } catch (error) {
        console.error("Error obteniendo los datos del producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
        <Typography variant="h6">Cargando información del producto...</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">No se encontró el producto.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Grid container spacing={4}>
        {/* Imagen del producto */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              image={product.imageURL} // Usar la propiedad correcta de Firestore
              alt={product.name}
              sx={{ height: "400px", objectFit: "contain" }}
            />
          </Card>
        </Grid>

        {/* Información del producto */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Precio: €{product.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            <Box sx={{ marginTop: "20px", display: "flex", gap: "15px" }}>
              <Button variant="contained" color="primary">
                Añadir al carrito
              </Button>
              <Button variant="outlined" color="secondary">
                Comprar ahora
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;