import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Star, Code, Image, Briefcase, Award, 
  Mail, Phone, MapPin, CheckCircle, Search, Columns,
  Upload, FilePlus, X, FileText, Loader2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResume } from '@/contexts/ResumeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker - using a stable version from unpkg
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const categories = [
  { id: 'all', name: 'All Templates', icon: LayoutGrid },
  { id: 'simple', name: 'Simple', icon: Star },
  { id: 'modern', name: 'Modern', icon: Code },
  { id: 'one-column', name: 'One Column', icon: Columns },
  { id: 'with-photo', name: 'With Photo', icon: Image },
  { id: 'professional', name: 'Professional', icon: Briefcase },
  { id: 'ats', name: 'ATS Friendly', icon: Award },
];

// Template Components
const KellyTemplate = () => (
  <div className="h-full flex text-[7px] bg-white overflow-hidden">
    <div className="w-[35%] bg-slate-100 p-3">
      <h3 className="font-bold text-[12px] text-slate-800 leading-tight">KELLY</h3>
      <h3 className="font-bold text-[12px] text-slate-800 mb-1">BLACKWELL</h3>
      <p className="text-slate-600 text-[8px] mb-3">Administrative Assistant</p>
      
      <div className="mb-3">
        <h4 className="font-bold text-[8px] text-slate-700 border-b border-slate-300 pb-1 mb-2">DETAILS</h4>
        <div className="space-y-1 text-[7px] text-slate-600">
          <div className="flex items-start gap-1">
            <Mail className="w-2.5 h-2.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <span>kelly.blackwell@example.com</span>
          </div>
          <div className="flex items-start gap-1">
            <Phone className="w-2.5 h-2.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <span>(210) 286-1624</span>
          </div>
          <div className="flex items-start gap-1">
            <MapPin className="w-2.5 h-2.5 text-slate-400 mt-0.5 flex-shrink-0" />
            <span>Weston, FL, United States</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-[8px] text-slate-700 border-b border-slate-300 pb-1 mb-2">SKILLS</h4>
        <ul className="space-y-0.5 text-[7px] text-slate-600">
          <li>• Analytical Thinking</li>
          <li>• Team Leadership</li>
          <li>• Organization</li>
          <li>• Strong Communication</li>
          <li>• MS Office Suite</li>
        </ul>
      </div>
    </div>
    <div className="flex-1 p-3">
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-slate-800 border-b border-slate-300 pb-1 mb-1.5">SUMMARY</h4>
        <p className="text-slate-600 leading-relaxed">
          Administrative assistant with 9+ years of experience organizing presentations, preparing reports, 
          and maintaining confidentiality. Expertise in Microsoft Excel.
        </p>
      </div>
      
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-slate-800 border-b border-slate-300 pb-1 mb-1.5">EXPERIENCE</h4>
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-[8px]">Administrative Assistant</p>
            <p className="text-[7px] text-slate-500">Sep 2017 — Current</p>
          </div>
          <p className="text-blue-600 text-[7px]">Redford & Sons, Boston, MA</p>
          <ul className="text-slate-600 space-y-0.5 mt-0.5">
            <li>• Schedule and coordinate meetings for executives</li>
            <li>• Trained 2 assistants during company expansion</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start">
            <p className="font-semibold text-[8px]">Secretary</p>
            <p className="text-[7px] text-slate-500">Jun 2016 — Aug 2017</p>
          </div>
          <p className="text-blue-600 text-[7px]">Bright Spot Ltd., Boston</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-[9px] text-slate-800 border-b border-slate-300 pb-1 mb-1.5">EDUCATION</h4>
        <p className="font-semibold text-[8px]">Bachelor of Arts, Finance</p>
        <p className="text-slate-500 text-[7px]">Brown University • 2004 — 2009</p>
      </div>
    </div>
  </div>
);

const HowardTemplate = () => (
  <div className="h-full text-[7px] bg-white p-4 overflow-hidden">
    <div className="text-center border-b border-slate-300 pb-2 mb-3">
      <h3 className="font-bold text-[14px] text-slate-800 tracking-wide">HOWARD JONES</h3>
      <p className="text-slate-600 text-[9px] mt-0.5">Lawyer</p>
      <p className="text-[7px] text-slate-500 mt-1">
        San Francisco, CA | howard.jones@gmail.com | (415) 555-2671
      </p>
    </div>
    
    <div className="mb-3">
      <h4 className="font-bold text-[9px] text-slate-700 text-center border-b border-slate-200 pb-1 mb-1.5">SUMMARY</h4>
      <p className="text-slate-600 leading-relaxed text-center">
        Experienced Lawyer with passion for justice. Skilled in public speaking with proven track record 
        of achieving favorable outcomes. Adept in preparing trials and presenting cases.
      </p>
    </div>
    
    <div className="mb-3">
      <h4 className="font-bold text-[9px] text-slate-700 text-center border-b border-slate-200 pb-1 mb-1.5">EXPERIENCE</h4>
      <div className="mb-2">
        <div className="flex justify-between">
          <p className="font-semibold text-[8px]">Lawyer, Madison and Fletcher Attorneys</p>
          <p className="text-[7px] text-slate-500">Dec 2010 — Aug 2018</p>
        </div>
        <ul className="text-slate-600 space-y-0.5 mt-0.5">
          <li>• Prepared legal documents and presented cases</li>
          <li>• Filed briefings and collected evidence</li>
        </ul>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div>
        <h4 className="font-bold text-[9px] text-slate-700 border-b border-slate-200 pb-1 mb-1.5">EDUCATION</h4>
        <p className="font-semibold text-[8px]">New York Law School</p>
        <p className="text-[7px] text-slate-500">Juris Doctor • 2003 — 2006</p>
      </div>
      <div>
        <h4 className="font-bold text-[9px] text-slate-700 border-b border-slate-200 pb-1 mb-1.5">SKILLS</h4>
        <p className="text-[7px] text-slate-600">Regulatory Compliance • Contract Negotiation • Family Law • Mediation</p>
      </div>
    </div>
  </div>
);

const SamanthaTemplate = () => (
  <div className="h-full flex text-[7px] bg-white overflow-hidden">
    <div className="w-[32%] bg-gradient-to-b from-blue-600 to-blue-700 text-white p-3">
      <div className="w-12 h-12 rounded-full bg-blue-300 mx-auto mb-2 flex items-center justify-center border-2 border-white">
        <span className="text-blue-700 font-bold text-[10px]">SW</span>
      </div>
      <h3 className="text-center font-bold text-[10px] mb-0.5">Samantha Williams</h3>
      <p className="text-center text-blue-200 text-[8px] mb-2">Senior Analyst</p>
      
      <div className="space-y-1 text-[7px] mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5" />
          <span>New York, NY</span>
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-2.5 h-2.5" />
          <span className="truncate">samantha@email.com</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-2.5 h-2.5" />
          <span>(555) 789-1234</span>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-[8px] border-b border-blue-400 pb-1 mb-1.5">SKILLS</h4>
        <ul className="space-y-0.5">
          {['Project Management', 'Data Analysis', 'SQL & Excel', 'Business Intelligence'].map(skill => (
            <li key={skill} className="flex items-center gap-1 text-[7px]">
              <div className="w-1 h-1 rounded-full bg-blue-300"></div>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="flex-1 p-3">
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-slate-800 border-b border-slate-300 pb-1 mb-1.5">SUMMARY</h4>
        <p className="text-slate-600 leading-relaxed">
          Senior Analyst with 5+ years of experience in data analysis and business intelligence. 
          Skilled in driving operational efficiency and data-driven strategies.
        </p>
      </div>
      
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-slate-800 border-b border-slate-300 pb-1 mb-1.5">EXPERIENCE</h4>
        <div className="mb-2">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-[8px]">Senior Analyst</p>
            <p className="text-[7px] text-slate-500">Jul 2021 — Current</p>
          </div>
          <p className="text-blue-600 text-[7px]">Loom & Lantern Co. - New York</p>
          <ul className="text-slate-600 space-y-0.5 mt-0.5">
            <li>• Spearhead data analysis for key business functions</li>
            <li>• Conduct market analysis, resulting in 15% increase</li>
          </ul>
        </div>
        <div>
          <div className="flex justify-between items-start">
            <p className="font-semibold text-[8px]">Business Analyst</p>
            <p className="text-[7px] text-slate-500">Aug 2017 — May 2021</p>
          </div>
          <p className="text-blue-600 text-[7px]">Willow & Wren Ltd.</p>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-[9px] text-slate-800 border-b border-slate-300 pb-1 mb-1.5">EDUCATION</h4>
        <p className="font-semibold text-[8px]">New York University</p>
        <p className="text-slate-500 text-[7px]">B.S. Economics • 2013 — 2017</p>
      </div>
    </div>
  </div>
);

const JessieTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-3">
      <h3 className="font-bold text-[12px]">Jessie Smith</h3>
      <p className="text-violet-200 text-[8px]">Human Resource Manager</p>
      <p className="text-[7px] text-violet-200 mt-1">
        Plano, TX | email@youremail.com | (469) 385-2948
      </p>
    </div>
    <div className="p-3">
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-violet-600 border-b border-violet-200 pb-1 mb-1.5">SUMMARY</h4>
        <p className="text-slate-600 leading-relaxed">
          HR generalist with 8 years of experience in hiring, training, and employee management. 
          Worked with labor unions to negotiate compensation packages.
        </p>
      </div>
      
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-violet-600 border-b border-violet-200 pb-1 mb-1.5">EXPERIENCE</h4>
        <div className="mb-2">
          <div className="flex justify-between">
            <p className="font-semibold text-[8px]">Human Resource Manager</p>
            <p className="text-[7px] text-slate-500">04/2019 - Current</p>
          </div>
          <p className="text-violet-600 text-[7px]">Jim's Widget Factory, Plano, TX</p>
          <ul className="text-slate-600 space-y-0.5 mt-0.5">
            <li>• Implement effective company policies for compliance</li>
            <li>• Increased retention rates to over 90%</li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h4 className="font-bold text-[9px] text-violet-600 border-b border-violet-200 pb-1 mb-1.5">EDUCATION</h4>
          <p className="font-semibold text-[8px]">Master, Human Resources</p>
          <p className="text-[7px] text-slate-500">University of Texas • 2007 - 2011</p>
        </div>
        <div>
          <h4 className="font-bold text-[9px] text-violet-600 border-b border-violet-200 pb-1 mb-1.5">SKILLS</h4>
          <div className="flex flex-wrap gap-1">
            {['Analytics', 'Communication', 'Leadership'].map(skill => (
              <span key={skill} className="bg-violet-50 text-violet-600 px-1 py-0.5 rounded text-[6px]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const WesTemplate = () => (
  <div className="h-full flex text-[7px] bg-white overflow-hidden">
    <div className="flex-1 p-3">
      <h3 className="font-bold text-[12px] text-slate-900">WES TURNER</h3>
      <p className="text-amber-600 text-[9px] font-medium mb-2">SALES MANAGER</p>
      
      <div className="mb-3">
        <h4 className="font-bold text-[8px] text-slate-800 bg-slate-100 px-1 py-0.5 mb-1.5">SUMMARY</h4>
        <p className="text-slate-600 leading-relaxed">
          Experienced Sales Manager with five years of industry experience overseeing sales figures 
          and new account developments.
        </p>
      </div>
      
      <div className="mb-3">
        <h4 className="font-bold text-[8px] text-slate-800 bg-slate-100 px-1 py-0.5 mb-1.5">EXPERIENCE</h4>
        <div className="mb-2">
          <p className="font-semibold text-[8px]">Sales Manager, Winthrop and Lee</p>
          <p className="text-[7px] text-slate-500">Boulder • Nov 2014 - Sep 2019</p>
          <ul className="text-slate-600 space-y-0.5 mt-0.5">
            <li>• Achieved 25% increase in sales revenue</li>
            <li>• Monitored competition and adjusted costs</li>
          </ul>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-[8px] text-slate-800 bg-slate-100 px-1 py-0.5 mb-1.5">EDUCATION</h4>
        <p className="font-semibold text-[8px]">Colorado College</p>
        <p className="text-[7px] text-slate-500">Bachelor of Marketing • 2008 - 2010</p>
      </div>
    </div>
    <div className="w-[28%] bg-amber-50 p-2">
      <h4 className="font-bold text-[8px] text-amber-800 mb-1.5">DETAILS</h4>
      <div className="space-y-1 text-[7px] text-slate-600 mb-3">
        <p>Boulder, CO</p>
        <p>(720) 315-8237</p>
        <p>wes@gmail.com</p>
      </div>
      
      <h4 className="font-bold text-[8px] text-amber-800 mb-1.5">SKILLS</h4>
      <ul className="space-y-0.5 text-[7px] text-slate-600">
        <li>Project Management</li>
        <li>Business Development</li>
        <li>Communication</li>
      </ul>
    </div>
  </div>
);

const SebastianTemplate = () => (
  <div className="h-full flex text-[7px] bg-white overflow-hidden">
    <div className="w-[30%] bg-gradient-to-b from-cyan-500 to-teal-600 text-white p-3">
      <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center border-2 border-white">
        <span className="text-[9px] font-bold">SW</span>
      </div>
      <h4 className="text-[8px] font-bold mt-2 mb-1.5">DETAILS</h4>
      <div className="space-y-1 text-[7px]">
        <p>Riverdale, NY</p>
        <p>(917) 324-1818</p>
        <p>hw12@yahoo.com</p>
      </div>
      
      <h4 className="text-[8px] font-bold mt-3 mb-1.5">SKILLS</h4>
      <ul className="space-y-0.5">
        {['Communication', 'Motivated', 'MS Office', 'Social Media'].map(skill => (
          <li key={skill} className="flex items-center gap-1 text-[7px]">
            <div className="w-1 h-1 rounded-full bg-white"></div>
            {skill}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex-1 p-3">
      <h3 className="font-bold text-[12px] text-slate-900">SEBASTIAN</h3>
      <h3 className="font-bold text-[12px] text-slate-900 mb-0.5">WILDER</h3>
      <p className="text-cyan-600 text-[8px] font-medium mb-2">Student</p>
      
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-cyan-600 border-b border-cyan-200 pb-1 mb-1.5">SUMMARY</h4>
        <p className="text-slate-600 leading-relaxed">
          Hardworking student seeking employment with positive attitude and motivation to learn new skills.
        </p>
      </div>
      
      <div className="mb-3">
        <h4 className="font-bold text-[9px] text-cyan-600 border-b border-cyan-200 pb-1 mb-1.5">EXPERIENCE</h4>
        <p className="font-semibold text-[8px]">Sales Associate</p>
        <p className="text-[7px] text-slate-500">Big Apple Bookstore • Sep 2015 - Jun 2018</p>
      </div>
      
      <div>
        <h4 className="font-bold text-[9px] text-cyan-600 border-b border-cyan-200 pb-1 mb-1.5">EDUCATION</h4>
        <p className="font-semibold text-[8px]">Bachelor, Communications</p>
        <p className="text-[7px] text-slate-500">New York University • 2016 - Current</p>
      </div>
    </div>
  </div>
);

// Nebula Template - Modern clean with accent
const NebulaTemplate = () => (
  <div className="h-full text-[7px] bg-white p-4 overflow-hidden">
    <div className="border-l-4 border-indigo-500 pl-3 mb-4">
      <h3 className="font-bold text-[14px] text-slate-800">ALEX JOHNSON</h3>
      <p className="text-indigo-600 text-[9px] font-medium">Full Stack Developer</p>
      <div className="flex gap-3 mt-1 text-[7px] text-slate-500">
        <span>✉ alex@email.com</span>
        <span>☎ (555) 123-4567</span>
      </div>
    </div>
    
    <p className="text-slate-600 border-l-2 border-indigo-200 pl-2 mb-3 italic text-[7px]">
      Passionate developer with 5+ years of experience building scalable web applications.
    </p>
    
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-2">
        <h4 className="font-bold text-[8px] text-indigo-600 mb-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>EXPERIENCE
        </h4>
        <div className="mb-2 pl-2">
          <p className="font-semibold text-[8px]">Senior Developer</p>
          <p className="text-indigo-500 text-[7px]">TechCorp Inc.</p>
          <p className="text-slate-400 text-[6px]">2020 — Present</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-[8px] text-indigo-600 mb-2">SKILLS</h4>
        <div className="space-y-1">
          {['React', 'Node.js', 'Python'].map(skill => (
            <div key={skill}>
              <p className="text-[7px]">{skill}</p>
              <div className="h-1 bg-slate-200 rounded-full">
                <div className="h-full bg-indigo-500 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Stellar Template - Minimal elegant
const StellarTemplate = () => (
  <div className="h-full text-[7px] bg-white p-4 overflow-hidden">
    <div className="text-center mb-4">
      <h3 className="font-light text-[16px] text-slate-800 tracking-wide">EMMA DAVIS</h3>
      <div className="w-8 h-0.5 bg-slate-300 mx-auto my-2"></div>
      <p className="text-slate-500 text-[9px]">Marketing Manager</p>
      <div className="flex justify-center gap-4 mt-2 text-[7px] text-slate-400">
        <span>emma@email.com</span>
        <span>New York, NY</span>
      </div>
    </div>
    
    <p className="text-center text-slate-600 mb-4 max-w-[80%] mx-auto text-[7px]">
      Strategic marketing professional with expertise in digital campaigns and brand development.
    </p>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold text-[7px] uppercase tracking-widest text-slate-400 mb-2">Experience</h4>
        <p className="font-medium text-[8px]">Marketing Manager</p>
        <p className="text-slate-500 text-[7px]">Brand Co. · 2019 — Present</p>
      </div>
      <div>
        <h4 className="font-semibold text-[7px] uppercase tracking-widest text-slate-400 mb-2">Skills</h4>
        <div className="flex flex-wrap gap-1">
          {['SEO', 'Analytics', 'Copywriting'].map(skill => (
            <span key={skill} className="border border-slate-200 px-2 py-0.5 rounded-full text-[6px]">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Orbit Template - Creative with timeline
const OrbitTemplate = () => (
  <div className="h-full text-[7px] bg-gradient-to-br from-rose-50 to-orange-50 overflow-hidden">
    <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold border-2 border-white/50">
          MR
        </div>
        <div>
          <h3 className="font-bold text-[12px]">MAYA RODRIGUEZ</h3>
          <p className="text-rose-100 text-[8px]">UX Designer</p>
        </div>
      </div>
    </div>
    
    <div className="p-3">
      <div className="bg-white p-2 rounded-lg shadow-sm mb-2">
        <p className="text-slate-600 text-[7px]">Creative designer passionate about user-centered design.</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-white p-2 rounded-lg shadow-sm">
          <h4 className="font-bold text-[8px] text-rose-600 mb-1">💼 Experience</h4>
          <div className="border-l-2 border-rose-200 pl-2">
            <p className="font-semibold text-[8px]">Lead UX Designer</p>
            <p className="text-rose-500 text-[7px]">Design Studio</p>
          </div>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <h4 className="font-bold text-[8px] text-rose-600 mb-1">⚡ Skills</h4>
          <div className="flex flex-wrap gap-0.5">
            {['Figma', 'UI/UX'].map(skill => (
              <span key={skill} className="bg-rose-100 text-rose-600 px-1 py-0.5 rounded text-[6px]">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Executive Template - Corporate bold header
const ExecutiveTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="bg-slate-800 text-white p-3">
      <h3 className="font-bold text-[14px] tracking-wide">JAMES ANDERSON</h3>
      <p className="text-slate-300 text-[9px]">Senior Vice President</p>
      <div className="flex gap-3 mt-2 text-[7px] text-slate-400">
        <span>✉ james@exec.com</span>
        <span>📍 Chicago, IL</span>
      </div>
    </div>
    <div className="p-3">
      <div className="mb-3">
        <h4 className="font-bold text-[8px] uppercase tracking-wider text-slate-800 mb-1">Executive Summary</h4>
        <p className="text-slate-600">Senior executive with 15+ years driving growth and operational excellence.</p>
      </div>
      <div className="mb-2">
        <h4 className="font-bold text-[8px] uppercase tracking-wider text-slate-800 mb-1">Experience</h4>
        <div className="pl-2 border-l-2 border-slate-800">
          <p className="font-bold text-[8px]">Senior VP of Operations</p>
          <p className="text-slate-600">Global Corp · 2018 — Present</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-[8px] uppercase tracking-wider text-slate-800 mb-1">Core Competencies</h4>
        <div className="flex flex-wrap gap-1">
          {['Leadership', 'Strategy', 'P&L'].map(skill => (
            <span key={skill} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[6px]">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Modern Template - Two-column with timeline
const ModernPreviewTemplate = () => (
  <div className="h-full text-[7px] flex bg-white overflow-hidden">
    <div className="w-[40%] bg-slate-50 p-3">
      <div className="text-center mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-500 mx-auto mb-2 flex items-center justify-center text-white font-bold text-[12px]">AR</div>
        <h3 className="font-bold text-[10px]">ALEX RIVERA</h3>
        <p className="text-slate-500 text-[8px]">Full Stack Developer</p>
      </div>
      <div className="mb-3">
        <h4 className="font-bold text-[7px] uppercase text-blue-600 mb-1">Contact</h4>
        <p className="text-slate-600">📧 alex@dev.com</p>
        <p className="text-slate-600">📱 (555) 123-4567</p>
      </div>
      <div>
        <h4 className="font-bold text-[7px] uppercase text-blue-600 mb-1">Skills</h4>
        {['React', 'Node.js', 'Python'].map(skill => (
          <div key={skill} className="mb-1">
            <p className="text-[6px]">{skill}</p>
            <div className="h-1 bg-slate-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{width: '80%'}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 p-3">
      <h4 className="font-bold text-[8px] text-blue-600 mb-1">Work Experience</h4>
      <div className="relative pl-3 border-l-2 border-slate-200">
        <div className="absolute -left-1 top-0 w-2 h-2 rounded-full bg-blue-500"></div>
        <p className="font-bold text-[8px]">Senior Developer</p>
        <p className="text-slate-500 text-[7px]">Tech Corp | 2020 - Present</p>
        <p className="text-slate-600 mt-1">Led team of 5 developers.</p>
      </div>
    </div>
  </div>
);

// Classic Template - Traditional single-column
const ClassicPreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white p-4 overflow-hidden">
    <div className="text-center border-b-2 border-slate-800 pb-2 mb-3">
      <h3 className="font-serif font-bold text-[14px] text-slate-800">ROBERT THOMPSON</h3>
      <div className="flex justify-center gap-3 mt-1 text-slate-600 text-[7px]">
        <span>robert@email.com</span>
        <span>•</span>
        <span>(555) 987-6543</span>
        <span>•</span>
        <span>Boston, MA</span>
      </div>
    </div>
    <div className="mb-2">
      <h4 className="font-bold text-[8px] uppercase border-b border-slate-300 pb-1 mb-1 text-slate-800">Professional Summary</h4>
      <p className="text-slate-700">Experienced financial analyst with expertise in data modeling and forecasting.</p>
    </div>
    <div className="mb-2">
      <h4 className="font-bold text-[8px] uppercase border-b border-slate-300 pb-1 mb-1 text-slate-800">Experience</h4>
      <div className="flex justify-between">
        <p className="font-bold text-[8px]">Financial Analyst</p>
        <p className="text-slate-500 italic text-[7px]">2019 - Present</p>
      </div>
      <p className="text-slate-600 italic">Goldman Sachs, New York</p>
    </div>
    <div>
      <h4 className="font-bold text-[8px] uppercase border-b border-slate-300 pb-1 mb-1 text-slate-800">Skills</h4>
      <p className="text-slate-700">Excel • Financial Modeling • Python • SQL • Tableau</p>
    </div>
  </div>
);

// Minimalist Template - Ultra clean
const MinimalistPreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white p-5 overflow-hidden font-light">
    <div className="mb-4">
      <h3 className="font-light text-[16px] text-slate-900 tracking-tight">SARAH CHEN</h3>
      <p className="text-slate-400 text-[9px]">Product Designer</p>
      <div className="flex gap-4 mt-2 text-slate-400 text-[7px]">
        <span>sarah@design.io</span>
        <span>San Francisco</span>
      </div>
    </div>
    <p className="text-slate-500 mb-4 text-[7px]">Minimal design advocate creating elegant user experiences.</p>
    <div className="border-t border-slate-100 pt-3">
      <div className="mb-3">
        <h4 className="text-[6px] uppercase tracking-widest text-slate-400 mb-1">Experience</h4>
        <p className="font-medium text-[8px] text-slate-800">Lead Product Designer</p>
        <p className="text-slate-400">Minimal Inc. — 2020 - Present</p>
      </div>
      <div>
        <h4 className="text-[6px] uppercase tracking-widest text-slate-400 mb-1">Skills</h4>
        <p className="text-slate-500">Figma, Sketch, Prototyping, User Research</p>
      </div>
    </div>
  </div>
);

// Creative Template - Bold and colorful
const CreativePreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="relative h-16 bg-purple-600 overflow-hidden">
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-purple-400/50"></div>
      <div className="absolute inset-0 flex items-center px-3">
        <div className="text-white">
          <h3 className="font-black text-[12px]">JORDAN LEE</h3>
          <p className="text-purple-200 text-[8px]">Creative Director</p>
        </div>
      </div>
    </div>
    <div className="flex justify-center gap-4 py-1.5 bg-slate-100 text-slate-500 text-[6px]">
      <span>✉ jordan@creative.co</span>
      <span>📱 (555) 321-0987</span>
    </div>
    <div className="p-3">
      <div className="bg-purple-50 p-2 rounded-lg mb-2">
        <p className="text-slate-600 italic text-[7px]">"Award-winning creative bringing brands to life."</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <h4 className="font-bold text-[8px] text-purple-600 mb-1">💼 Experience</h4>
          <p className="font-semibold text-[8px]">Creative Director</p>
          <p className="text-purple-500 text-[7px]">Agency X • 2019 - Present</p>
        </div>
        <div className="bg-slate-50 p-1.5 rounded-lg">
          <h4 className="font-bold text-[7px] text-purple-600 mb-1">Skills</h4>
          {['Branding', 'Adobe'].map(skill => (
            <span key={skill} className="block bg-purple-600 text-white px-1 py-0.5 rounded text-[5px] mb-0.5 text-center">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Professional Template - Clean corporate
const ProfessionalPreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="p-3 border-b-4 border-blue-800">
      <h3 className="font-bold text-[14px] text-slate-800">MICHAEL BROWN</h3>
      <p className="text-slate-600 text-[9px]">Project Manager</p>
      <div className="flex gap-3 mt-1 text-slate-500 text-[7px]">
        <span>michael@corp.com</span>
        <span>|</span>
        <span>(555) 456-7890</span>
        <span>|</span>
        <span>Seattle, WA</span>
      </div>
    </div>
    <div className="flex">
      <div className="flex-1 p-3">
        <div className="mb-2">
          <h4 className="font-bold text-[7px] uppercase tracking-wider text-blue-800 border-b-2 border-blue-800 pb-0.5 mb-1">Profile</h4>
          <p className="text-slate-600">PMP certified manager with 10+ years experience.</p>
        </div>
        <div>
          <h4 className="font-bold text-[7px] uppercase tracking-wider text-blue-800 border-b-2 border-blue-800 pb-0.5 mb-1">Experience</h4>
          <p className="font-bold text-[8px]">Senior Project Manager</p>
          <p className="text-blue-600 text-[7px]">Microsoft, Seattle</p>
        </div>
      </div>
      <div className="w-[35%] p-3 bg-slate-50">
        <h4 className="font-bold text-[7px] uppercase text-blue-800 mb-1">Skills</h4>
        <ul className="space-y-0.5 text-slate-600">
          <li>• Agile/Scrum</li>
          <li>• Risk Management</li>
          <li>• Budgeting</li>
        </ul>
      </div>
    </div>
  </div>
);

// Nova Preview - ATS two-column
const NovaPreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="text-center py-2 border-b-2 border-blue-800">
      <h3 className="font-bold text-[12px] uppercase tracking-wider text-slate-800">TRAVIS WILLIS</h3>
      <p className="text-slate-600 text-[8px]">IT Manager</p>
      <div className="flex justify-center gap-2 mt-1 text-[6px] text-slate-500">
        <span>travis@email.com</span>
        <span>•</span>
        <span>(914) 479-6342</span>
      </div>
    </div>
    <div className="flex p-2">
      <div className="w-[30%] pr-2 border-r border-slate-200">
        <h4 className="font-bold text-[7px] text-blue-800 mb-1">SKILLS</h4>
        <div className="grid grid-cols-2 gap-0.5 text-[6px] text-slate-600">
          <span>Project Mgmt</span>
          <span>IT Support</span>
          <span>Leadership</span>
          <span>Technical</span>
        </div>
        <h4 className="font-bold text-[7px] text-blue-800 mt-2 mb-1">EDUCATION</h4>
        <p className="text-[6px]">New York University</p>
        <p className="text-[6px] text-slate-500">Master Computer Science</p>
      </div>
      <div className="flex-1 pl-2">
        <h4 className="font-bold text-[7px] text-blue-800 mb-1">EXPERIENCE</h4>
        <p className="font-semibold text-[7px]">IT Manager at Phylo Biometrics</p>
        <p className="text-[6px] text-slate-500">2013 - 2019</p>
        <p className="text-[6px] text-slate-600 mt-0.5">• Created business requirements</p>
        <p className="text-[6px] text-slate-600">• Increased productivity by 40%</p>
      </div>
    </div>
  </div>
);

// Eon Preview - ATS right sidebar
const EonPreviewTemplate = () => (
  <div className="h-full text-[7px] flex bg-white overflow-hidden">
    <div className="flex-1 p-3">
      <h3 className="font-bold text-[12px] text-slate-800">Matthew Jones</h3>
      <p className="text-[9px] text-blue-600">Financial Analyst</p>
      <div className="mt-2">
        <h4 className="font-bold text-[7px] text-slate-800 mb-1">• Summary</h4>
        <p className="text-[6px] text-slate-600 pl-2">Experienced Financial Analyst with expertise in data analysis.</p>
      </div>
      <div className="mt-2">
        <h4 className="font-bold text-[7px] text-slate-800 mb-1">• Experience</h4>
        <div className="pl-2">
          <p className="font-semibold text-[7px] text-blue-600">Financial Analyst</p>
          <p className="text-[6px] text-slate-500">GEO Corp • 2012 - 2018</p>
        </div>
      </div>
    </div>
    <div className="w-[30%] p-2 bg-slate-50">
      <h4 className="font-bold text-[7px] text-blue-600 mb-1">Details</h4>
      <p className="text-[6px] text-slate-600">MJones@email.com</p>
      <p className="text-[6px] text-slate-600">(917) 947-5112</p>
      <h4 className="font-bold text-[7px] text-blue-600 mt-2 mb-1">Skills</h4>
      <p className="text-[6px] text-slate-600">Financial Analysis</p>
      <p className="text-[6px] text-slate-600">Strategic Planning</p>
    </div>
  </div>
);

// Solstice Preview - ATS one-column
const SolsticePreviewTemplate = () => (
  <div className="h-full text-[7px] p-3 bg-white overflow-hidden">
    <div className="mb-2 border-b pb-2 border-slate-200">
      <h3 className="font-bold text-[14px] text-slate-800">Jessie Smith</h3>
      <p className="text-slate-600 text-[8px]">Human Resource Manager</p>
      <div className="flex gap-2 mt-1 text-[6px] text-slate-500">
        <span>New York, USA</span>
        <span>•</span>
        <span>(409) 385-2948</span>
        <span>•</span>
        <span>email@email.com</span>
      </div>
    </div>
    <div className="mb-2">
      <h4 className="font-bold text-[7px] text-slate-800 mb-0.5">Summary</h4>
      <p className="text-[6px] text-slate-600">Human resources generalist with 8 years of experience in HR.</p>
    </div>
    <div className="mb-2">
      <h4 className="font-bold text-[7px] text-slate-800 mb-0.5">Experience</h4>
      <div className="flex justify-between">
        <p className="font-semibold text-[7px]">Human Resource Manager</p>
        <p className="text-[6px] text-slate-500">2019 - Current</p>
      </div>
      <p className="text-[6px] text-slate-600">Jim's Widget Factory, Plano, TX</p>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <h4 className="font-bold text-[7px] text-slate-800 mb-0.5">Education</h4>
        <p className="text-[6px]">Master, Human Resources</p>
        <p className="text-[6px] text-slate-500">University of Texas</p>
      </div>
      <div>
        <h4 className="font-bold text-[7px] text-slate-800 mb-0.5">Skills</h4>
        <p className="text-[6px] text-slate-600">• Detail-oriented</p>
        <p className="text-[6px] text-slate-600">• Communication</p>
      </div>
    </div>
  </div>
);

// Zenith Preview - ATS minimal
const ZenithPreviewTemplate = () => (
  <div className="h-full text-[7px] p-4 bg-white overflow-hidden">
    <div className="text-center mb-3">
      <h3 className="font-light text-[16px] text-slate-800 tracking-wide">ANNA PETERSON</h3>
      <div className="w-10 h-0.5 bg-slate-400 mx-auto my-1.5"></div>
      <p className="text-slate-500 text-[8px]">Marketing Director</p>
      <div className="flex justify-center gap-3 mt-1 text-[6px] text-slate-400">
        <span>anna@email.com</span>
        <span>|</span>
        <span>Chicago, IL</span>
      </div>
    </div>
    <p className="text-center text-[6px] text-slate-600 mb-3">Strategic marketing leader with 10+ years experience.</p>
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-1 h-px bg-slate-200"></div>
      <h4 className="text-[6px] uppercase tracking-widest text-slate-500">Experience</h4>
      <div className="flex-1 h-px bg-slate-200"></div>
    </div>
    <p className="font-semibold text-[7px] text-center">Marketing Director</p>
    <p className="text-[6px] text-slate-500 text-center">Global Corp • 2018 - Present</p>
  </div>
);

// Apex Preview - ATS top border
const ApexPreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white border-t-4 border-emerald-600 overflow-hidden">
    <div className="p-3">
      <div className="flex justify-between items-start mb-2 pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-[12px] text-slate-800">DAVID CHEN</h3>
          <p className="text-[9px] text-slate-600">Software Engineer</p>
        </div>
        <div className="text-right text-[6px] text-slate-500">
          <p>david@email.com</p>
          <p>(555) 123-4567</p>
        </div>
      </div>
      <div className="mb-2 p-2 bg-slate-50 rounded">
        <p className="text-[6px] text-slate-600">Full-stack developer with 5+ years experience building scalable applications.</p>
      </div>
      <h4 className="font-bold text-[7px] text-emerald-600 border-b border-emerald-600 pb-0.5 mb-1">EXPERIENCE</h4>
      <p className="font-semibold text-[7px]">Senior Software Engineer</p>
      <p className="text-emerald-600 text-[6px]">Tech Corp</p>
      <p className="text-[6px] text-slate-600">• Led team of 5 developers</p>
    </div>
  </div>
);

// Horizon Preview - ATS with bars
const HorizonPreviewTemplate = () => (
  <div className="h-full text-[7px] flex bg-white overflow-hidden">
    <div className="w-[35%] p-2 bg-blue-50">
      <h3 className="font-bold text-[10px] text-slate-800">Lisa Wang</h3>
      <p className="text-[8px] text-blue-600">Product Manager</p>
      <div className="mt-2">
        <h4 className="font-bold text-[6px] text-blue-600 mb-1">Contact</h4>
        <p className="text-[6px]">📧 lisa@email.com</p>
        <p className="text-[6px]">📱 (555) 987-6543</p>
      </div>
      <div className="mt-2">
        <h4 className="font-bold text-[6px] text-blue-600 mb-1">Skills</h4>
        {['Agile', 'Scrum', 'Analytics'].map(skill => (
          <div key={skill} className="mb-1">
            <p className="text-[5px]">{skill}</p>
            <div className="h-1 bg-slate-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{width: '80%'}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 p-2">
      <h4 className="font-bold text-[6px] text-blue-600 mb-1">Profile</h4>
      <p className="text-[6px] text-slate-600 mb-2">Experienced PM driving product strategy.</p>
      <h4 className="font-bold text-[6px] text-blue-600 mb-1">Experience</h4>
      <div className="pl-2 border-l-2 border-blue-500">
        <p className="font-semibold text-[7px]">Senior PM</p>
        <p className="text-[6px] text-slate-500">Tech Inc • 2020 - Present</p>
      </div>
    </div>
  </div>
);

// Pinnacle Preview - ATS executive
const PinnaclePreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="p-3 bg-slate-800 text-white">
      <h3 className="font-bold text-[14px]">ROBERT WILLIAMS</h3>
      <p className="text-[9px] opacity-90">Chief Operations Officer</p>
      <div className="flex gap-3 mt-1 text-[6px] opacity-75">
        <span>robert@exec.com</span>
        <span>• Chicago, IL</span>
      </div>
    </div>
    <div className="p-3">
      <h4 className="font-bold text-[6px] uppercase tracking-widest text-slate-800 mb-1">Executive Profile</h4>
      <p className="text-[6px] text-slate-600 mb-2">C-level executive with 20+ years driving organizational growth.</p>
      <h4 className="font-bold text-[6px] uppercase tracking-widest text-slate-800 mb-1">Experience</h4>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-[7px]">Chief Operations Officer</p>
          <p className="text-slate-600 text-[6px]">Fortune 500 Corp</p>
        </div>
        <span className="text-[5px] bg-slate-100 px-1 py-0.5 rounded">2018 - Present</span>
      </div>
    </div>
  </div>
);

// Vertex Preview - ATS bold
const VertexPreviewTemplate = () => (
  <div className="h-full text-[7px] bg-white overflow-hidden">
    <div className="flex">
      <div className="w-1.5 bg-indigo-600"></div>
      <div className="flex-1 p-2">
        <h3 className="font-black text-[14px] text-slate-800">EMILY DAVIS</h3>
        <p className="text-[9px] font-medium text-indigo-600">Data Scientist</p>
        <div className="flex gap-2 mt-1 text-[6px] text-slate-500">
          <span>✉ emily@data.io</span>
          <span>📍 San Francisco</span>
        </div>
      </div>
    </div>
    <div className="p-2">
      <div className="mb-2 p-2 border-l-4 border-indigo-600 bg-indigo-50">
        <p className="text-[6px] text-slate-600">ML engineer with expertise in deep learning and NLP.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <h4 className="font-black text-[6px] text-indigo-600 mb-0.5">Experience</h4>
          <p className="font-bold text-[7px]">Senior Data Scientist</p>
          <p className="text-indigo-600 text-[6px]">AI Labs</p>
        </div>
        <div>
          <h4 className="font-black text-[6px] text-indigo-600 mb-0.5">Skills</h4>
          <p className="text-[6px]">• Python</p>
          <p className="text-[6px]">• TensorFlow</p>
        </div>
      </div>
    </div>
  </div>
);

const templates = [
  { 
    id: 'cosmos', 
    name: 'Cosmos', 
    category: ['all', 'professional', 'ats', 'simple'],
    component: KellyTemplate,
    description: 'Clean two-column professional layout'
  },
  { 
    id: 'celestial', 
    name: 'Celestial', 
    category: ['all', 'one-column', 'ats', 'professional'],
    component: HowardTemplate,
    description: 'Classic centered single-column design'
  },
  { 
    id: 'galaxy', 
    name: 'Galaxy', 
    category: ['all', 'with-photo', 'modern', 'professional'],
    component: SamanthaTemplate,
    description: 'Modern with photo sidebar'
  },
  { 
    id: 'aurora', 
    name: 'Aurora', 
    category: ['all', 'modern', 'professional'],
    component: JessieTemplate,
    description: 'Modern gradient header design'
  },
  { 
    id: 'lunar', 
    name: 'Lunar', 
    category: ['all', 'professional', 'simple'],
    component: WesTemplate,
    description: 'Two-column with colored sidebar'
  },
  { 
    id: 'eclipse', 
    name: 'Eclipse', 
    category: ['all', 'with-photo', 'simple'],
    component: SebastianTemplate,
    description: 'Entry-level with photo placeholder'
  },
  { 
    id: 'nebula', 
    name: 'Nebula', 
    category: ['all', 'modern', 'professional'],
    component: NebulaTemplate,
    description: 'Modern clean with accent line'
  },
  { 
    id: 'stellar', 
    name: 'Stellar', 
    category: ['all', 'simple', 'ats'],
    component: StellarTemplate,
    description: 'Minimal elegant design'
  },
  { 
    id: 'orbit', 
    name: 'Orbit', 
    category: ['all', 'modern', 'with-photo'],
    component: OrbitTemplate,
    description: 'Creative with timeline design'
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    category: ['all', 'professional', 'ats'],
    component: ExecutiveTemplate,
    description: 'Bold corporate executive style'
  },
  { 
    id: 'modern', 
    name: 'Modern', 
    category: ['all', 'modern', 'professional'],
    component: ModernPreviewTemplate,
    description: 'Two-column with skills progress'
  },
  { 
    id: 'classic', 
    name: 'Classic', 
    category: ['all', 'simple', 'ats', 'one-column'],
    component: ClassicPreviewTemplate,
    description: 'Traditional single-column format'
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    category: ['all', 'simple', 'modern'],
    component: MinimalistPreviewTemplate,
    description: 'Ultra clean minimal design'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    category: ['all', 'modern', 'with-photo'],
    component: CreativePreviewTemplate,
    description: 'Bold colors and unique layout'
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    category: ['all', 'professional', 'ats'],
    component: ProfessionalPreviewTemplate,
    description: 'Clean corporate professional'
  },
  { 
    id: 'nova', 
    name: 'Nova', 
    category: ['all', 'ats', 'professional'],
    component: NovaPreviewTemplate,
    description: 'ATS-optimized two-column layout'
  },
  { 
    id: 'eon', 
    name: 'Eon', 
    category: ['all', 'ats', 'simple'],
    component: EonPreviewTemplate,
    description: 'Clean ATS-friendly with sidebar'
  },
  { 
    id: 'solstice', 
    name: 'Solstice', 
    category: ['all', 'ats', 'one-column'],
    component: SolsticePreviewTemplate,
    description: 'ATS single-column professional'
  },
  { 
    id: 'zenith', 
    name: 'Zenith', 
    category: ['all', 'ats', 'simple', 'one-column'],
    component: ZenithPreviewTemplate,
    description: 'ATS minimal with elegant lines'
  },
  { 
    id: 'apex', 
    name: 'Apex', 
    category: ['all', 'ats', 'professional'],
    component: ApexPreviewTemplate,
    description: 'ATS professional with top border'
  },
  { 
    id: 'horizon', 
    name: 'Horizon', 
    category: ['all', 'ats', 'modern'],
    component: HorizonPreviewTemplate,
    description: 'ATS modern with skill bars'
  },
  { 
    id: 'pinnacle', 
    name: 'Pinnacle', 
    category: ['all', 'ats', 'professional'],
    component: PinnaclePreviewTemplate,
    description: 'ATS executive with bold header'
  },
  { 
    id: 'vertex', 
    name: 'Vertex', 
    category: ['all', 'ats', 'modern'],
    component: VertexPreviewTemplate,
    description: 'ATS bold with accent sidebar'
  },
];

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category.includes(selectedCategory);
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setShowModal(true);
    setUploadError(null);
  };

  const handleCreateNew = () => {
    setShowModal(false);
    // Clear existing data flag and go to builder
    localStorage.setItem('clearResumeData', 'true');
    navigate(`/builder?template=${selectedTemplateId}&new=true`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Advanced resume text parsing - extracts all sections properly
  const parseResumeText = (text: string) => {
    // Clean up the text
    const cleanText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n');
    
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    // Extract email - more comprehensive pattern
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extract phone - multiple formats including Indian numbers
    const phonePatterns = [
      /\+91[\s.-]?\d{10}/,
      /\+91[\s.-]?\d{5}[\s.-]?\d{5}/,
      /\+\d{1,3}[\s.-]?\d{10}/,
      /\d{10}/,
      /\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{4}/,
      /\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/,
      /\+\d{1,3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/
    ];
    let phone = '';
    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        phone = match[0];
        break;
      }
    }
    
    // Extract name - usually the first prominent line (before email/phone)
    let fullName = '';
    for (const line of lines.slice(0, 10)) {
      const cleanLine = line.replace(/[^\w\s]/g, '').trim();
      // Name should be 2-4 words, alphabetic, not too long
      if (
        cleanLine.length >= 3 && 
        cleanLine.length <= 50 &&
        !cleanLine.includes('@') && 
        !cleanLine.match(/^\d/) &&
        !cleanLine.match(/^\+/) &&
        cleanLine.split(' ').length >= 1 &&
        cleanLine.split(' ').length <= 4 &&
        /^[A-Za-z\s]+$/.test(cleanLine) &&
        !cleanLine.toLowerCase().includes('resume') &&
        !cleanLine.toLowerCase().includes('curriculum') &&
        !cleanLine.toLowerCase().includes('vitae')
      ) {
        fullName = cleanLine;
        break;
      }
    }
    
    // Extract job title / desired position
    let jobTitle = '';
    const titlePatterns = [
      /(?:software|senior|junior|lead|full[\s-]?stack|front[\s-]?end|back[\s-]?end|web|mobile|data|machine learning|ai|ml|devops|cloud|system|network|database|qa|test|ui[\s\/]ux|product|project|business|marketing|sales|hr|finance|operations|graphic|content)[\s\w]*(?:developer|engineer|designer|analyst|manager|specialist|consultant|architect|administrator|coordinator|executive|intern|trainee)/gi,
      /(?:developer|engineer|designer|analyst|manager|specialist|consultant|architect|administrator)/gi
    ];
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match) {
        jobTitle = match[0].trim();
        break;
      }
    }
    
    // Extract LinkedIn
    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9-]+)/i);
    const linkedin = linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : '';
    
    // Extract location
    let location = '';
    const locationPatterns = [
      /(?:location|address|city)[:\s]*([A-Za-z\s,]+(?:India|USA|UK|Canada|Australia)?)/i,
      /([A-Za-z]+),?\s*(?:Tamil Nadu|TN|Karnataka|KA|Maharashtra|MH|Delhi|Kerala|KL|Andhra Pradesh|AP|Telangana|TG|Gujarat|GJ|Rajasthan|RJ|West Bengal|WB|Punjab|PB|Haryana|HR|UP|MP|Bihar)/i,
      /([A-Za-z]+),?\s*(?:India|USA|UK|Canada|Australia)/i
    ];
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        location = match[0].replace(/(?:location|address|city)[:\s]*/i, '').trim();
        break;
      }
    }
    
    // Extract summary/objective/profile
    let summary = '';
    const summaryHeaders = ['summary', 'objective', 'profile', 'about me', 'career objective', 'professional summary'];
    const sectionHeaders = ['experience', 'education', 'skills', 'projects', 'work', 'employment', 'qualifications', 'certifications', 'achievements', 'awards'];
    
    for (const header of summaryHeaders) {
      const headerRegex = new RegExp(`(?:${header})[:\\s]*([\\s\\S]*?)(?=${sectionHeaders.join('|')}|$)`, 'i');
      const match = cleanText.match(headerRegex);
      if (match && match[1]) {
        summary = match[1].trim().substring(0, 500);
        break;
      }
    }
    
    // Extract skills - comprehensive extraction
    const skills: string[] = [];
    const skillHeaders = ['skills', 'technical skills', 'core competencies', 'technologies', 'tools', 'programming languages', 'frameworks', 'soft skills'];
    
    for (const header of skillHeaders) {
      const headerRegex = new RegExp(`(?:${header})[:\\s]*([\\s\\S]*?)(?=${sectionHeaders.join('|')}|$)`, 'i');
      const match = cleanText.match(headerRegex);
      if (match && match[1]) {
        const skillText = match[1];
        // Split by multiple delimiters
        const skillItems = skillText
          .split(/[,•·|;\n\r:]+/)
          .map(s => s.replace(/^\s*[-–—]\s*/, '').trim())
          .filter(s => s.length >= 2 && s.length <= 40)
          .filter(s => !s.match(/^(and|or|the|with|using|including|such as)$/i));
        skills.push(...skillItems);
      }
    }
    // Remove duplicates
    const uniqueSkills = [...new Set(skills)].slice(0, 20);
    
    // Extract experience - comprehensive extraction
    const experiences: { position: string; company: string; description: string; startDate: string; endDate: string }[] = [];
    const expRegex = /(?:experience|employment|work history)[:\s]*([\s\S]*?)(?=education|skills|projects|certifications|achievements|awards|$)/i;
    const expMatch = cleanText.match(expRegex);
    
    if (expMatch && expMatch[1]) {
      const expText = expMatch[1];
      
      // Try to find job entries with dates
      const jobEntryPattern = /([A-Za-z\s]+(?:Developer|Engineer|Designer|Analyst|Manager|Intern|Executive|Specialist|Coordinator|Lead|Director|Consultant|Trainee|Associate))[\s\S]*?(?:(\w+\s*\d{4})\s*[-–—]\s*(\w+\s*\d{4}|Present|Current|Till Date))/gi;
      let jobMatch;
      while ((jobMatch = jobEntryPattern.exec(expText)) !== null) {
        experiences.push({
          position: jobMatch[1].trim(),
          company: '',
          description: '',
          startDate: jobMatch[2] || '',
          endDate: jobMatch[3] || 'Present'
        });
      }
      
      // If no structured matches, try simpler pattern
      if (experiences.length === 0) {
        const simpleJobPattern = /([A-Z][a-zA-Z\s]*(?:Intern|Developer|Engineer|Designer|Analyst|Manager|Executive|Specialist|Trainee))/g;
        const jobs = expText.match(simpleJobPattern);
        if (jobs) {
          jobs.slice(0, 3).forEach(job => {
            experiences.push({
              position: job.trim(),
              company: '',
              description: '',
              startDate: '',
              endDate: 'Present'
            });
          });
        }
      }
    }
    
    // Extract education - comprehensive extraction
    const educations: { degree: string; school: string; field: string; startDate: string; endDate: string; grade: string }[] = [];
    const eduRegex = /(?:education|academic|qualifications?)[:\s]*([\s\S]*?)(?=experience|skills|projects|certifications|achievements|work|$)/i;
    const eduMatch = cleanText.match(eduRegex);
    
    if (eduMatch && eduMatch[1]) {
      const eduText = eduMatch[1];
      
      // Match degree patterns
      const degreePatterns = [
        /(Bachelor|Master|PhD|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Sc|M\.?Sc|B\.?A\.?|M\.?A\.?|MBA|BBA|BCA|MCA|B\.?Com|M\.?Com|Diploma|HSC|SSC|SSLC|12th|10th|Higher Secondary|Secondary)[\s\S]*?(?:(\d{4})\s*[-–—]\s*(\d{4}|Present|Current|Pursuing))?/gi,
      ];
      
      for (const pattern of degreePatterns) {
        let degMatch;
        while ((degMatch = pattern.exec(eduText)) !== null) {
          // Try to find school name near the degree
          const nearbyText = eduText.substring(Math.max(0, degMatch.index - 100), degMatch.index + degMatch[0].length + 100);
          const schoolMatch = nearbyText.match(/(?:College|University|Institute|School|Academy)[:\s,]*([A-Za-z\s,]+)/i);
          
          educations.push({
            degree: degMatch[1].trim(),
            school: schoolMatch ? schoolMatch[0].trim() : '',
            field: '',
            startDate: degMatch[2] || '',
            endDate: degMatch[3] || '',
            grade: ''
          });
        }
      }
      
      // Look for CGPA/Grade
      const gradeMatch = eduText.match(/(?:CGPA|GPA|Grade|Percentage)[:\s]*(\d+\.?\d*(?:\s*%)?)/i);
      if (gradeMatch && educations.length > 0) {
        educations[0].grade = gradeMatch[0];
      }
    }
    
    // Extract achievements
    const achievements: { title: string; description: string }[] = [];
    const achieveRegex = /(?:achievements?|awards?|honors?|accomplishments?)[:\s]*([\s\S]*?)(?=experience|education|skills|projects|certifications|$)/i;
    const achieveMatch = cleanText.match(achieveRegex);
    
    if (achieveMatch && achieveMatch[1]) {
      const achieveText = achieveMatch[1];
      const achieveItems = achieveText
        .split(/[•·\n\r]+/)
        .map(s => s.replace(/^\s*[-–—]\s*/, '').trim())
        .filter(s => s.length >= 10 && s.length <= 200);
      
      achieveItems.slice(0, 5).forEach(item => {
        achievements.push({ title: item.substring(0, 50), description: item });
      });
    }
    
    // Extract projects
    const projects: { name: string; description: string; technologies: string }[] = [];
    const projRegex = /(?:projects?)[:\s]*([\s\S]*?)(?=experience|education|skills|certifications|achievements|$)/i;
    const projMatch = cleanText.match(projRegex);
    
    if (projMatch && projMatch[1]) {
      const projText = projMatch[1];
      // Look for project names (usually capitalized or in bold patterns)
      const projItems = projText
        .split(/[•·\n\r]{2,}/)
        .map(s => s.trim())
        .filter(s => s.length >= 10);
      
      projItems.slice(0, 5).forEach(item => {
        const firstLine = item.split('\n')[0];
        projects.push({
          name: firstLine.substring(0, 50),
          description: item.substring(firstLine.length).trim(),
          technologies: ''
        });
      });
    }
    
    return { 
      fullName, 
      email, 
      phone, 
      linkedin,
      location,
      jobTitle,
      summary, 
      skills: uniqueSkills, 
      experiences, 
      educations,
      achievements,
      projects
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Use pdfjs-dist for proper PDF text extraction
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        text = fullText;
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        // For DOCX - extract XML content which contains text
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // DOCX is a ZIP file, look for text in document.xml
        let docxText = '';
        const textDecoder = new TextDecoder('utf-8');
        const fullContent = textDecoder.decode(uint8Array);
        
        // Extract text between XML tags
        const textMatches = fullContent.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
        if (textMatches) {
          docxText = textMatches
            .map(match => match.replace(/<[^>]+>/g, ''))
            .join(' ');
        }
        
        // Fallback: extract readable ASCII
        if (!docxText || docxText.length < 50) {
          docxText = '';
          for (let i = 0; i < uint8Array.length; i++) {
            if (uint8Array[i] >= 32 && uint8Array[i] <= 126) {
              docxText += String.fromCharCode(uint8Array[i]);
            } else if (uint8Array[i] === 10 || uint8Array[i] === 13) {
              docxText += '\n';
            }
          }
        }
        text = docxText;
      } else {
        throw new Error('Please upload a PDF, DOCX, or TXT file');
      }
      
      console.log('Extracted text:', text.substring(0, 500)); // Debug log
      
      if (text.length < 50) {
        throw new Error('Could not extract text from file. Please try a TXT file for best results.');
      }
      
      // Use AI to parse the resume
      console.log('Sending to AI for parsing...');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ai/parse-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'AI parsing failed');
      }
      
      const parsed = result.data;
      console.log('AI Parsed data:', parsed); // Debug log
      
      // Store parsed data in localStorage for Builder to load
      const uploadedData = {
        personalInfo: {
          fullName: parsed.fullName,
          email: parsed.email,
          phone: parsed.phone,
          linkedin: parsed.linkedin,
          location: parsed.location,
          summary: parsed.summary,
        },
        jobTitle: parsed.jobTitle,
        skills: parsed.skills,
        experiences: parsed.experiences,
        educations: parsed.educations,
        achievements: parsed.achievements,
        projects: parsed.projects,
        timestamp: Date.now()
      };
      
      localStorage.setItem('uploadedResumeData', JSON.stringify(uploadedData));
      
      setShowModal(false);
      navigate(`/builder?template=${selectedTemplateId}&uploaded=true`);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to parse resume. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUseTemplate = (templateId: string) => {
    handleTemplateClick(templateId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
              Resume templates
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-6">
              Simple to use and ready in minutes resume templates — give it a try for free now!
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </motion.div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => {
              const TemplateComponent = template.component;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-slate-700">
                    {/* Template Preview */}
                    <div className="aspect-[8.5/11] bg-white overflow-hidden">
                      <TemplateComponent />
                    </div>
                    
                    {/* Template Info */}
                    <div className="p-4 border-t dark:border-slate-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center transition-opacity duration-300 ${
                      hoveredTemplate === template.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}>
                      <Button
                        onClick={() => handleUseTemplate(template.id)}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-lg"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No templates found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Can't decide? You can always change your template later.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/builder')}
              className="px-8"
            >
              Start with blank resume
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Create New or Upload Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">How would you like to start?</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            {/* Create New Option */}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <FilePlus className="w-7 h-7" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Create New Resume</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start fresh with a blank template</p>
              </div>
            </button>

            {/* Upload Existing Option */}
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group disabled:opacity-50"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : (
                  <Upload className="w-7 h-7" />
                )}
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {isUploading ? 'Parsing Resume...' : 'Upload Existing Resume'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Import from PDF, DOCX, or TXT file
                </p>
              </div>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Error message */}
            {uploadError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              </div>
            )}

            {/* Info text */}
            <p className="text-xs text-center text-gray-400 mt-2">
              Uploading will extract your resume content and fill it into the selected template
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Templates;
