import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Sparkles, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const About: React.FC = () => {
  const stats = [
    { value: '50,000+', label: 'Resumes Created' },
    { value: '95%', label: 'ATS Pass Rate' },
    { value: '30+', label: 'Templates' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  const values = [
    {
      icon: Target,
      title: 'ATS-First Approach',
      description: 'Every template is designed and tested to pass through applicant tracking systems.',
    },
    {
      icon: Users,
      title: 'User-Centric Design',
      description: 'We prioritize ease of use and a seamless experience for job seekers at every level.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Assistance',
      description: 'Smart suggestions and real-time feedback help you create the perfect resume.',
    },
    {
      icon: Award,
      title: 'Professional Quality',
      description: 'Our templates are designed by HR professionals and career experts.',
    },
  ];

  const team = [
    { name: 'Sarah Chen', role: 'Founder & CEO', image: 'SC' },
    { name: 'Michael Park', role: 'Head of Design', image: 'MP' },
    { name: 'Emily Rodriguez', role: 'AI Lead', image: 'ER' },
    { name: 'David Kim', role: 'Engineering Lead', image: 'DK' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero-bg" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Helping Job Seekers{' '}
              <span className="gradient-text">Land Their Dream Jobs</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Resumify was built with one mission: to empower job seekers with the tools 
              they need to create professional, ATS-optimized resumes that get noticed.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Resumify started in 2023 when our founders experienced firsthand the 
                  frustration of applying to hundreds of jobs without getting responses. 
                  After discovering that many resumes were being filtered out by ATS systems 
                  before reaching human recruiters, they set out to solve this problem.
                </p>
                <p>
                  Today, we've helped over 50,000 job seekers create resumes that pass 
                  through ATS systems and impress hiring managers. Our AI-powered platform 
                  combines beautiful design with smart optimization to give you the best 
                  chance of landing your dream job.
                </p>
                <p>
                  We believe that everyone deserves a fair shot at their dream career, 
                  regardless of their background or resume-writing experience. That's why 
                  we've made our core features free and accessible to all.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8">
                <div className="bg-card rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-xl font-bold text-primary-foreground">
                      R
                    </div>
                    <div>
                      <h3 className="font-semibold">Resumify</h3>
                      <p className="text-sm text-muted-foreground">Making job search easier</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>ATS-optimized templates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>AI-powered suggestions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Free to use</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">
              These core principles guide everything we do at Resumify.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    
      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-primary-foreground"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Resume?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Join thousands of job seekers who have already created their perfect resume with Resumify.
            </p>
            <Link to="/builder">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
