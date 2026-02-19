import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const templates = [
  {
    id: 'classic-1',
    name: 'Professional Classic',
    category: 'Classic',
    rating: 4.9,
    downloads: '12K+',
    color: 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900',
    atsScore: 92,
  },
  {
    id: 'modern-1',
    name: 'Modern Minimal',
    category: 'Modern',
    rating: 4.8,
    downloads: '8K+',
    color: 'from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
    atsScore: 89,
  },
  {
    id: 'creative-1',
    name: 'Creative Edge',
    category: 'Creative',
    rating: 4.7,
    downloads: '5K+',
    color: 'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30',
    atsScore: 85,
  },
  {
    id: 'executive-1',
    name: 'Executive Pro',
    category: 'Executive',
    rating: 4.9,
    downloads: '9K+',
    color: 'from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30',
    atsScore: 94,
  },
  {
    id: 'tech-1',
    name: 'Tech Innovator',
    category: 'Tech',
    rating: 4.8,
    downloads: '7K+',
    color: 'from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30',
    atsScore: 91,
  },
  {
    id: 'minimal-1',
    name: 'Minimal & Clean',
    category: 'Minimal',
    rating: 4.6,
    downloads: '6K+',
    color: 'from-gray-100 to-zinc-100 dark:from-gray-900/30 dark:to-zinc-900/30',
    atsScore: 88,
  },
  {
    id: 'colorful-1',
    name: 'Colorful Impact',
    category: 'Creative',
    rating: 4.7,
    downloads: '4K+',
    color: 'from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30',
    atsScore: 83,
  },
  {
    id: 'academic-1',
    name: 'Academic Scholar',
    category: 'Academic',
    rating: 4.8,
    downloads: '5K+',
    color: 'from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30',
    atsScore: 90,
  },
  {
    id: 'elegant-1',
    name: 'Elegant Design',
    category: 'Premium',
    rating: 4.9,
    downloads: '6K+',
    color: 'from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30',
    atsScore: 93,
  },
  {
    id: 'compact-1',
    name: 'Compact Pro',
    category: 'Modern',
    rating: 4.7,
    downloads: '3K+',
    color: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
    atsScore: 87,
  },
  {
    id: 'bold-1',
    name: 'Bold Statement',
    category: 'Creative',
    rating: 4.6,
    downloads: '2K+',
    color: 'from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30',
    atsScore: 84,
  },
  {
    id: 'luxury-1',
    name: 'Luxury Premium',
    category: 'Executive',
    rating: 4.9,
    downloads: '4K+',
    color: 'from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/30',
    atsScore: 95,
  },
];

const TemplateShowcase: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="gradient-text">Templates</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Choose from our collection of ATS-optimized templates designed by HR professionals 
              to maximize your interview chances.
            </p>
          </div>
          <Link to="/templates">
            <Button variant="outline" className="gap-2">
              View All Templates (30+)
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/templates/${template.id}`}>
                <div className="group cursor-pointer h-full flex flex-col">
                  {/* Template Preview */}
                  <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${template.color} p-4 mb-3 border border-border overflow-hidden relative hover-lift transition-all`}>
                    {/* Resume Content */}
                    <div className="bg-white dark:bg-slate-950 rounded-lg h-full p-3 shadow-md flex flex-col justify-between text-xs">
                      {/* Header with Photo */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded w-16 mt-1" />
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 mt-2">
                          <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded w-full" />
                          <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded w-5/6" />
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                        </div>
                      </div>

                      <div>
                        <div className="h-1.5 bg-slate-300 dark:bg-slate-600 rounded w-16 mb-1" />
                        <div className="space-y-1">
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                        </div>
                      </div>
                    </div>

                    {/* ATS Badge */}
                    <div className="absolute top-3 right-3 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <CheckCircle className="w-3 h-3" />
                      ATS
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm leading-tight">{template.name}</h3>
                      <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {template.category}
                      </span>
                    </div>
                    
                    <div className="mt-auto pt-2 border-t border-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{template.rating}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <span>📥 {template.downloads}</span>
                      </div>
                    </div>

                    {/* ATS Score Bar */}
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">ATS Score</span>
                        <span className="text-xs font-bold text-green-600">{template.atsScore}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600" 
                          style={{ width: `${template.atsScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplateShowcase;
