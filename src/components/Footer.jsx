import React from "react";
import { Box, Container, Grid, Link, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#232f3e",
        color: "white",
        padding: "20px 0",
        marginTop: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              MiTienda
            </Typography>
            <Typography variant="body2">
              © 2024 MiTienda. Tots els drets reservats.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Enlaces
            </Typography>
            <Link href="/" color="inherit" underline="none">
              Inicio
            </Link>
            <br />
            <Link href="/order-history" color="inherit" underline="none">
              Historial de Pedidos
            </Link>
            <br />
            <Link href="/cart" color="inherit" underline="none">
              Carrito
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contacto
            </Typography>
            <Typography variant="body2">
              Email: contacto@mitienda.com
            </Typography>
            <Typography variant="body2">
              Teléfono: +34 123 456 789
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;