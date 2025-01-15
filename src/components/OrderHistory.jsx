import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Divider, List, ListItem, ListItemText } from '@mui/material';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ordersArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersArray);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto", backgroundColor: "#f5f5f5", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        Historial de Comandes
      </Typography>
      {orders.map((order) => (
        <Card key={order.id} sx={{ marginBottom: "15px", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>ID Comanda: {order.id}</Typography>
            <Typography variant="body2" color="textSecondary">
              Data: {new Date(order.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">Total: €{order.total}</Typography>
            <Typography variant="body2" color="textSecondary">Estat: {order.status}</Typography>
            <Divider sx={{ marginY: "10px" }} />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Productes:
            </Typography>
            <List dense>
              {order.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.name} - ${item.quantity} unitats`}
                    secondary={`€${item.price}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OrderHistory;