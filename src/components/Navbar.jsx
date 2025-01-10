import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Link,
  Button,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "User", currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === "seller") {
            setIsSeller(true);
          } else {
            setIsSeller(false);
          }
        } catch (error) {
          console.error("Error accediendo al documento Firestore:", error);
          setIsSeller(false);
        }
      }
    };

    auth.onAuthStateChanged(() => {
      checkAuth();
    });
  }, [auth, db]);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsSeller(false);
    navigate("/");
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#232f3e" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          <Link
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Mi Tienda
          </Link>
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "5px",
            padding: "0 10px",
            width: "40%",
          }}
        >
          <Search style={{ color: "#888" }} />
          <InputBase
            placeholder="Buscar productos"
            style={{
              marginLeft: "10px",
              flex: 1,
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {isSeller && (
            <Link
              href="/admin-dashboard"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Tauler de Venedor
            </Link>
          )}
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {user ? (
            <Button
              color="inherit"
              onClick={handleSignOut}
              style={{ fontWeight: "bold" }}
            >
              Tanca Sessió
            </Button>
          ) : (
            <Link
              href="/authentication"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Inicia Sessió
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;