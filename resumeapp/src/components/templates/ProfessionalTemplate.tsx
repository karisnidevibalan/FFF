
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Link as LinkIcon, Award } from 'lucide-react';

interface TemplateProps {
    data: any;
    accentColor: { id: string; name: string; primary: string; secondary: string };
    isMonochrome: boolean;
}

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
    const primary = isMonochrome ? '#334155' : accentColor.primary;
    const secondary = isMonochrome ? '#f1f5f9' : accentColor.secondary;

    return (
        <div className="h-full flex flex-col font-sans text-slate-800 text-[11px]">
            {/* Header */}
            <div className="p-8 pb-6 border-b-4" style={{ borderColor: primary }}>
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-sm font-semibold tracking-widest uppercase mb-4 text-slate-500">
                    {data.experience[0]?.position || 'PROFESSIONAL TITLE'}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    {data.personalInfo.email && (
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{data.personalInfo.email}</span>
                        </div>
                    )}
                    {data.personalInfo.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{data.personalInfo.phone}</span>
                        </div>
                    )}
                    {data.personalInfo.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{data.personalInfo.location}</span>
                        </div>
                    )}
                    {data.personalInfo.linkedin && (
                        <div className="flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5" />
                            <span>{data.personalInfo.linkedin}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-1">
                {/* Left Column (Main) */}
                <div className="flex-1 p-8 pr-4 border-r border-slate-200">
                    {data.personalInfo.summary && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Professional Profile
                            </h3>
                            <p className="leading-relaxed text-slate-600">
                                {data.personalInfo.summary}
                            </p>
                        </div>
                    )}

                    {data.experience.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Work Experience
                            </h3>
                            <div className="space-y-4">
                                {data.experience.map((exp: any) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm">{exp.position}</h4>
                                            <span className="text-xs font-medium text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                        </div>
                                        <div className="text-xs font-semibold mb-2" style={{ color: primary }}>
                                            {exp.company} {exp.location && `| ${exp.location}`}
                                        </div>
                                        {exp.description && (
                                            <ul className="list-disc list-outside ml-3 space-y-1 text-slate-600 marker:text-slate-400">
                                                {exp.description.split('\n').map((line: string, i: number) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.projects.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Key Projects
                            </h3>
                            <div className="space-y-3">
                                {data.projects.map((proj: any) => (
                                    <div key={proj.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold">{proj.name}</h4>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] hover:underline text-blue-600">
                                                    <LinkIcon className="w-2.5 h-2.5" /> Link
                                                </a>
                                            )}
                                        </div>
                                        {proj.technologies && <div className="text-[10px] text-slate-500 mb-1 italic">{proj.technologies}</div>}
                                        <p className="text-slate-600 leading-snug">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                <div className="w-1/3 p-8 pl-4 bg-slate-50">
                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Core Competencies
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill: any) => (
                                    <span key={skill.id} className="bg-white border border-slate-200 px-2 py-1 rounded shadow-sm text-xs font-medium text-slate-700">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {data.education.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Education
                            </h3>
                            <div className="space-y-3">
                                {data.education.map((edu: any) => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold">{edu.school}</h4>
                                        <div className="text-slate-600">{edu.degree}</div>
                                        {edu.field && <div className="text-slate-500 italic">{edu.field}</div>}
                                        <div className="text-xs text-slate-400 mt-1">{edu.startDate} – {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications (New) */}
                    {data.certifications && data.certifications.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Certifications
                            </h3>
                            <div className="space-y-2">
                                {data.certifications.map((cert: any) => (
                                    <div key={cert.id}>
                                        <h4 className="font-semibold">{cert.name}</h4>
                                        <div className="text-slate-600 text-[10px]">{cert.issuer} • {cert.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages (New) */}
                    {data.languages && data.languages.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b border-slate-300" style={{ color: primary }}>
                                Languages
                            </h3>
                            <ul className="space-y-1">
                                {data.languages.map((lang: any) => (
                                    <li key={lang.id} className="flex justify-between text-slate-700">
                                        <span>{lang.language}</span>
                                        <span className="text-slate-500 text-[10px] italic">{lang.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTemplate;
