import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Filter, Loader2, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';

export default function BulkResumeAnalyzer() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [requirements, setRequirements] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleAnalyze = () => {
        if (!requirements || files.length === 0) {
            toast.error('Please provide requirements and upload resumes');
            return;
        }

        setIsAnalyzing(true);

        // Simulate analysis delay
        setTimeout(() => {
            // Mock results based on files
            const mockResults = files.map((file, index) => ({
                id: index,
                name: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                email: `candidate${index + 1}@example.com`,
                score: Math.floor(Math.random() * (95 - 60 + 1)) + 60, // Random score between 60-95
                match: Math.random() > 0.5 ? 'High Match' : 'Medium Match',
                skills: ['React', 'Node.js', 'TypeScript'].sort(() => 0.5 - Math.random()).slice(0, 2),
                status: 'Analyzed'
            })).sort((a, b) => b.score - a.score); // Sort by score descending

            setResults(mockResults);
            setIsAnalyzing(false);
            setStep(3); // Go to results
            toast.success(`Analysis complete! ${mockResults.length} resumes processed.`);
        }, 3000);
    };

    return (
        <Layout>
            <div className="min-h-screen pt-24 pb-12 bg-gray-50/50 dark:bg-background">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Button variant="ghost" onClick={() => navigate('/agency-dashboard')} className="mb-4 pl-0 hover:pl-2 transition-all">
                            ← Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Bulk Resume Screening</h1>
                        <p className="text-muted-foreground mt-1">
                            Upload multiple resumes and screen them against your specific job requirements instantly.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {/* Step 1: Requirements */}
                        <Card className={`transition-all duration-300 ${step === 1 ? 'ring-2 ring-primary' : ''}`}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
                                    <CardTitle>Job Requirements</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <label className="text-sm font-medium">Paste Job Description / Requirements</label>
                                    <textarea
                                        className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="Paste the job description, required skills, and qualifications here..."
                                        value={requirements}
                                        onChange={(e) => setRequirements(e.target.value)}
                                        disabled={step > 1 && step < 3} // Disable during analysis
                                    />
                                    {step === 1 && (
                                        <div className="flex justify-end">
                                            <Button onClick={() => setStep(2)} disabled={!requirements.trim()}>
                                                Next: Upload Resumes <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 2: Upload */}
                        <Card className={`transition-all duration-300 ${step === 2 ? 'ring-2 ring-primary' : ''} ${step < 2 ? 'opacity-60' : ''}`}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
                                    <CardTitle>Upload Resumes</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="border-2 border-dashed rounded-lg p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf,.docx,.doc"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            disabled={step !== 2 || isAnalyzing}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-10 h-10 text-muted-foreground" />
                                            <h3 className="font-semibold text-lg">
                                                {files.length > 0 ? `${files.length} files selected` : "Drop resumes here or click to upload"}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">Support for PDF, DOCX (Max 50 files)</p>
                                        </div>
                                    </div>

                                    {files.length > 0 && (
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <p className="text-sm font-medium mb-2">Selected Files:</p>
                                            <div className="max-h-[100px] overflow-y-auto space-y-1">
                                                {files.map((file, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <FileText className="w-3 h-3" />
                                                        {file.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="flex justify-end gap-3">
                                            <Button variant="outline" onClick={() => setStep(1)} disabled={isAnalyzing}>Back</Button>
                                            <Button className="gradient-bg" onClick={handleAnalyze} disabled={files.length === 0 || isAnalyzing}>
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Analyzing Resumes...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Filter className="w-4 h-4 mr-2" />
                                                        Analyze & Filter Candidates
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 3: Results */}
                        {step === 3 && (
                            <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">3</div>
                                            <div>
                                                <CardTitle>Screening Results</CardTitle>
                                                <CardDescription>Based on your requirements</CardDescription>
                                            </div>
                                        </div>
                                        <Button variant="outline" onClick={() => { setStep(1); setFiles([]); setResults([]); setRequirements(''); }}>
                                            Start New Screening
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                                <tr>
                                                    <th className="px-6 py-3 font-medium">Rank</th>
                                                    <th className="px-6 py-3 font-medium">Candidate</th>
                                                    <th className="px-6 py-3 font-medium">Match Score</th>
                                                    <th className="px-6 py-3 font-medium">Status</th>
                                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {results.map((result, index) => (
                                                    <tr key={index} className="bg-card hover:bg-muted/50 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-muted-foreground">#{index + 1}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium">{result.name}</div>
                                                            <div className="text-xs text-muted-foreground">{result.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
                                                                    <div className={`h-2.5 rounded-full ${params(result.score)}`} style={{ width: `${result.score}%` }}></div>
                                                                </div>
                                                                <span className="font-bold">{result.score}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${result.score >= 80 ? 'bg-green-100 text-green-800' :
                                                                    result.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {result.score >= 80 ? 'Recommended' : 'Review'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Button size="sm" variant="outline">View Report</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function params(score: number) {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
}
