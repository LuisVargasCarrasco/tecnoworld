import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Typography, List, ListItem, ListItemText, Button, CircularProgress, CardMedia, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const stripePromise = loadStripe('pk_test_51QfQpxLBN9lGC0Ys8wMm8gYfOaHLIVoSEViR61tr3qdaz7i8OMAJYM7QdLZU8Crj25Uu7HRJmNdGTp2M8gSP5JAb00FTgx1511');

const PaymentForm = ({ cartItems, shippingDetails, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("Por favor, inicia sesión para realizar el pedido.");
                setLoading(false);
                return;
            }

            // Guardar la orden en Firestore
            await addDoc(collection(db, "orders"), {
                userId: currentUser.uid,
                items: cartItems,
                shippingDetails,
                total: calculateTotal(),
                date: new Date(),
                status: "Pending",
            });

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: {
                    name: shippingDetails.name,
                },
            });

            if (error) {
                console.error('Error al crear el método de pago:', error);
                alert('Error al crear el método de pago. Por favor, inténtalo de nuevo.');
                setLoading(false);
                return;
            }

            // Simulación de pago exitoso
            onPaymentSuccess();

        } catch (error) {
            console.error('Error durant el procés de pagament:', error);
            alert('No s\'ha pogut completar el pagament.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>Resumen del Pedido</Typography>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id}>
                        <ListItemText
                            primary={item.name}
                            secondary={`Cantidad: ${item.quantity} - Precio: €${(item.price * item.quantity).toFixed(2)}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
                Precio Total: €{calculateTotal()}
            </Typography>
            <Typography variant="h6" sx={{ marginTop: "20px" }}>
                Envío a: {shippingDetails.name}, {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.postalCode}
            </Typography>
            <form onSubmit={handlePayment} style={{ marginTop: "20px" }}>
                <CardElement />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || !stripe || !elements}
                    sx={{ marginTop: "20px" }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Pagar ahora'}
                </Button>
            </form>
        </Box>
    );
};

const Confirmation = ({ cartItems, shippingDetails }) => {
    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    };

    const getRandomDeliveryDate = () => {
        const today = new Date();
        const randomDays = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + randomDays);
        return deliveryDate.toLocaleDateString();
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" sx={{ marginBottom: "20px" }}>Confirmación del Pedido</Typography>
            <Paper elevation={3} sx={{ padding: "20px" }}>
                <List>
                    {cartItems.map((item) => (
                        <ListItem key={item.id} sx={{ display: "flex", alignItems: "center" }}>
                            <CardMedia
                                component="img"
                                image={item.imageURL}
                                alt={item.name}
                                sx={{ width: 100, height: 100, objectFit: "contain", marginRight: "20px" }}
                            />
                            <ListItemText
                                primary={item.name}
                                secondary={`Cantidad: ${item.quantity} - Precio: €${(item.price * item.quantity).toFixed(2)}`}
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    Precio Total: €{calculateTotal()}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    Envío a: {shippingDetails.name}, {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.postalCode}
                </Typography>
                <Typography variant="h6" sx={{ marginTop: "20px" }}>
                    Fecha estimada de entrega: {getRandomDeliveryDate()}
                </Typography>
            </Paper>
        </Box>
    );
};

const Payment = () => {
    const location = useLocation();
    const { cartItems, shippingDetails } = location.state;
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
    };

    return (
        <Elements stripe={stripePromise}>
            {paymentSuccess ? (
                <Confirmation cartItems={cartItems} shippingDetails={shippingDetails} />
            ) : (
                <PaymentForm cartItems={cartItems} shippingDetails={shippingDetails} onPaymentSuccess={handlePaymentSuccess} />
            )}
        </Elements>
    );
};

export default Payment;