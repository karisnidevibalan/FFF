import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  BarChart3, 
  Palette, 
  Cloud, 
  Megaphone, 
  Cog,
  Filter,
  Star,
  ChevronDown
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const jobTypes = [
  {
    id: 'software-developer',
    name: 'Software Developer',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
    templates: 10,
    description: 'Perfect for developers, engineers, and programmers',
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
    templates: 8,
    description: 'Optimized for data scientists and analysts',
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30',
    templates: 12,
    description: 'Creative templates for designers',
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    icon: Cloud,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
    templates: 7,
    description: 'For cloud and infrastructure specialists',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30',
    templates: 9,
    description: 'For digital marketers and brand managers',
  },
  {
    id: 'core-engineering',
    name: 'Core Engineering',
    icon: Cog,
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30',
    templates: 8,
    description: 'For mechanical, electrical, and civil engineers',
  },
];

const templatesByJob: Record<string, Array<{
  id: string;
  name: string;
  rating: number;
  downloads: string;
  atsOptimized: boolean;
  experience: 'fresher' | 'professional' | 'all';
}>> = {
  'software-developer': [
    { id: 'dev-1', name: 'Tech Professional', rating: 4.9, downloads: '15K+', atsOptimized: true, experience: 'all' },
    { id: 'dev-2', name: 'Code Master', rating: 4.8, downloads: '12K+', atsOptimized: true, experience: 'professional' },
    { id: 'dev-3', name: 'Stack Overflow Style', rating: 4.7, downloads: '10K+', atsOptimized: true, experience: 'all' },
    { id: 'dev-4', name: 'GitHub Ready', rating: 4.6, downloads: '8K+', atsOptimized: true, experience: 'fresher' },
    { id: 'dev-5', name: 'Full Stack Pro', rating: 4.5, downloads: '7K+', atsOptimized: true, experience: 'professional' },
    { id: 'dev-6', name: 'Modern Developer', rating: 4.4, downloads: '6K+', atsOptimized: false, experience: 'all' },
    { id: 'dev-7', name: 'Clean Code', rating: 4.3, downloads: '5K+', atsOptimized: true, experience: 'fresher' },
    { id: 'dev-8', name: 'Agile Resume', rating: 4.2, downloads: '4K+', atsOptimized: true, experience: 'professional' },
    { id: 'dev-9', name: 'Startup Ready', rating: 4.1, downloads: '3K+', atsOptimized: false, experience: 'all' },
    { id: 'dev-10', name: 'Enterprise Dev', rating: 4.0, downloads: '2K+', atsOptimized: true, experience: 'professional' },
  ],
  'data-analyst': [
    { id: 'data-1', name: 'Analytics Pro', rating: 4.9, downloads: '10K+', atsOptimized: true, experience: 'all' },
    { id: 'data-2', name: 'Data Scientist', rating: 4.8, downloads: '8K+', atsOptimized: true, experience: 'professional' },
    { id: 'data-3', name: 'Insights Expert', rating: 4.7, downloads: '6K+', atsOptimized: true, experience: 'all' },
    { id: 'data-4', name: 'SQL Master', rating: 4.6, downloads: '5K+', atsOptimized: true, experience: 'fresher' },
  ],
  'ui-ux-designer': [
    { id: 'design-1', name: 'Creative Portfolio', rating: 4.9, downloads: '12K+', atsOptimized: false, experience: 'all' },
    { id: 'design-2', name: 'Minimal Designer', rating: 4.8, downloads: '10K+', atsOptimized: true, experience: 'professional' },
    { id: 'design-3', name: 'Figma Style', rating: 4.7, downloads: '8K+', atsOptimized: false, experience: 'all' },
  ],
  'devops': [
    { id: 'devops-1', name: 'Cloud Architect', rating: 4.9, downloads: '8K+', atsOptimized: true, experience: 'professional' },
    { id: 'devops-2', name: 'Infrastructure Pro', rating: 4.8, downloads: '6K+', atsOptimized: true, experience: 'all' },
  ],
  'marketing': [
    { id: 'mkt-1', name: 'Digital Marketer', rating: 4.9, downloads: '9K+', atsOptimized: true, experience: 'all' },
    { id: 'mkt-2', name: 'Brand Manager', rating: 4.8, downloads: '7K+', atsOptimized: true, experience: 'professional' },
  ],
  'core-engineering': [
    { id: 'eng-1', name: 'Mechanical Engineer', rating: 4.9, downloads: '8K+', atsOptimized: true, experience: 'all' },
    { id: 'eng-2', name: 'Civil Engineer', rating: 4.8, downloads: '6K+', atsOptimized: true, experience: 'professional' },
  ],
};

const JobTypes: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [experience, setExperience] = useState<'all' | 'fresher' | 'professional'>('all');
  const [atsOnly, setAtsOnly] = useState(false);

  const selectedJobData = jobTypes.find(j => j.id === selectedJob);
  const templates = selectedJob ? templatesByJob[selectedJob] || [] : [];

  const filteredTemplates = templates.filter(t => {
    const matchesExperience = experience === 'all' || t.experience === experience || t.experience === 'all';
    const matchesAts = !atsOnly || t.atsOptimized;
    return matchesExperience && matchesAts;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Templates by <span className="gradient-text">Job Type</span>
          </h1>
          <p className="text-muted-foreground">
            Find the perfect resume template for your industry. Our templates are 
            specifically designed to meet the expectations of recruiters in each field.
          </p>
        </motion.div>

        {/* Job Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          {jobTypes.map((job, index) => (
            <motion.button
              key={job.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
              className={cn(
                'p-6 rounded-2xl border text-center transition-all hover-lift',
                selectedJob === job.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-border bg-card hover:border-primary/50'
              )}
            >
              <div className={cn(
                'w-14 h-14 rounded-xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center',
                job.color
              )}>
                <job.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{job.name}</h3>
              <p className="text-xs text-muted-foreground">{job.templates} templates</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Selected Job Templates */}
        {selectedJob && selectedJobData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Selected Job Header */}
            <div className={cn(
              'rounded-2xl p-8 mb-8 bg-gradient-to-br',
              selectedJobData.bgColor
            )}>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  'w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  selectedJobData.color
                )}>
                  <selectedJobData.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedJobData.name}</h2>
                  <p className="text-muted-foreground">{selectedJobData.description}</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filters:</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-card/50">
                      Experience: {experience === 'all' ? 'All' : experience === 'fresher' ? 'Fresher' : 'Professional'}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setExperience('all')}>All Levels</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setExperience('fresher')}>Fresher / Entry</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setExperience('professional')}>Professional</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant={atsOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAtsOnly(!atsOnly)}
                  className={cn(atsOnly ? 'gradient-bg' : 'bg-card/50')}
                >
                  ATS Optimized
                </Button>

                <span className="ml-auto text-sm text-muted-foreground">
                  {filteredTemplates.length} templates
                </span>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/templates/${template.id}`}>
                    <div className="group cursor-pointer">
                      <div className={cn(
                        'aspect-[3/4] rounded-2xl p-4 border border-border overflow-hidden relative hover-lift bg-gradient-to-br',
                        selectedJobData.bgColor
                      )}>
                        {/* Mock Resume */}
                        <div className="bg-card rounded-lg h-full p-3 shadow-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-muted" />
                            <div className="space-y-1">
                              <div className="h-2 w-16 bg-muted rounded" />
                              <div className="h-1 w-10 bg-muted rounded" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-1.5 w-full bg-muted rounded" />
                            <div className="h-1.5 w-4/5 bg-muted rounded" />
                          </div>
                        </div>

                        {template.atsOptimized && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                            ATS
                          </div>
                        )}

                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" className="gradient-bg">Use Template</Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {template.rating}
                          </div>
                          <span>{template.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No templates match your filters.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setExperience('all');
                  setAtsOnly(false);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {!selectedJob && (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">
              Select a job type above to see relevant resume templates
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default JobTypes;
