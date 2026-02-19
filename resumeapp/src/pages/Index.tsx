import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Sparkles, Download, CheckCircle, ArrowRight,
  Star, Users, Award, Zap, Shield, Clock, Target
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: FileText,
    title: 'Professional Templates',
    description: 'Choose from professionally designed templates that stand out to employers.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Writing',
    description: 'Get intelligent suggestions to improve your resume content instantly.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    icon: Target,
    title: 'ATS-Optimized',
    description: 'Beat applicant tracking systems with optimized formatting and keywords.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    icon: Download,
    title: 'Export Anywhere',
    description: 'Download your resume as PDF or share it directly with employers.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
];

const steps = [
  {
    number: '1',
    title: 'Pick a Template',
    description: 'Choose from our collection of professional resume templates designed by experts.',
    icon: FileText,
  },
  {
    number: '2',
    title: 'Fill in Details',
    description: 'Add your experience, skills, and education with our intuitive editor.',
    icon: Sparkles,
  },
  {
    number: '3',
    title: 'Download & Apply',
    description: 'Export your polished resume and start applying to your dream jobs.',
    icon: Download,
  },
];

const stats = [
  { number: '50K+', label: 'Resumes Created', icon: FileText },
  { number: '95%', label: 'Success Rate', icon: CheckCircle },
  { number: '200+', label: 'Templates', icon: Award },
  { number: '4.9★', label: 'User Rating', icon: Star },
];

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Build your resume in minutes</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                Land your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  dream job
                </span>{' '}
                with a perfect resume
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Create a professional resume in minutes with our easy-to-use builder.
                Choose from stunning templates, get AI-powered suggestions, and download instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/templates')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Create Your Resume
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/templates')}
                  className="px-8 py-6 text-lg rounded-xl"
                >
                  View Templates
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>5 min setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>50K+ users</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block ml-auto"
            >
              <div className="relative">
                {/* Main Preview - Professional Resume */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-all duration-500 max-w-md">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6 pb-4 border-b border-slate-200">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">JD</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">John Doe</h3>
                      <p className="text-sm text-slate-600 mb-1">Senior Software Engineer</p>
                      <p className="text-xs text-blue-600">San Francisco, CA</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">Summary</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Results-driven engineer with 7+ years of experience building scalable web applications.
                      Expert in React, Node.js, and cloud technologies.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">Experience</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-semibold text-slate-900">Senior Software Engineer</p>
                          <p className="text-xs text-blue-600">2020 - Present</p>
                        </div>
                        <p className="text-xs text-blue-500 mb-1">Google Inc.</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-semibold text-slate-900">Software Engineer</p>
                          <p className="text-xs text-blue-600">2017 - 2020</p>
                        </div>
                        <p className="text-xs text-blue-500">Meta Platforms</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wide">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">React</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">TypeScript</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">Node.js</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">Python</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200">AWS</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-slate-500 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Create your resume in 3 simple steps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our intuitive builder makes it easy to create a professional resume that gets results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-slate-100 dark:text-slate-700">
                    {step.number}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>

                {/* Connector arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to help you create the perfect resume.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${feature.bgColor} rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to build your professional resume?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have landed their dream jobs with our resume builder.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/templates')}
              className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-6 text-lg rounded-xl shadow-lg"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
