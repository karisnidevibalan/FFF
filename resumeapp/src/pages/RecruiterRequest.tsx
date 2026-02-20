import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function RecruiterRequest() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to submit a request.');
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/company/request-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ companyName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request');
            }

            setSuccess(true);
            toast({
                title: "Request Submitted",
                description: "Your request for recruiter access has been sent for approval.",
            });
        } catch (err: any) {
            setError(err.message || 'An error occurred');
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message || 'Failed to submit request',
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Layout>
                <div className="container max-w-lg mx-auto py-20 px-4">
                    <Card className="border-green-200 bg-green-50 shadow-lg text-center p-6">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-green-800 mb-2">Request Submitted!</CardTitle>
                        <CardDescription className="text-green-700 text-lg mb-6">
                            Your request to represent <strong>{companyName}</strong> has been received.
                            <br />
                            An admin will review your request shortly.
                        </CardDescription>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => navigate('/dashboard')}
                        >
                            Return to Dashboard
                        </Button>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container max-w-lg mx-auto py-20 px-4">
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-transparent pl-0 -ml-2"
                    onClick={() => navigate('/dashboard')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>

                <Card className="shadow-xl border-border/50">
                    <CardHeader className="space-y-4 text-center pb-8 border-b">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Recruiter Access</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Upgrade your account to manage candidates and access B2B features.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="companyName" className="text-sm font-medium">
                                    Company Name
                                </label>
                                <Input
                                    id="companyName"
                                    placeholder="e.g. Acme Corp"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    disabled={loading}
                                    className="h-11"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Enter the legal name of the organization you handle recruitment for.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 gradient-bg text-lg font-medium"
                                disabled={loading || !companyName.trim()}
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-muted/30 p-4 text-center text-xs text-muted-foreground justify-center border-t">
                        By upgrading, you agree to our B2B Terms of Service.
                    </CardFooter>
                </Card>
            </div>
        </Layout>
    );
}
