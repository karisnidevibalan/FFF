import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import JobDescriptionMatcher from '@/components/matcher/JobDescriptionMatcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';

export default function JobMatcher() {
  const features = [
    {
      icon: Target,
      title: 'Keyword Analysis',
      description: 'Identify matching and missing keywords from job descriptions',
    },
    {
      icon: CheckCircle,
      title: 'Requirements Check',
      description: 'Verify if you meet experience and education requirements',
    },
    {
      icon: Sparkles,
      title: 'AI Suggestions',
      description: 'Get personalized tips to improve your resume match',
    },
    {
      icon: TrendingUp,
      title: 'Match Score',
      description: 'See your overall compatibility with the job posting',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Job Description <span className="gradient-text">Matcher</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Paste any job description and instantly see how well your resume matches. 
              Get AI-powered suggestions to improve your chances.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-4 mb-8"
          >
            {features.map((feature, index) => (
              <Card key={index} className="border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-4 text-center">
                  <feature.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Matcher Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <JobDescriptionMatcher />
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Pro Tips for Better Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Tailor your resume for each job application
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Use exact keywords from the job description
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Quantify your achievements with numbers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Match the job title in your summary
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Include relevant certifications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Aim for 80%+ match score before applying
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
