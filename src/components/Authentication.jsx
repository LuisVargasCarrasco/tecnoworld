import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container,
  Paper,
} from "@mui/material";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Campos adicionales para vendedores
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Campos adicionales para usuarios
  const [birthDate, setBirthDate] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    if (isSignUp && email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userProfile = {
          email: user.email,
          role: isSeller ? "seller" : "user",
        };
        if (isSeller) {
          userProfile.name = name;
          userProfile.phone = phone;
          userProfile.address = {
            street,
            city,
            state,
            zipCode,
            country,
          };
          userProfile.profileImage = profileImage;
          await setDoc(doc(db, "sellerProfiles", user.uid), userProfile);
        } else {
          userProfile.birthDate = birthDate;
          userProfile.defaultAddress = defaultAddress;
          userProfile.displayName = name;
          userProfile.photoURL = photoURL;
          await setDoc(doc(db, "userProfiles", user.uid), userProfile);
        }
        await setDoc(doc(db, "User", user.uid), {
          email: user.email,
          role: isSeller ? "seller" : "user",
        });
        setUser(user);
        navigate(isSeller ? "/seller-profile" : "/user-profile");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "User", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(user);
          navigate(userData.role === "seller" ? "/seller-profile" : "/user-profile");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(db, "User", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "User", user.uid), {
          email: user.email,
          role: "user",
        });
      }
      const userData = userDoc.data();
      setUser(user);
      navigate(userData.role === "seller" ? "/seller-profile" : "/user-profile");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{marginBottom: 8, marginTop: 8 }}>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        {isSignUp && (
          <TextField
            label="Confirm Email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        {isSignUp && (
          <Box>
            <Typography variant="body1">Eres vendedor?</Typography>
            <Button
              variant={isSeller ? "contained" : "outlined"}
              onClick={() => setIsSeller(!isSeller)}
              fullWidth
              sx={{ marginBottom: 2 }}
            >
              {isSeller ? "Si" : "No"}
            </Button>
            {isSeller ? (
              <Box>
                <TextField
                  label="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Telefono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Dirección"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Provincia"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Codigo Postal"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Pais"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="URL Foto de perfil"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
            ) : (
              <Box>
                <TextField
                  label="Fecha de Nacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Dirección por defecto"
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="URL de foto de perfil"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>
            )}
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
          {isSignUp ? "Inicia sesion" : "Registrate"}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleGoogleSignIn} fullWidth sx={{ mt: 2 }}>
          Inicia sesion con Google
        </Button>
        <Link
          component="button"
          variant="body2"
          onClick={() => setIsSignUp(!isSignUp)}
          sx={{ display: "block", textAlign: "center", mt: 2 }}
        >
          {isSignUp ? "Ya tienes una cuenta? Inicia sesion" : "No tienes una cuenta? Registrate"}
        </Link>
      </Paper>
    </Container>
  );
};

export default Authentication;