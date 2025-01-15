import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const { products } = location.state || { products: [] };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Resultados de la búsqueda
      </Typography>
      {products.length > 0 ? (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.imageURL}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: "10px" }}>
                    €{product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6">No se encontraron productos.</Typography>
      )}
    </Box>
  );
};

export default SearchResults;