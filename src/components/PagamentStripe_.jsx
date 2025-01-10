import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QfQpxLBN9lGC0Ys8wMm8gYfOaHLIVoSEViR61tr3qdaz7i8OMAJYM7QdLZU8Crj25Uu7HRJmNdGTp2M8gSP5JAb00FTgx1511');

const Payment = ({ cartItems }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    success_url: `${window.location.origin}/success`,
                    cancel_url: `${window.location.origin}/cancel`,
                }),
            });

            const { sessionId } = await response.json();

            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId });
        } catch (error) {
            console.error('Error durant el procés de pagament:', error);
            alert('No s\'ha pogut completar el pagament.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handlePayment} disabled={loading}>
                {loading ? 'Processant...' : 'Pagar ara'}
            </button>
        </div>
    );
};

export default Payment;
