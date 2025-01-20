import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Card, CardContent, Avatar } from "@mui/material";
import { getAuth, signOut, deleteUser } from "firebase/auth";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "userProfiles", user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
    };

    fetchUserInfo();
  }, [auth, db]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/authentication");
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      // Eliminar perfil del usuario
      await deleteDoc(doc(db, "userProfiles", user.uid));

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
        User Profile
      </Typography>
      {userInfo && (
        <Card sx={{ marginBottom: "20px" }}>
          <CardContent>
            <Avatar src={userInfo.photoURL} alt="Profile Image" sx={{ width: 100, height: 100, marginBottom: 2 }} />
            <Typography variant="h6">Nombre: {userInfo.displayName}</Typography>
            <Typography variant="h6">Email: {userInfo.email}</Typography>
            <Typography variant="h6">Fecha de Nacimiento: {userInfo.birthDate}</Typography>
            <Typography variant="h6">Dirección Predeterminada: {userInfo.defaultAddress}</Typography>
          </CardContent>
        </Card>
      )}
      <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ mt: 2 }}>
        Cerrar Sesión
      </Button>
      <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ mt: 2 }}>
        Eliminar Cuenta
      </Button>
    </Box>
  );
};

export default UserProfile;