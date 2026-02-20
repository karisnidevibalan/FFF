import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Building2, Users, BarChart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
    {
        name: 'Starter',
        price: '₹10,000',
        amount: 10000,
        features: [
            '50 Resume Analyzes / mo',
            'Basic Candidate Ranking',
            'Email Support',
            '1 Recruiter Seat'
        ],
        popular: false
    },
    {
        name: 'Growth',
        price: '₹15,000',
        amount: 15000,
        features: [
            '100 Resume Analyzes / mo',
            'Advanced AI Matching',
            'Priority Support',
            '3 Recruiter Seats',
            'Bulk Upload (ZIP)'
        ],
        popular: true
    },
    {
        name: 'Enterprise',
        price: '₹50,000',
        amount: 50000,
        features: [
            'Unlimited Analyzes',
            'Custom AI Models',
            'Dedicated Account Manager',
            'Unlimited Seats',
            'API Access'
        ],
        popular: false
    }
];

export default function AgencyLanding() {
    const navigate = useNavigate();

    const handleSelectPlan = (plan: any) => {
        // Navigate to payment with plan details
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login?redirect=/agency-payment&plan=' + encodeURIComponent(JSON.stringify(plan)));
        } else {
            navigate('/agency-payment', { state: { plan } });
        }
    };

    return (
        <Layout>
            <div className="relative overflow-hidden bg-background">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="container px-4 mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            <h1 className="text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                Supercharge Your Recruitment
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                                AI-powered resume screening, bulk analysis, and instant candidate ranking.
                                Save 90% of your screening time.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button size="lg" className="rounded-full px-8 h-12 text-lg gradient-bg" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                                    View Plans
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-lg">
                                    Contact Sales
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Why Top Agencies Choose Us</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Zap, title: "Instant Analysis", desc: "Process hundreds of resumes in seconds." },
                                { icon: BarChart, title: "Smart Ranking", desc: "AI ranks candidates by job description match." },
                                { icon: Users, title: "Team Collaboration", desc: "Share shortlists with your team seamlessly." },
                                { icon: Building2, title: "White Label", desc: "Custom branding for your client reports." }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="h-full border-none shadow-md hover:shadow-xl transition-all">
                                        <CardHeader>
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                <feature.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <CardTitle>{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base">{feature.desc}</CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24">
                    <div className="container px-4 mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-muted-foreground">Choose the plan that fits your agency's scale.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative"
                                >
                                    <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-2xl scale-105 z-10' : 'shadow-lg'}`}>
                                        {plan.popular && (
                                            <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-xs font-bold text-center py-1 uppercase tracking-wide rounded-t-lg">
                                                Most Popular
                                            </div>
                                        )}
                                        <CardHeader className={plan.popular ? 'pt-8' : ''}>
                                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                            <div className="mt-4">
                                                <span className="text-4xl font-bold">{plan.price}</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                className={`w-full h-12 text-lg ${plan.popular ? 'gradient-bg' : ''}`}
                                                variant={plan.popular ? 'default' : 'outline'}
                                                onClick={() => handleSelectPlan(plan)}
                                            >
                                                Choose {plan.name}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
