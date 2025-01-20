import React, { useEffect, useState } from "react";
import { Box, Typography, FormControl, FormControlLabel, Checkbox, Paper } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

const CategoryFilter = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const productsCollection = collection(db, 'product');
      const productsSnapshot = await getDocs(productsCollection);
      const categoriesSet = new Set();
      productsSnapshot.docs.forEach(doc => {
        const product = doc.data();
        if (product.category) {
          categoriesSet.add(product.category);
        }
      });
      setCategories(Array.from(categoriesSet));
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    const newSelectedCategories = event.target.checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(newSelectedCategories);
    onCategoryChange(newSelectedCategories);
  };

  return (
    <Paper elevation={3} sx={{ padding: "20px", marginTop: "20px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
      <Typography variant="h6" gutterBottom>
        Categorias
      </Typography>
      <FormControl component="fieldset">
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                name={category}
              />
            }
            label={category}
          />
        ))}
      </FormControl>
    </Paper>
  );
};

export default CategoryFilter;