import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Typography, List, ListItem, ListItemText, Button, CircularProgress, CardMedia, Paper, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

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
            console.error('Error durante el proceso de pago:', error);
            alert('No se ha podido completar el pago.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <Grid container spacing={4} sx={{ padding: "20px", marginTop: "80px" }}>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: "20px" }}>
                    <Typography variant="h5" sx={{ marginBottom: "20px" }}>Información de Pago</Typography>
                    <form onSubmit={handlePayment}>
                        <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !stripe || !elements}
                            sx={{ marginTop: "20px" }}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Pagar ahora'}
                        </Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: "20px" }}>
                    <Typography variant="h5" sx={{ marginBottom: "20px" }}>Resumen del Pedido</Typography>
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
                </Paper>
            </Grid>
        </Grid>
    );
};

const Confirmation = ({ cartItems, shippingDetails }) => {
    const navigate = useNavigate();

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

    const handleReturnHome = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            // Vaciar el carrito
            const cartRef = doc(db, "carts", currentUser.uid);
            await updateDoc(cartRef, {
                items: []
            });
        }
        navigate("/");
    };

    return (
        <Box sx={{ padding: "20px", marginTop: "80px" }}>
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
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "20px" }}
                    onClick={handleReturnHome}
                >
                    Volver al inicio
                </Button>
            </Paper>
        </Box>
    );
};

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, shippingDetails } = location.state || {};

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    if (!cartItems || !shippingDetails) {
        navigate("/cart");
        return null;
    }

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