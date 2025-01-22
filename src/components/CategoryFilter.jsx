import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

const CategoryFilter = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleCategoryClick = (category) => {
    const newSelectedCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newSelectedCategory);
    onCategoryChange(newSelectedCategory ? [newSelectedCategory] : categories);
  };

  const handleShowAll = () => {
    setSelectedCategory(null);
    onCategoryChange(categories);
  };

  return (
    <Box sx={{ width: "80%", marginLeft:"20px", marginTop: "5px" }}>
      {categories.map((category) => (
        <Typography
          key={category}
          variant="body1"
          sx={{
            cursor: "pointer",
            color: selectedCategory === category ? "primary.main" : "text.primary",
            fontWeight: selectedCategory === category ? "bold" : "normal",
            marginBottom: "10px",
            '&:hover': {
              color: 'blue',
            },
          }}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Typography>
      ))}
      <Button variant="contained" color="primary" onClick={handleShowAll} sx={{ marginTop: "10px" }}>
        Mostrar todo
      </Button>
    </Box>
  );
};

export default CategoryFilter;