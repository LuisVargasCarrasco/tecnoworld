import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
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
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Historial de Comandes
      </Typography>
      {orders.map((order) => (
        <Card key={order.id} sx={{ marginBottom: "15px" }}>
          <CardContent>
            <Typography variant="body1">ID Comanda: {order.id}</Typography>
            <Typography variant="body2">
              Data: {new Date(order.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">Total: €{order.total}</Typography>
            <Typography variant="body2">Estat: {order.status}</Typography>
            <Typography variant="body2" sx={{ marginTop: "10px" }}>
              Productes:
            </Typography>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} unitats - €{item.price}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OrderHistory;