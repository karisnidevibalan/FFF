import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles, FileCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const features = [
    'ATS-Optimized Templates',
    'AI-Powered Suggestions',
    'One-Click PDF Export',
  ];

  const handleBuildResume = () => {
    if (!authService.isAuthenticated()) {
      navigate('/signup');
    } else {
      navigate('/make-options');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero-bg" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Resume Builder</span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Build Your{' '}
                <span className="gradient-text">Perfect Resume</span>{' '}
                in Minutes
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Create ATS-optimized resumes with our intelligent builder. Get real-time feedback, 
                AI suggestions, and land more interviews.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={handleBuildResume}
                size="lg"
                className="gradient-bg text-primary-foreground px-8 hover-lift"
              >
                Build Your Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to="/ats-checker">
                <Button size="lg" variant="outline" className="px-8 hover-lift">
                  <FileCheck className="w-5 h-5 mr-2" />
                  Check ATS Score
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 pt-4"
            >
              {[
                { value: '50K+', label: 'Resumes Created' },
                { value: '95%', label: 'ATS Pass Rate' },
                { value: '30+', label: 'Templates' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Resume Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        JD
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">John Doe</h3>
                        <p className="text-muted-foreground">Senior Software Engineer</p>
                        <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                      </div>
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">SUMMARY</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Results-driven engineer with 7+ years of experience building scalable web applications. 
                        Expert in React, Node.js, and cloud technologies.
                      </p>
                    </div>

                    {/* Experience */}
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">EXPERIENCE</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">Senior Software Engineer</p>
                              <p className="text-xs text-muted-foreground">Google Inc.</p>
                            </div>
                            <span className="text-xs text-muted-foreground">2020 - Present</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">Software Engineer</p>
                              <p className="text-xs text-muted-foreground">Meta Platforms</p>
                            </div>
                            <span className="text-xs text-muted-foreground">2017 - 2020</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">SKILLS</h4>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-muted rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">ATS Score</p>
                    <p className="text-lg font-bold text-green-600">92%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">AI Optimized</p>
                    <p className="text-xs text-muted-foreground">Real-time tips</p>
                  </div>
                </div>
              </motion.div>

              {/* Background Decoration */}
              <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4">
                <div className="w-full h-full rounded-2xl border-2 border-dashed border-primary/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
