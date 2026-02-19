import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { resumeService } from '@/services/resumeService';
import { resumeTemplates } from '@/constants/templates';
import { 
  Trash2, 
  Edit2, 
  Download, 
  Eye, 
  Plus,
  FileText,
  TrendingUp,
  Clock,
  Share2,
  BarChart3,
  Sparkles
} from 'lucide-react';
import ShareResume from '@/components/ShareResume';
import Layout from '@/components/layout/Layout';

interface Resume {
  _id: string;
  title: string;
  template: string;
  atsScore: number;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('My Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [creating, setCreating] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/signup');
      return;
    }
    loadResumes();
  }, [userId, navigate]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getUserResumes(userId!);
      setResumes(data || []);
      setError('');
    } catch (err) {
      setError('Failed to load resumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      setCreating(true);
      const newResume = await resumeService.createResume(
        userId!,
        newResumeTitle,
        selectedTemplate
      );
      setResumes([...resumes, newResume]);
      setOpenDialog(false);
      setNewResumeTitle('My Resume');
      setSelectedTemplate('modern');
    } catch (err) {
      setError('Failed to create resume');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeService.deleteResume(resumeId);
      setResumes(resumes.filter(r => r._id !== resumeId));
    } catch (err) {
      setError('Failed to delete resume');
      console.error(err);
    }
  };

  const handleEditResume = (resumeId: string) => {
    navigate(`/builder/${resumeId}`);
  };

  const getTemplateInfo = (templateId: string) => {
    return resumeTemplates.find(t => t.id === templateId);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading your resumes...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate stats
  const avgAtsScore = resumes.length > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length) 
    : 0;
  const recentlyUpdated = resumes.filter(r => {
    const updateDate = new Date(r.updatedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return updateDate > weekAgo;
  }).length;

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Resumes</h1>
              <p className="text-muted-foreground">
                Create, manage and export your professional resumes
              </p>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="gradient-bg gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Resume
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
                <DialogDescription>
                  Choose a template and give your resume a name
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Resume Title</label>
                  <Input
                    placeholder="e.g., Software Engineer Resume"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resumeTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateResume}
                  disabled={creating || !newResumeTitle.trim()}
                  className="w-full gradient-bg"
                >
                  {creating ? 'Creating...' : 'Create Resume'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="glass-effect border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resumes.length}</p>
                  <p className="text-xs text-muted-foreground">Total Resumes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgAtsScore}%</p>
                  <p className="text-xs text-muted-foreground">Avg ATS Score</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recentlyUpdated}</p>
                  <p className="text-xs text-muted-foreground">Updated This Week</p>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-effect border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resumeTemplates.length}</p>
                  <p className="text-xs text-muted-foreground">Templates Available</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Link to="/ats-checker">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Check ATS Score
              </Button>
            </Link>
            <Link to="/templates">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Browse Templates
              </Button>
            </Link>
            <Link to="/tips">
              <Button variant="outline" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Resume Tips
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center py-12 glass-effect border-0">
              <CardContent>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first professional resume to get started!
                </p>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button className="gradient-bg gap-2">
                      <Plus className="w-4 h-4" />
                      Create Your First Resume
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => {
              const template = getTemplateInfo(resume.template);
              return (
                <motion.div
                  key={resume._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="glass-effect border-0 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: template?.color }}
                        />
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {template?.name}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Updated {new Date(resume.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* ATS Score */}
                      <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">ATS Score</span>
                          <span className={`text-lg font-bold ${
                            resume.atsScore >= 80 ? 'text-green-600' :
                            resume.atsScore >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {resume.atsScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              resume.atsScore >= 80 ? 'bg-green-500' :
                              resume.atsScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${resume.atsScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditResume(resume._id)}
                          className="gap-2"
                        >
                          <Edit2 size={16} />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/preview/${resume._id}`)}
                          className="gap-2"
                        >
                          <Eye size={16} />
                          Preview
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => navigate(`/export/${resume._id}`)}
                        >
                          <Download size={14} />
                          <span className="hidden sm:inline">PDF</span>
                        </Button>
                        <ShareResume resumeId={resume._id} resumeName={resume.title} />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteResume(resume._id)}
                          className="gap-1"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </Layout>
  );
}
