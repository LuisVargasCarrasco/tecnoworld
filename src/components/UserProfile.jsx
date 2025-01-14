import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const UserProfile = () => {
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userProfileRef = doc(db, "userProfiles", user.uid);
        const userProfileDoc = await getDoc(userProfileRef);
        if (userProfileDoc.exists()) {
          const data = userProfileDoc.data();
          setDisplayName(data.displayName || "");
          setPhotoURL(data.photoURL || "");
          setBirthDate(data.birthDate || "");
          setDefaultAddress(data.defaultAddress || "");
          setEmail(data.email || user.email);
        }
      }
    };

    fetchUserProfile();
  }, [user, db]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const userProfileRef = doc(db, "userProfiles", user.uid);
      await setDoc(userProfileRef, {
        displayName,
        photoURL,
        birthDate,
        defaultAddress,
        email,
      });
      setSuccess("Perfil actualizado con éxito");
    } catch (error) {
      setError("Error actualizando el perfil: " + error.message);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Perfil de Usuario
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre de Usuario"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fecha de Nacimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dirección Predeterminada"
            value={defaultAddress}
            onChange={(e) => setDefaultAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="URL de la Foto de Perfil"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Avatar src={photoURL} sx={{ width: 100, height: 100, margin: "auto" }} />
        </Grid>
      </Grid>
      {error && <Typography color="error" sx={{ marginTop: "20px" }}>{error}</Typography>}
      {success && <Typography color="success" sx={{ marginTop: "20px" }}>{success}</Typography>}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px" }}
        onClick={handleSave}
      >
        Guardar Cambios
      </Button>
    </Box>
  );
};

export default UserProfile;