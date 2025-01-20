import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Paper } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const PriceFilter = ({ onPriceChange }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const productsCollection = collection(db, "product");
        const productsSnapshot = await getDocs(productsCollection);
        let min = Infinity;
        let max = -Infinity;
        productsSnapshot.docs.forEach((doc) => {
          const product = doc.data();
          if (product.price && typeof product.price === 'number') {
            if (product.price < min) min = product.price;
            if (product.price > max) max = product.price;
          }
        });
        
        min = min === Infinity ? 0 : Math.floor(min);
        max = max === -Infinity ? 1000 : Math.ceil(max);
        
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]);
      } catch (error) {
        console.error("Error fetching product prices:", error);
        setMinPrice(0);
        setMaxPrice(1000);
        setPriceRange([0, 1000]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onPriceChange(newValue);
  };

  return (
    <Paper elevation={3} sx={{ padding: "20px", marginTop: "80px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
      <Typography variant="h6" gutterBottom>
        Filtrar por Precio
      </Typography>
      <Box sx={{ width: "100%", marginTop: "20px" }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={minPrice}
          max={maxPrice}
          disabled={loading}
        />
        <Typography variant="body2" color="textSecondary">
          Rango de precios: €{priceRange[0]} - €{priceRange[1]}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PriceFilter;