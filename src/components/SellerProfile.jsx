import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Card, CardContent, Avatar } from "@mui/material";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, where, deleteDoc, writeBatch } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SellerProfile = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "sellerProfiles", user.uid));
        if (userDoc.exists()) {
          setSellerInfo(userDoc.data());
        }
      }
    };

    const fetchProducts = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, "product"), where("sellerId", "==", user.uid));
        const productsSnapshot = await getDocs(q);
        const productsList = productsSnapshot.docs.map(doc => doc.data());
        setProducts(productsList);
      }
    };

    fetchSellerInfo();
    fetchProducts();
  }, [auth, db]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/authentication");
  };

  const handleAddProduct = async () => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "product"), {
        name: productName,
        price: productPrice,
        description: productDescription,
        imageURL: imageURL,
        category: category,
        sellerId: user.uid,
      });
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setImageURL("");
      setCategory("");
      // Llamar a fetchProducts después de agregar un producto
      const q = query(collection(db, "product"), where("sellerId", "==", user.uid));
      const productsSnapshot = await getDocs(q);
      const productsList = productsSnapshot.docs.map(doc => doc.data());
      setProducts(productsList);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      // Eliminar productos del vendedor
      const q = query(collection(db, "product"), where("sellerId", "==", user.uid));
      const productsSnapshot = await getDocs(q);
      const batch = writeBatch(db);
      productsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Eliminar perfil del vendedor
      await deleteDoc(doc(db, "sellerProfiles", user.uid));

      // Eliminar usuario de la colección User
      await deleteDoc(doc(db, "User", user.uid));

      // Eliminar cuenta de autenticación
      await deleteUser(user);

      navigate("/authentication");
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Seller Profile
      </Typography>
      {sellerInfo && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardContent>
            <Avatar src={sellerInfo.profileImage} alt="Profile Image" sx={{ width: 100, height: 100, marginBottom: 2 }} />
            <Typography variant="h6">Nombre: {sellerInfo.name}</Typography>
            <Typography variant="h6">Email: {sellerInfo.email}</Typography>
            <Typography variant="h6">Telefono: {sellerInfo.phone}</Typography>
            <Typography variant="h6">Direccion:</Typography>
            <Typography variant="body1">{sellerInfo.address.street}</Typography>
            <Typography variant="body1">{sellerInfo.address.city}, {sellerInfo.address.state}, {sellerInfo.address.zipCode}, {sellerInfo.address.country}</Typography>
            <Typography variant="h6">Rol: {sellerInfo.role}</Typography>
          </CardContent>
        </Card>
      )}
      <Typography variant="h5" gutterBottom>
        Añadir un Producto
      </Typography>
      <TextField
        label="Nombre del Producto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Precio del Producto"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Descripcion del Producto"
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="URL de la Imagen del Producto"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Categoría del Producto"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddProduct}>
        Añadir Producto
      </Button>
      <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>
      <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ mt: 2 }}>
        Eliminar Cuenta
      </Button>
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Tus Productos
      </Typography>
      {products.map((product, index) => (
        <Card key={index} sx={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h6">Nombre: {product.name}</Typography>
            <Typography variant="h6">Precio: {product.price}</Typography>
            <Typography variant="h6">Descripcion: {product.description}</Typography>
            <Typography variant="h6">Categoría: {product.category}</Typography>
            <img src={product.imageURL} alt={product.name} style={{ width: "100%", height: "auto" }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SellerProfile;