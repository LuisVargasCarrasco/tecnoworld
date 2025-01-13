import React, { useState } from 'react';
import { Box, Typography, Slider } from '@mui/material';

const PriceFilter = ({ onPriceChange }) => {
  const [priceRange, setPriceRange] = useState([1, 10000]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onPriceChange(newValue);
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Filtrar por Precio
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={1}
        max={5000}
        sx={{ width: "80%" }}
      />
      <Typography variant="body1">
        Precio: €{priceRange[0]} - €{priceRange[1]}
      </Typography>
    </Box>
  );
};

export default PriceFilter;