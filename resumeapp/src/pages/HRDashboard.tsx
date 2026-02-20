import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Users,
  TrendingUp,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Building2,
  Star,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import * as pdfjsLib from 'pdfjs-dist';
import { useToast } from '@/hooks/use-toast';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  matchScore: number;
  skills: string[];
  experience: string;
  education: string;
  missingSkills: string[];
  status: 'pending' | 'shortlisted' | 'rejected';
  uploadedAt: Date;
}

const HRDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [filterScore, setFilterScore] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const jobRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Data Analyst',
    'Product Manager',
    'UI/UX Designer',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'Business Analyst',
    'Project Manager',
  ];

  // Handle bulk file upload - REAL AI Analysis
  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!jobRole) {
      toast({ title: "Error", description: "Please select a job role first!", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    const newCandidates: Candidate[] = [];
    let successCount = 0;
    let errorCount = 0;
    let lastError: any = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentFile(file.name);

      try {
        // Extract text from PDF
        let text = '';
        // Use server-side extraction for better reliability
        const formData = new FormData();
        formData.append('file', file);

        console.log(`Sending ${file.name} for server-side extraction...`);

        const extractResponse = await fetch(`${API_URL}/ai/extract-text`, {
          method: 'POST',
          body: formData,
        });

        if (!extractResponse.ok) {
          const errData = await extractResponse.json();
          throw new Error(errData.error || 'Failed to extract text from file');
        }

        const extractResult = await extractResponse.json();
        text = extractResult.text;

        if (text.length < 50) throw new Error('Could not extract sufficient text from file. Please try a TXT or different PDF format.');

        // Call AI API
        const response = await fetch(`${API_URL}/ai/analyze-candidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ resumeText: text, jobRole, jobDescription }),
        });

        const result = await response.json();

        if (result.success && result.data) {
          newCandidates.push({
            id: `candidate-${Date.now()}-${i}`,
            name: result.data.name || `Candidate ${i + 1}`,
            email: result.data.email || '',
            phone: result.data.phone || '',
            matchScore: result.data.matchScore || 0,
            skills: result.data.skills || [],
            experience: result.data.experience || 'Not specified',
            education: result.data.education || 'Not specified',
            missingSkills: result.data.missingSkills || [],
            status: 'pending',
            uploadedAt: new Date(),
          });
          successCount++;
        } else {
          throw new Error(result.message || 'Analysis failed');
        }
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        lastError = error;
        errorCount++;
      }

      setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    newCandidates.sort((a, b) => b.matchScore - a.matchScore);
    setCandidates(prev => [...newCandidates, ...prev]);
    setIsUploading(false);
    setUploadProgress(0);
    setCurrentFile('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    toast({
      title: "Upload Complete",
      description: `Analyzed ${successCount} resume(s)${errorCount > 0 ? `, ${errorCount} failed. Last error: ${lastError}` : ''}`,
      variant: successCount > 0 ? "default" : "destructive",
    });
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filterScore === 'all' ||
      (filterScore === 'excellent' && candidate.matchScore >= 85) ||
      (filterScore === 'good' && candidate.matchScore >= 70 && candidate.matchScore < 85) ||
      (filterScore === 'fair' && candidate.matchScore >= 50 && candidate.matchScore < 70) ||
      (filterScore === 'poor' && candidate.matchScore < 50);

    return matchesSearch && matchesFilter;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { color: 'bg-green-500', label: 'Excellent' };
    if (score >= 70) return { color: 'bg-blue-500', label: 'Good' };
    if (score >= 50) return { color: 'bg-yellow-500', label: 'Fair' };
    return { color: 'bg-red-500', label: 'Poor' };
  };

  const updateStatus = (id: string, status: 'shortlisted' | 'rejected') => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const exportToCSV = () => {
    const dataToExport = selectedCandidates.length > 0
      ? candidates.filter(c => selectedCandidates.includes(c.id))
      : filteredCandidates;

    const headers = ['Name', 'Email', 'Phone', 'Match Score', 'Skills', 'Experience', 'Education', 'Missing Skills', 'Status'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(c => [
        c.name, c.email, c.phone, `${c.matchScore}%`,
        `"${c.skills.join(', ')}"`, c.experience, c.education,
        `"${c.missingSkills.join(', ')}"`, c.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${jobRole.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleSelection = (id: string) => {
    setSelectedCandidates(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'shortlisted').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
    avgScore: candidates.length > 0
      ? Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length) : 0,
  };

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">
                HR <span className="gradient-text">Dashboard</span>
              </h1>
              <Badge variant="secondary" className="ml-2">B2B</Badge>
            </div>
            <p className="text-muted-foreground">
              Bulk upload resumes and instantly rank candidates by job match score
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.shortlisted}</p>
                    <p className="text-sm text-muted-foreground">Shortlisted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.avgScore}%</p>
                    <p className="text-sm text-muted-foreground">Avg Match Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Bulk Resume Upload
                </CardTitle>
                <CardDescription>
                  Upload multiple resumes at once. AI will analyze and rank candidates automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Job Role *</label>
                    <Select value={jobRole} onValueChange={setJobRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose job role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {jobRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Description (Optional)</label>
                    <Input
                      placeholder="Paste key requirements..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${jobRole ? 'border-primary/50 bg-primary/5 cursor-pointer hover:bg-primary/10' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    }`}
                  onClick={() => jobRole && fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <div className="space-y-4">
                      <RefreshCw className="w-12 h-12 mx-auto text-primary animate-spin" />
                      <p className="font-medium">Analyzing with AI...</p>
                      {currentFile && <p className="text-sm text-primary">{currentFile}</p>}
                      <Progress value={uploadProgress} className="max-w-xs mx-auto" />
                      <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                    </div>
                  ) : (
                    <>
                      <Upload className={`w-12 h-12 mx-auto mb-4 ${jobRole ? 'text-primary' : 'text-gray-400'}`} />
                      <p className="font-medium mb-1">
                        {jobRole ? 'Click to upload resumes' : 'Select a job role first'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, DOCX, TXT • Multiple files allowed
                      </p>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleBulkUpload}
                  className="hidden"
                  disabled={!jobRole || isUploading}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Candidates Table */}
          {candidates.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Candidates ({filteredCandidates.length})
                      </CardTitle>
                      <CardDescription>Ranked by match score for {jobRole}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search candidates..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-48"
                        />
                      </div>
                      <Select value={filterScore} onValueChange={setFilterScore}>
                        <SelectTrigger className="w-36">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Scores</SelectItem>
                          <SelectItem value="excellent">Excellent (85%+)</SelectItem>
                          <SelectItem value="good">Good (70-84%)</SelectItem>
                          <SelectItem value="fair">Fair (50-69%)</SelectItem>
                          <SelectItem value="poor">Poor (&lt;50%)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={exportToCSV}>
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                              onChange={selectAll}
                              className="rounded"
                            />
                          </TableHead>
                          <TableHead>Rank</TableHead>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Match Score</TableHead>
                          <TableHead>Skills</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Missing Skills</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCandidates.map((candidate, index) => {
                          const scoreBadge = getScoreBadge(candidate.matchScore);
                          return (
                            <TableRow key={candidate.id} className={selectedCandidates.includes(candidate.id) ? 'bg-primary/5' : ''}>
                              <TableCell>
                                <input
                                  type="checkbox"
                                  checked={selectedCandidates.includes(candidate.id)}
                                  onChange={() => toggleSelection(candidate.id)}
                                  className="rounded"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {index === 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                  #{index + 1}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{candidate.name}</p>
                                  <p className="text-xs text-muted-foreground">{candidate.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${scoreBadge.color}`}>
                                    {candidate.matchScore}
                                  </div>
                                  <Badge variant="secondary" className="text-xs">{scoreBadge.label}</Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                  {candidate.skills.slice(0, 3).map(skill => (
                                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                  ))}
                                  {candidate.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs">+{candidate.skills.length - 3}</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{candidate.experience}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                  {candidate.missingSkills.slice(0, 2).map(skill => (
                                    <Badge key={skill} variant="destructive" className="text-xs">{skill}</Badge>
                                  ))}
                                  {candidate.missingSkills.length > 2 && (
                                    <Badge variant="destructive" className="text-xs">+{candidate.missingSkills.length - 2}</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    candidate.status === 'shortlisted' ? 'default' :
                                      candidate.status === 'rejected' ? 'destructive' : 'secondary'
                                  }
                                >
                                  {candidate.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => updateStatus(candidate.id, 'shortlisted')}
                                    title="Shortlist"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => updateStatus(candidate.id, 'rejected')}
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredCandidates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No candidates match your filters
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {candidates.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No candidates yet</h3>
              <p className="text-muted-foreground">Upload resumes to start screening candidates</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HRDashboard;
