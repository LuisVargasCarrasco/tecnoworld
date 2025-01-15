import React, { useState, useEffect } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const PriceFilter = ({ onPriceChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    const fetchPrices = async () => {
      const productsCollection = collection(db, "product");
      const productsSnapshot = await getDocs(productsCollection);
      let min = Infinity;
      let max = -Infinity;
      productsSnapshot.docs.forEach((doc) => {
        const product = doc.data();
        if (product.price < min) min = product.price;
        if (product.price > max) max = product.price;
      });
      setMinPrice(min === Infinity ? 0 : min);
      setMaxPrice(max === -Infinity ? 1000 : max);
      setPriceRange([min === Infinity ? 0 : min, max === -Infinity ? 1000 : max]);
    };

    fetchPrices();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onPriceChange(newValue);
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
      <Typography variant="h5" gutterBottom>
        Filtrar por Precio
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={minPrice}
        max={maxPrice}
        step={10}
        sx={{
          marginTop: "20px",
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
          },
          '& .MuiSlider-track': {
            height: 8,
          },
          '& .MuiSlider-rail': {
            height: 8,
          },
        }}
      />
      <Typography variant="body1">
        Rango de precio: €{priceRange[0]} - €{priceRange[1]}
      </Typography>
    </Box>
  );
};

export default PriceFilter;