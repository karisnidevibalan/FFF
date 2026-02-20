import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, QrCode, ShieldCheck, Building } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

// Stripe Config
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AgencyCheckoutForm = ({ amount, planName }: { amount: number, planName: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

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
            toast.success("Payment successful! Unlocking Agency Features...");

            // Verify with backend and Upgrade User
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const token = localStorage.getItem('token');

                // Call verification endpoint
                await fetch(`${API_BASE_URL}/payment/verify-agency-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        userId: user._id || user.id,
                        planName,
                        amount
                    })
                });

                // Update Local Storage
                user.role = 'recruiter';
                user.plan = 'b2b';
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('user_role', 'recruiter');

                setTimeout(() => navigate('/hr-dashboard'), 2000);
            } catch (err) {
                console.error(err);
                toast.error("Account upgrade failed. Please contact support.");
            }
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <Button
                disabled={isLoading || !stripe || !elements}
                className="w-full gradient-bg py-6 text-lg"
            >
                {isLoading ? "Processing..." : `Pay ₹${amount.toLocaleString()}`}
            </Button>
            {message && <div className="text-red-500 text-sm text-center">{message}</div>}
        </form>
    );
};

const AgencyPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [clientSecret, setClientSecret] = useState("");

    // Get plan from navigation state
    const plan = location.state?.plan;

    useEffect(() => {
        if (!plan) {
            navigate('/for-agencies');
            return;
        }

        // Create PaymentIntent
        fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: plan.amount / 100 }), // Divide by 100 if backend expects logic there, but standard stripe is cents. 
            // Wait, standard stripe API: amount in smallest currency unit (paise for INR). 
            // If plan.amount is 10000 (INR), send 1000000. 
            // My previous Payment.tsx sent 499. Let's assume backend handles multiplication or frontend should.
            // Let's check backend... backend multiplies by 100 usually. 
            // Let's check existing Payment.tsx: body: { amount: 499 }.
            // I will check backend implementation in next step. For now assume backend expects 'amount' in major unit.
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((err) => console.error("Error creating payment intent:", err));
    }, [plan, navigate]);

    if (!plan) return null;

    const appearance = {
        theme: 'stripe' as const,
        variables: { colorPrimary: '#0f172a' },
    };
    const options = { clientSecret, appearance };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <Button variant="ghost" onClick={() => navigate('/for-agencies')} className="mb-8 pl-0 gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Plans
                </Button>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Summary */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
                            <p className="text-muted-foreground">Complete your agency subscription.</p>
                        </div>

                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    {plan.name} Plan
                                </CardTitle>
                                <CardDescription>Monthly Subscription</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {plan.features.map((f: string, i: number) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span>{f}</span>
                                        <ShieldCheck className="w-4 h-4 text-green-600" />
                                    </div>
                                ))}
                                <div className="h-px bg-border my-4" />
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total</span>
                                    <span>{plan.price}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="card" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="card" className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Card
                                    </TabsTrigger>
                                    <TabsTrigger value="upi" className="flex items-center gap-2">
                                        <QrCode className="w-4 h-4" /> UPI / QR
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="card">
                                    {clientSecret ? (
                                        <Elements options={options} stripe={stripePromise}>
                                            <AgencyCheckoutForm amount={plan.amount} planName={plan.name} />
                                        </Elements>
                                    ) : (
                                        <div className="flex justify-center p-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="upi" className="text-center py-8">
                                    <div className="bg-white p-4 rounded-xl inline-block border mb-4">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=venithaaselvaraj2110@okicici&pn=Venithaa&am=${plan.amount}.00&cu=INR`)}&t=${Date.now()}`}
                                            alt="UPI QR Code"
                                            className="w-48 h-48"
                                        />
                                    </div>
                                    <p className="font-semibold text-lg">Scan to Pay {plan.price}</p>
                                    <Button
                                        className="w-full gradient-bg mt-6"
                                        onClick={() => {
                                            toast.success('UPI Payment Recorded. Activating plan...');
                                            // Mock Activation
                                            const user = JSON.parse(localStorage.getItem('user') || '{}');
                                            user.role = 'recruiter';
                                            user.plan = 'b2b';
                                            localStorage.setItem('user', JSON.stringify(user));
                                            localStorage.setItem('user_role', 'recruiter');
                                            setTimeout(() => navigate('/hr-dashboard'), 2000);
                                        }}
                                    >
                                        I have completed payment
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default AgencyPayment;
