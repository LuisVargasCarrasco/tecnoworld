import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Box, Typography, Button, CardMedia, CircularProgress, TextField, List, ListItem, ListItemText } from "@mui/material";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
        setReviews(docSnap.data().reviews || []);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
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

  const handleBuyNow = async (product) => {
    await handleAddToCart(product);
    navigate("/cart");
  };

  const handleAddReview = async () => {
    if (!review.trim()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Por favor, inicia sesión para escribir una reseña.");
      return;
    }

    const productDocRef = doc(db, "products", productId);
    await updateDoc(productDocRef, {
      reviews: arrayUnion({
        userId: currentUser.uid,
        review,
        date: new Date().toISOString(),
      }),
    });

    setReviews((prevReviews) => [
      ...prevReviews,
      { userId: currentUser.uid, review, date: new Date().toISOString() },
    ]);
    setReview("");
  };

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
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleAddToCart(product)}
        sx={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      >
        Añadir al Carrito
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleBuyNow(product)}
        sx={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "20px" }}
      >
        Comprar Ya
      </Button>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h5" sx={{ marginBottom: "10px" }}>Reseñas</Typography>
        <List>
          {reviews.map((review, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={review.review}
                secondary={new Date(review.date).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
        <TextField
          label="Escribe una reseña"
          fullWidth
          multiline
          rows={4}
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ marginTop: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
          sx={{ marginTop: "10px" }}
        >
          Añadir Reseña
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetails;