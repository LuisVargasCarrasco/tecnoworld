import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Box, Typography, CardMedia, CircularProgress } from "@mui/material";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "product", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Typography>No se encontró el producto.</Typography>;
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto", backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>{product.name}</Typography>
      <CardMedia
        component="img"
        image={product.imageURL}
        alt={product.name}
        sx={{ width: "100%", maxHeight: "400px", objectFit: "contain", marginBottom: "20px", borderRadius: 2 }}
      />
      <Typography variant="h6" sx={{ color: "#ff5722", marginBottom: "10px" }}>Precio: €{product.price}</Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px" }}>{product.description}</Typography>
    </Box>
  );
};

export default ProductDetails;