import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
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
        await setDoc(doc(db, "userProfiles", user.uid), {
          email: user.email,
          displayName: "",
          photoURL: "",
          birthDate: "",
          defaultAddress: "",
        });
        setUser(user);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUser(userCredential.user);
      }
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userProfileRef = doc(db, "userProfiles", user.uid);
      const userProfileDoc = await getDoc(userProfileRef);
      if (!userProfileDoc.exists()) {
        await setDoc(userProfileRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          birthDate: "",
          defaultAddress: "",
        });
      }
      setUser(user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        {isSignUp ? "Registro" : "Iniciar Sesión"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      {isSignUp && (
        <TextField
          fullWidth
          label="Confirmar Email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          sx={{ marginBottom: "20px" }}
        />
      )}
      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: "20px" }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
        sx={{ marginBottom: "20px" }}
      >
        {isSignUp ? "Registrarse" : "Iniciar Sesión"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleGoogleSignIn}
        sx={{ marginBottom: "20px" }}
      >
        Iniciar Sesión con Google
      </Button>
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        {isSignUp ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
        <Link
          component="button"
          variant="body2"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Iniciar Sesión" : "Registrarse"}
        </Link>
      </Typography>
      {user && (
        <Typography variant="body2" sx={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/user-profile" color="inherit" underline="none">
            Ir a Perfil de Usuario
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default Authentication;