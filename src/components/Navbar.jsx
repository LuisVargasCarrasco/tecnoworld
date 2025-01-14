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
  Menu,
  MenuItem,
} from "@mui/material";
import { Search, ShoppingCart, Menu as MenuIcon } from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Autenticación y rol de usuario
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsSeller(false);

      if (currentUser) {
        const userRef = doc(db, "User", currentUser.uid);
        getDoc(userRef)
          .then((userDoc) => {
            if (userDoc.exists() && userDoc.data().role === "seller") {
              setIsSeller(true);
            }
          })
          .catch((error) => console.error("Error obteniendo datos del usuario:", error));
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  // Contador del carrito


  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsSeller(false);
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#232f3e" }}>
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo y Menú */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
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
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleNavigate("/")}>Inicio</MenuItem>
          <MenuItem onClick={() => handleNavigate("/order-history")}>
            Historial de Pedidos
          </MenuItem>
        </Menu>

        {/* Barra de búsqueda */}
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

        {/* Controles de usuario */}
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
              Panel de Vendedor
            </Link>
          )}
          {/* Ícono del carrito con contador */}
          <IconButton color="inherit" onClick={() => navigate("/cart")}>
            <Badge
              badgeContent={cartCount}
              color="error"
              showZero
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "12px",
                  minWidth: "16px",
                  height: "16px",
                },
              }}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>
          {/* Botón de sesión */}
          {user ? (
            <Button
              color="inherit"
              onClick={handleSignOut}
              style={{ fontWeight: "bold" }}
            >
              Cerrar Sesión
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
              Iniciar Sesión
            </Link>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
