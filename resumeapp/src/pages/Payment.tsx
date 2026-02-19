import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Smartphone, ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Payment = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Get Key ID
            const keyResponse = await fetch(`${API_BASE_URL}/payment/key`);
            const { key } = await keyResponse.json();

            // Create Order
            const orderResponse = await fetch(`${API_BASE_URL}/payment/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 499 }),
            });
            const order = await orderResponse.json();

            const options = {
                key: key,
                amount: order.amount,
                currency: "INR",
                name: "Resume App Premium",
                description: "Unlock Advanced Features",
                image: "/logo.png", // Ensure you have a logo or remove this
                order_id: order.id,
                handler: async function (response: any) {
                    // Verify Payment
                    try {
                        const userStr = localStorage.getItem('user');
                        const user = userStr ? JSON.parse(userStr) : {};
                        const userId = user._id || user.id;

                        const verifyResponse = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                userId: userId,
                            }),
                        });

                        const verifyResult = await verifyResponse.json();

                        if (verifyResult.success) {
                            setIsProcessing(false);
                            setPaymentSuccess(true);
                            localStorage.setItem('isPremium', 'true');
                            toast.success('Payment successful! Premium features unlocked.');
                            setTimeout(() => {
                                navigate('/ats-checker');
                            }, 2000);
                        } else {
                            toast.error('Payment verification failed.');
                            setIsProcessing(false);
                        }
                    } catch (error) {
                        console.error('Verification Error:', error);
                        toast.error('Payment verification error.');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "john@example.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

            rzp1.on('payment.failed', function (response: any) {
                toast.error(response.error.description);
                setIsProcessing(false);
            });

        } catch (error) {
            console.error('Payment Error:', error);
            toast.error('Failed to initiate payment.');
            setIsProcessing(false);
        }
    };

    if (paymentSuccess) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-lg"
                    >
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Payment Successful!</h2>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. You now have access to all premium features.
                        </p>
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Redirecting you back to ATS Checker...
                        </p>
                    </motion.div>
                </div>
            </Layout>
        );
    }

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
                                    <span>Secure 256-bit SSL Encrypted Payment</span>
                                </div>
                            </CardFooter>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <h3 className="font-semibold mb-2">Instant Activation</h3>
                                <p className="text-xs text-muted-foreground">Access your premium features immediately after payment.</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <h3 className="font-semibold mb-2">Money Back Guarantee</h3>
                                <p className="text-xs text-muted-foreground">14-day refund policy if you're not satisfied.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                                <CardDescription>Choose your preferred payment method</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-8">
                                        <TabsTrigger value="card" className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" /> Card/UPI
                                        </TabsTrigger>
                                        <TabsTrigger value="upi" className="flex items-center gap-2" disabled>
                                            <Smartphone className="w-4 h-4" /> NetBanking
                                        </TabsTrigger>
                                    </TabsList>

                                    <form onSubmit={handlePayment}>
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                                Clicking "Pay Now" will open the secure Razorpay payment gateway where you can choose <strong>Card, UPI (Google Pay, PhonePe, etc.)</strong>, or NetBanking.
                                            </div>
                                        </div>

                                        <Button className="w-full mt-6 gradient-bg" size="lg" disabled={isProcessing}>
                                            {isProcessing ? 'Processing...' : 'Pay ₹499.00 via Razorpay'}
                                        </Button>
                                    </form>
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
