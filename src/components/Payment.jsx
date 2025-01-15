import React from "react";
import { Box, Typography } from "@mui/material";

const Payment = () => {
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4">Pago</Typography>
      <Typography variant="body1">Introduce tus datos de pago para completar la compra.</Typography>
    </Box>
  );
};

export default Payment;