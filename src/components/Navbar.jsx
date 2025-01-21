import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Badge,
  Link,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from "@mui/material";
import { Search as SearchIcon, ShoppingCart as ShoppingCartIcon, Menu as MenuIcon, AccountCircle } from "@mui/icons-material";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isSeller, setIsSeller] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  // Autenticación y rol de usuario
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsSeller(false);

      if (currentUser) {
        const userRef = doc(db, "User", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "seller") {
            setIsSeller(true);
            const sellerProfileRef = doc(db, "sellerProfiles", currentUser.uid);
            const sellerProfileDoc = await getDoc(sellerProfileRef);
            if (sellerProfileDoc.exists()) {
              const sellerProfileData = sellerProfileDoc.data();
              setUser({ ...currentUser, ...userData, ...sellerProfileData });
            }
          } else {
            setUser({ ...currentUser, ...userData });
          }
        }
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  // Contador del carrito
  useEffect(() => {
    if (user) {
      const cartRef = doc(db, "carts", user.uid);
      const unsubscribeCart = onSnapshot(cartRef, (doc) => {
        if (doc.exists()) {
          const items = doc.data().items;
          const count = items.reduce((total, item) => total + item.quantity, 0);
          setCartCount(count);
        }
      });

      return () => unsubscribeCart();
    }
  }, [user, db]);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setIsSeller(false);
    navigate("/authentication");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
    handleUserMenuClose();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${searchQuery}`);
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#232f3e" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo y Menú */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1 }}>
            <Link
              href="/"
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Tecnoworld
            </Link>
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleNavigate("/")}>Inicio</MenuItem>
          <MenuItem onClick={() => handleNavigate("/recommendations")}>Recomendaciones</MenuItem>
        </Menu>

        {/* Barra de búsqueda */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "5px",
            padding: "0 10px",
            width: "40%",
          }}
        >
          <SearchIcon sx={{ color: "#888" }} />
          <InputBase
            placeholder="Buscar productos"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              ml: 1,
              flex: 1,
              fontSize: "14px",
            }}
          />
        </Box>

        {/* Controles de usuario */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isSeller && (
            <Link
              href="/admin-dashboard"
              sx={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              
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
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {/* Menú de usuario */}
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="user-menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            {user && user.photoURL ? (
              <Avatar src={user.photoURL} alt="profile picture" />
            ) : user && user.profileImage ? (
              <Avatar src={user.profileImage} alt="profile picture" />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="user-menu-appbar"
            anchorEl={userMenuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
          >
            {user ? (
              <>
                <MenuItem onClick={() => handleNavigate(isSeller ? "/seller-profile" : "/user-profile")}>Perfil</MenuItem>
                <MenuItem onClick={() => handleNavigate("/order-history")}>Historial de Pedidos</MenuItem>
                <MenuItem onClick={handleSignOut}>Cerrar sesión</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => handleNavigate("/authentication")}>Iniciar sesión</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;