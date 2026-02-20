import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from '@/components/layout/Layout';
import {
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Download,
    CheckCircle,
    XCircle,
    Clock,
    Upload,
    Lock
} from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export default function AgencyDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("candidates");

    // Mock Data for Agency Dashboard
    const stats = [
        { label: "Total Candidates", value: "1,248", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "Active Jobs", value: "24", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Resumes Analyzed", value: "856", icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
        { label: "Placement Rate", value: "18%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    ];

    const candidates = [
        { id: 1, name: "Jessica Smith", role: "Senior Frontend Developer", email: "jessica.s@example.com", score: 92, status: "Evaluated", date: "2024-02-19" },
        { id: 2, name: "Michael Chen", role: "DevOps Engineer", email: "m.chen@example.com", score: 88, status: "Interview", date: "2024-02-18" },
        { id: 3, name: "Sarah Johnson", role: "Product Manager", email: "sarah.j@example.com", score: 75, status: "Pending", date: "2024-02-18" },
        { id: 4, name: "David Kim", role: "Full Stack Developer", email: "d.kim@example.com", score: 64, status: "Rejected", date: "2024-02-17" },
        { id: 5, name: "Emily Davis", role: "UX Designer", email: "emily.d@example.com", score: 95, status: "Hired", date: "2024-02-15" },
    ];

    const jobs = [
        { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Remote", candidates: 45, status: "Active" },
        { id: 2, title: "Product Manager", department: "Product", location: "New York, NY", candidates: 12, status: "Active" },
        { id: 3, title: "DevOps Engineer", department: "Engineering", location: "San Francisco, CA", candidates: 8, status: "Closing Soon" },
    ];

    const user = authService.getCurrentUser();
    // In a real app, we'd check for a specific 'agency' plan. 
    // For now, we reuse the premium flag or assume non-premium users need to pay.
    const isSubscribed = user?.isPremium;

    if (!isSubscribed) {
        return (
            <Layout>
                <div className="min-h-screen pt-24 pb-12 bg-gray-50/50 dark:bg-background flex items-center justify-center">
                    <Card className="max-w-md w-full mx-4 shadow-xl border-blue-100 dark:border-blue-900">
                        <CardHeader className="text-center pb-2">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                <Lock className="w-8 h-8" />
                            </div>
                            <CardTitle className="text-2xl">Agency Access Required</CardTitle>
                            <CardDescription>
                                Subscribe to our Agency Plan to unlock bulk resume operations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Bulk Resume Upload & Parsing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Advanced JD Matching & Filtering</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>Automated Candidate Ranking</span>
                                </div>
                            </div>
                            <Button
                                className="w-full gradient-bg size-lg mt-4"
                                onClick={() => navigate('/payment')}
                            >
                                Subscribe Now - ₹499/mo
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen pt-24 pb-12 bg-gray-50/50 dark:bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Agency Dashboard</h1>
                            <p className="text-muted-foreground mt-1">Manage candidates, track job applications, and analyze resumes.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export Report
                            </Button>
                            <Button className="gradient-bg gap-2">
                                <Plus className="w-4 h-4" />
                                Post New Job
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="candidates" className="space-y-6" onValueChange={setActiveTab}>
                        <TabsList className="bg-white dark:bg-card p-1 border rounded-lg h-auto">
                            <TabsTrigger value="candidates" className="px-4 py-2">Candidates</TabsTrigger>
                            <TabsTrigger value="jobs" className="px-4 py-2">Active Jobs</TabsTrigger>
                            <TabsTrigger value="analytics" className="px-4 py-2">Analytics</TabsTrigger>
                        </TabsList>

                        {/* Candidates Tab */}
                        <TabsContent value="candidates" className="space-y-4">
                            <Card className="border-none shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <CardTitle>Recent Candidates</CardTitle>
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Filter by Job Description / Skill..."
                                                    className="pl-9 w-[300px]"
                                                />
                                            </div>
                                            <Button variant="outline" size="icon">
                                                <Filter className="h-4 w-4" />
                                            </Button>
                                            <Button className="gradient-bg gap-2" onClick={() => navigate('/bulk-analyze')}>
                                                <Upload className="w-4 h-4" />
                                                Bulk Upload Resumes
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Candidate Name</th>
                                                    <th className="px-6 py-3 font-medium">Role Applied</th>
                                                    <th className="px-6 py-3 font-medium">ATS Score</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium">Date Added</th>
                                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {candidates.map((candidate) => (
                                                    <tr key={candidate.id} className="bg-card hover:bg-muted/50 transition-colors">
                                                        <td className="px-6 py-4 font-medium">
                                                            <div className="flex flex-col">
                                                                <span className="text-foreground">{candidate.name}</span>
                                                                <span className="text-xs text-muted-foreground">{candidate.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">{candidate.role}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                                candidate.score >= 70 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                                }`}>
                                                                {candidate.score}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${candidate.status === 'Hired' ? 'border-green-200 text-green-700 bg-green-50' :
                                                                candidate.status === 'Rejected' ? 'border-red-200 text-red-700 bg-red-50' :
                                                                    'border-gray-200 text-gray-700 bg-gray-50'
                                                                }`}>
                                                                {candidate.status === 'Hired' && <CheckCircle className="w-3 h-3" />}
                                                                {candidate.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                                                {candidate.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                                {candidate.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-muted-foreground">{candidate.date}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Jobs Tab */}
                        <TabsContent value="jobs">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Active Job Postings</CardTitle>
                                    <CardDescription>Manage your open positions and track applicants.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {jobs.map((job) => (
                                            <Card key={job.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <CardDescription>{job.department} • {job.location}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex justify-between items-center mt-4">
                                                        <div className="flex -space-x-2">
                                                            {[...Array(3)].map((_, i) => (
                                                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                                    {String.fromCharCode(65 + i)}
                                                                </div>
                                                            ))}
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                                +{job.candidates - 3}
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm">View Details</Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <Card className="flex items-center justify-center border-dashed cursor-pointer hover:bg-muted/50 transition-colors min-h-[180px]">
                                            <div className="text-center">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Plus className="w-5 h-5 text-primary" />
                                                </div>
                                                <h3 className="font-semibold">Create New Job</h3>
                                                <p className="text-sm text-muted-foreground mt-1">Post a new opening</p>
                                            </div>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
}
