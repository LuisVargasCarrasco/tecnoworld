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

  if (loading) {
    return <Typography>Cargando filtro de precios...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Filtrar por Precio
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={minPrice}
        max={maxPrice}
        step={1}
        sx={{
          marginTop: "20px",
          color: 'secondary.main',
          '& .MuiSlider-thumb': {
            width: 24,
            height: 24,
            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: '0px 0px 0px 8px rgb(255 64 129 / 16%)',
            },
          },
          '& .MuiSlider-track': {
            height: 4,
          },
          '& .MuiSlider-rail': {
            height: 4,
            opacity: 0.5,
            backgroundColor: '#bfbfbf',
          },
        }}
      />
      <Typography variant="body1" sx={{ marginTop: 2, fontWeight: 'medium' }}>
        Rango de precio: €{priceRange[0]} - €{priceRange[1]}
      </Typography>
    </Paper>
  );
};

export default PriceFilter;