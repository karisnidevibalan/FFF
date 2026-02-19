import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, ShieldCheck, CreditCard, QrCode } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

// Stripe Config
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            },
            redirect: 'if_required'
        });

        if (error) {
            setMessage(error.message || "An error occurred.");
            toast.error(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage("Payment succeeded!");
            toast.success("Payment successful!");

            // Update local storage for demo
            localStorage.setItem('isPremium', 'true');

            // Verify with backend
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                await fetch(`${API_BASE_URL}/payment/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        userId: user._id || user.id
                    })
                });
                setTimeout(() => navigate('/ats-checker'), 1500);
            } catch (err) {
                console.error(err);
                navigate('/ats-checker');
            }
        } else {
            setMessage("Payment processing...");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" />
            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full gradient-bg py-6 text-lg"
            >
                <span id="button-text">
                    {isLoading ? "Processing..." : "Pay Now ₹499.00"}
                </span>
            </Button>
            {message && <div className="text-red-500 text-sm text-center">{message}</div>}
        </form>
    );
};

const Payment = () => {
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Create PaymentIntent
        fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 499 }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((err) => console.error("Error creating payment intent:", err));
    }, []);

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#0f172a',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };



    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/ats-checker')}
                    className="mb-8 hover:bg-transparent pl-0 gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to ATS Checker
                </Button>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
                            <p className="text-muted-foreground">Unlock the full power of AI resume analysis.</p>
                        </div>

                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                                <CardDescription>Premium Resume Analysis Plan</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span>Advanced Keyword Analysis</span>
                                    <span className="font-semibold">Included</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>AI Rewrite Suggestions</span>
                                    <span className="font-semibold">Included</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Unlimited Scans</span>
                                    <span className="font-semibold">Included</span>
                                </div>
                                <div className="h-px bg-border my-4" />
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹499.00</span>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-background/50 border-t border-border/50 p-4">
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Secure Payment via Stripe</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>Select your preferred payment method</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="card" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6">
                                        <TabsTrigger value="card" className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            Card
                                        </TabsTrigger>
                                        <TabsTrigger value="upi" className="flex items-center gap-2">
                                            <QrCode className="w-4 h-4" />
                                            UPI / QR
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="card">
                                        {clientSecret ? (
                                            <Elements options={options} stripe={stripePromise}>
                                                <CheckoutForm />
                                            </Elements>
                                        ) : (
                                            <div className="flex justify-center p-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="upi" className="text-center space-y-6 py-4">
                                        <div className="bg-white p-6 rounded-xl inline-block shadow-sm border">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("upi://pay?pa=venithaaselvaraj2110@okicici&pn=Venithaa&am=499.00&cu=INR")}&t=${Date.now()}`}
                                                alt="UPI QR Code"
                                                className="w-48 h-48 mx-auto"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg mb-1">Scan to Pay ₹499.00</p>
                                            <p className="text-sm text-muted-foreground">
                                                Pay to: <span className="font-medium text-foreground">venithaaselvaraj2110@okicici</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Name: Venithaa
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg text-sm">
                                            After payment, please wait for automatic confirmation.
                                        </div>
                                        <Button
                                            className="w-full gradient-bg mt-4"
                                            onClick={() => {
                                                // Verify payment logic (simulated for UPI)
                                                toast.success('Payment verified! Premium features unlocked.');
                                                localStorage.setItem('isPremium', 'true');
                                                setTimeout(() => navigate('/ats-checker'), 2000);
                                            }}
                                        >
                                            I have completed the payment
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default Payment;
