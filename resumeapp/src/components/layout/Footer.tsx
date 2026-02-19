import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg gradient-bg">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl gradient-text">Resumify</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Build ATS-optimized resumes and land your dream job with AI-powered assistance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link to="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link to="/ats-checker" className="hover:text-primary transition-colors">ATS Checker</Link></li>
              <li><Link to="/job-types" className="hover:text-primary transition-colors">Job Types</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Resume Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Tips</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Interview Prep</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Resumify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
