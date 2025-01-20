import React from 'react';
import Slider from 'react-slick';
import { Box, Typography } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false, // Desactivar los botones de navegación
  };

  const banners = [
    { id: 1, image: "/banner1.jpg", text: "" },
    { id: 2, image: "/banner2.jpg", text: "" },
  ];

  return (
    <Slider {...settings}>
      {banners.map((banner) => (
        <Box
          key={banner.id}
          sx={{
            marginTop: "6vh",
            position: "relative",
            width: "100%",
            height: "500px",
            backgroundImage: `url(${banner.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {banner.text}
          </Typography>
        </Box>
      ))}
    </Slider>
  );
};

export default Banner;