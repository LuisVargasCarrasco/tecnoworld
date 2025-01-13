import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Asegúrate de tener la configuración de Firebase
import { Box, Typography } from "@mui/material";

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

  if (!product) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">{product.name}</Typography>
      <Typography variant="body1">Precio: €{product.price}</Typography>
      <Typography variant="body2">{product.description}</Typography>
      <img src={product.imageURL} alt={product.name} style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }} />
    </Box>
  );
};

export default ProductDetails;