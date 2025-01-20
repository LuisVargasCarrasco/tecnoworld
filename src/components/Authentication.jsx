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

  // Campos adicionales para vendedores
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState("");

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
        }
        await setDoc(doc(db, "userProfiles", user.uid), userProfile);
        setUser(user);
        navigate(isSeller ? "/seller-profile" : "/user-profile");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "userProfiles", user.uid));
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
      const userDoc = await getDoc(doc(db, "userProfiles", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "userProfiles", user.uid), {
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
    <Box>
      <Typography variant="h4" gutterBottom>
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
          <Typography variant="body1">Are you a seller?</Typography>
          <Button
            variant={isSeller ? "contained" : "outlined"}
            onClick={() => setIsSeller(!isSeller)}
          >
            {isSeller ? "Yes" : "No"}
          </Button>
          {isSeller && (
            <Box>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Profile Image URL"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Box>
          )}
        </Box>
      )}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {isSignUp ? "Sign Up" : "Sign In"}
      </Button>
      <Button variant="contained" color="secondary" onClick={handleGoogleSignIn}>
        Sign In with Google
      </Button>
      <Link
        component="button"
        variant="body2"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </Link>
    </Box>
  );
};

export default Authentication;