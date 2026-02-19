
import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Link as LinkIcon, BookOpen } from 'lucide-react';

interface TemplateProps {
    data: any;
    accentColor: { id: string; name: string; primary: string; secondary: string };
    isMonochrome: boolean;
}

const AcademicTemplate: React.FC<TemplateProps> = ({ data, accentColor, isMonochrome }) => {
    const primary = isMonochrome ? '#000000' : accentColor.primary;

    return (
        <div className="h-full flex flex-col font-serif text-slate-900 text-[11px] p-10 bg-white">
            {/* Header - Centered classic style */}
            <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
                <h1 className="text-3xl font-bold uppercase tracking-widest mb-3">
                    {data.personalInfo.fullName || 'YOUR NAME'}
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                    {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                </div>
            </div>

            {/* Education First for Academic */}
            {data.education.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">Education</h3>
                    <div className="space-y-3">
                        {data.education.map((edu: any) => (
                            <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-base">{edu.school}</div>
                                    <div className="italic">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                                </div>
                                <div className="text-right whitespace-nowrap">
                                    <div>{edu.startDate} – {edu.endDate}</div>
                                    {edu.gpa && <div className="text-slate-600 text-[10px]">GPA: {edu.gpa}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Research Experience (Projects mapped to this or custom section) */}
            {data.projects.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">Research Experience</h3>
                    <div className="space-y-4">
                        {data.projects.map((proj: any) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="font-bold">{proj.name}</h4>
                                    {proj.link && <a href={proj.link} className="text-blue-700 italic text-[10px] hover:underline">View Project</a>}
                                </div>
                                {proj.technologies && <div className="italic text-slate-600 text-[10px] mb-1">Keywords: {proj.technologies}</div>}
                                <p className="text-justify leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Publications (New) */}
            {data.publications && data.publications.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">Publications</h3>
                    <ul className="list-decimal list-outside ml-4 space-y-2">
                        {data.publications.map((pub: any) => (
                            <li key={pub.id} className="pl-1">
                                <span className="font-semibold">{pub.title}</span>. {pub.publisher}, {pub.date}.
                                {pub.link && <a href={pub.link} className="ml-1 text-blue-700 hover:underline">[Link]</a>}
                                {pub.description && <div className="text-slate-600 italic mt-0.5">{pub.description}</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Teaching/Work Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">Professional & Teaching Experience</h3>
                    <div className="space-y-4">
                        {data.experience.map((exp: any) => (
                            <div key={exp.id}>
                                <div className="flex justify-between font-bold">
                                    <span>{exp.company}, {exp.location}</span>
                                    <span>{exp.startDate} – {exp.endDate || 'Present'}</span>
                                </div>
                                <div className="italic mb-1">{exp.position}</div>
                                {exp.description && (
                                    <ul className="list-disc list-outside ml-4 text-justify">
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

            {/* Skills & Languages */}
            <div className="mb-6">
                <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">Skills & Languages</h3>
                <div className="grid grid-cols-2 gap-8">
                    {data.skills.length > 0 && (
                        <div>
                            <h4 className="font-bold text-xs mb-1 uppercase">Technical Skills</h4>
                            <p className="leading-relaxed">
                                {data.skills.map((s: any) => s.name).join(', ')}
                            </p>
                        </div>
                    )}
                    {data.languages && data.languages.length > 0 && (
                        <div>
                            <h4 className="font-bold text-xs mb-1 uppercase">Languages</h4>
                            <ul className="list-none">
                                {data.languages.map((l: any) => (
                                    <li key={l.id}>{l.language} ({l.proficiency})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Certifications & Awards */}
            {(data.achievements.length > 0 || (data.certifications && data.certifications.length > 0)) && (
                <div className="mb-6">
                    <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">Awards & Certifications</h3>
                    <ul className="list-none space-y-1">
                        {data.achievements.map((ach: any) => (
                            <li key={ach.id} className="flex gap-2">
                                <span className="font-bold min-w-[80px]">{ach.date}</span>
                                <span>{ach.title} {ach.description && `- ${ach.description}`}</span>
                            </li>
                        ))}
                        {data.certifications && data.certifications.map((cert: any) => (
                            <li key={cert.id} className="flex gap-2">
                                <span className="font-bold min-w-[80px]">{cert.date}</span>
                                <span>{cert.name} - {cert.issuer}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Custom Sections */}
            {data.customSections?.map((section: any) => (
                section.items.length > 0 && (
                    <div key={section.id} className="mb-6">
                        <h3 className="text-sm font-bold uppercase border-b border-slate-400 mb-3 pb-1">{section.title}</h3>
                        <ul className="list-disc list-outside ml-4">
                            {section.items.map((item: any) => (
                                <li key={item.id}>{item.content}</li>
                            ))}
                        </ul>
                    </div>
                )
            ))}

        </div>
    );
};

export default AcademicTemplate;
