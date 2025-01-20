import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";

const recommendations = [
  {
    id: 1,
    title: "Mejor Laptop para Programadores",
    content: "Recomendamos la MacBook Pro M1 para programadores debido a su rendimiento y eficiencia energética.",
  },
  {
    id: 2,
    title: "Mejor Smartphone Calidad-Precio",
    content: "El Google Pixel 6a ofrece una excelente relación calidad-precio con una cámara impresionante y actualizaciones rápidas.",
  },
  // Añade más recomendaciones aquí
];

const Recommendations = () => {
  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto", backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        Recomendaciones de Productos
      </Typography>
      {recommendations.map((rec) => (
        <Card key={rec.id} sx={{ marginBottom: "15px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>{rec.title}</Typography>
            <Typography variant="body2" color="textSecondary">{rec.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Recommendations;