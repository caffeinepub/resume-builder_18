import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, GraduationCap, Briefcase, Wrench, FolderOpen, Award } from 'lucide-react';
import { ProfilePhotoSection } from './ProfilePhotoSection';
import { PersonalInfoSection } from './PersonalInfoSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { CertificationsSection } from './CertificationsSection';
import type { ResumeFormData } from '../types/resume';

interface Props {
  formData: ResumeFormData;
  onChange: (updater: (prev: ResumeFormData) => ResumeFormData) => void;
}

const sectionTitleStyle = { color: 'oklch(0.15 0.03 240)' };

export function ResumeForm({ formData, onChange }: Props) {
  const [openSections, setOpenSections] = useState<string[]>(['personal']);

  return (
    <div className="space-y-3">
      {/* Profile Photo */}
      <div className="bg-card rounded-xl border border-border shadow-card p-5">
        <ProfilePhotoSection
          photoUrl={formData.profilePhotoUrl}
          onChange={(url) => onChange((prev) => ({ ...prev, profilePhotoUrl: url }))}
        />
      </div>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="space-y-2"
      >
        {/* Personal Info */}
        <AccordionItem value="personal" className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2.5 font-semibold text-sm" style={sectionTitleStyle}>
              <User className="w-4 h-4" style={{ color: 'oklch(0.45 0.18 240)' }} />
              Personal Info
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-1">
            <PersonalInfoSection
              data={formData.personalInfo}
              onChange={(data) => onChange((prev) => ({ ...prev, personalInfo: data }))}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2.5 font-semibold text-sm" style={sectionTitleStyle}>
              <GraduationCap className="w-4 h-4" style={{ color: 'oklch(0.45 0.18 240)' }} />
              Education
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-1">
            <EducationSection
              items={formData.education}
              onChange={(items) => onChange((prev) => ({ ...prev, education: items }))}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience */}
        <AccordionItem value="experience" className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2.5 font-semibold text-sm" style={sectionTitleStyle}>
              <Briefcase className="w-4 h-4" style={{ color: 'oklch(0.45 0.18 240)' }} />
              Work Experience
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-1">
            <ExperienceSection
              items={formData.experiences}
              onChange={(items) => onChange((prev) => ({ ...prev, experiences: items }))}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2.5 font-semibold text-sm" style={sectionTitleStyle}>
              <Wrench className="w-4 h-4" style={{ color: 'oklch(0.45 0.18 240)' }} />
              Skills
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-1">
            <SkillsSection
              items={formData.skills}
              onChange={(items) => onChange((prev) => ({ ...prev, skills: items }))}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2.5 font-semibold text-sm" style={sectionTitleStyle}>
              <FolderOpen className="w-4 h-4" style={{ color: 'oklch(0.45 0.18 240)' }} />
              Projects
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-1">
            <ProjectsSection
              items={formData.projects}
              onChange={(items) => onChange((prev) => ({ ...prev, projects: items }))}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications" className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-secondary/40 transition-colors">
            <span className="flex items-center gap-2.5 font-semibold text-sm" style={sectionTitleStyle}>
              <Award className="w-4 h-4" style={{ color: 'oklch(0.45 0.18 240)' }} />
              Certifications
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 pt-1">
            <CertificationsSection
              items={formData.certifications}
              onChange={(items) => onChange((prev) => ({ ...prev, certifications: items }))}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
