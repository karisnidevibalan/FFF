import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Mic, 
  LayoutTemplate, 
  Target,
  CheckCircle,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Smart Resume Builder',
    description: 'Build professional resumes with our intuitive drag-and-drop editor. Real-time preview as you type.',
    color: 'primary',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Suggestions',
    description: 'Get intelligent recommendations for action verbs, achievements, and content optimization.',
    color: 'secondary',
  },
  {
    icon: Target,
    title: 'ATS Score Checker',
    description: 'Analyze your resume against job descriptions. Get keyword matching and improvement tips.',
    color: 'primary',
  },
  {
    icon: LayoutTemplate,
    title: '30+ Templates',
    description: 'Choose from classic, modern, and creative templates designed to pass ATS systems.',
    color: 'secondary',
  },
  {
    icon: Mic,
    title: 'Voice Input',
    description: 'Dictate your experience and skills using voice-to-text technology for faster resume creation.',
    color: 'primary',
  },
  {
    icon: Download,
    title: 'One-Click Export',
    description: 'Download your resume as a print-ready PDF that matches your preview exactly.',
    color: 'secondary',
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Land Your Dream Job</span>
          </h2>
          <p className="text-muted-foreground">
            Our comprehensive toolkit helps you create, optimize, and perfect your resume 
            with AI-powered assistance every step of the way.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group h-full bg-card border border-border rounded-2xl p-6 hover-lift cursor-pointer">
                <div className={`w-12 h-12 rounded-xl ${
                  feature.color === 'primary' ? 'gradient-bg' : 'bg-secondary'
                } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 p-6 bg-card border border-border rounded-2xl">
            {[
              { icon: CheckCircle, text: 'Free to Start' },
              { icon: CheckCircle, text: 'No Credit Card Required' },
              { icon: CheckCircle, text: 'Export Unlimited PDFs' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm">
                <item.icon className="w-5 h-5 text-green-500" />
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
