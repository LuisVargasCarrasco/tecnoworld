import React, { useState } from "react";
import { Box, Typography, Slider } from "@mui/material";

const PriceFilter = ({ onPriceChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onPriceChange(newValue);
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
      <Typography variant="h6" gutterBottom>
        Filtrar por Precio
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
        step={10}
        sx={{ marginTop: "20px" }}
      />
      <Typography variant="body2">
        Rango de precio: €{priceRange[0]} - €{priceRange[1]}
      </Typography>
    </Box>
  );
};

export default PriceFilter;