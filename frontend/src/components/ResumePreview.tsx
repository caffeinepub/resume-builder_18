import React from 'react';
import type { ResumeFormData, Project } from '@/types/resume';

interface ResumePreviewProps {
  formData: ResumeFormData;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

const SKILL_LEVEL_MAP: Record<string, number> = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

function SkillBar({ level }: { level: string }) {
  const filled = SKILL_LEVEL_MAP[level?.toLowerCase()] ?? 3;
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: i <= filled ? '#1e40af' : '#dbeafe',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: '13px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#1e3a8a',
        margin: '0 0 8px 0',
        borderBottom: '2px solid #1e40af',
        paddingBottom: '3px',
      }}
    >
      {children}
    </h2>
  );
}

function PlaceholderBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: '#9ca3af',
        fontStyle: 'italic',
        border: '1px dashed #d1d5db',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
      }}
    >
      {children}
    </div>
  );
}

export function ResumePreview({ formData, previewRef }: ResumePreviewProps) {
  const {
    personalInfo,
    education = [],
    experiences = [],
    skills = [],
    projects = [],
    certifications = [],
    profilePhotoUrl = '',
  } = formData || {};

  const name = personalInfo?.name ?? '';
  const email = personalInfo?.email ?? '';
  const phone = personalInfo?.phone ?? '';
  const address = personalInfo?.address ?? '';
  const summary = personalInfo?.summary ?? '';
  const linkedin = personalInfo?.linkedin ?? '';
  const github = personalInfo?.github ?? '';

  const hasName = name.trim().length > 0;
  const hasContact = !!(email || phone || address || linkedin || github);
  const hasSummary = summary.trim().length > 0;
  const hasEducation = education.some((e) => e.degree || e.institution || e.major || e.graduationYear);
  const hasExperience = experiences.some((e) => e.jobTitle || e.company || e.description);
  const hasSkills = skills.some((s) => s.name);
  const hasProjects = projects.some((p) => p.name || p.description);
  const hasCertifications = certifications.some((c) => c.name || c.issuer);

  const filledEducation = education.filter((e) => e.degree || e.institution || e.major || e.graduationYear);
  const filledExperiences = experiences.filter((e) => e.jobTitle || e.company || e.description);
  const filledSkills = skills.filter((s) => s.name);
  const filledProjects = projects.filter((p: Project) => p.name || p.description);
  const filledCertifications = certifications.filter((c) => c.name || c.issuer);

  return (
    <div
      id="resume-preview-container"
      ref={previewRef}
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#111827',
        backgroundColor: '#ffffff',
        padding: '32px 36px',
        maxWidth: '794px',
        margin: '0 auto',
        minHeight: '1000px',
      }}
    >
      {/* Header: Photo + Name + Contact */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          marginBottom: '20px',
          borderBottom: '2px solid #1e40af',
          paddingBottom: '16px',
        }}
      >
        {/* Profile Photo */}
        {profilePhotoUrl && (
          <img
            src={profilePhotoUrl}
            alt="Profile"
            crossOrigin="anonymous"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              border: '2px solid #dbeafe',
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          {/* Name */}
          <h1
            style={{
              fontSize: '26px',
              fontWeight: '700',
              color: '#1e3a8a',
              margin: '0 0 6px 0',
              fontFamily: "'Playfair Display', Georgia, serif",
              letterSpacing: '-0.3px',
            }}
          >
            {hasName ? name : <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Your Name</span>}
          </h1>

          {/* Contact Info */}
          {hasContact ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px 16px',
                fontSize: '12px',
                color: '#374151',
              }}
            >
              {email && <span>✉ {email}</span>}
              {phone && <span>📞 {phone}</span>}
              {address && <span>📍 {address}</span>}
              {linkedin && (
                <span>
                  🔗 <span style={{ color: '#1d4ed8' }}>{linkedin}</span>
                </span>
              )}
              {github && (
                <span>
                  💻 <span style={{ color: '#1d4ed8' }}>{github}</span>
                </span>
              )}
            </div>
          ) : (
            <div
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                fontStyle: 'italic',
                border: '1px dashed #d1d5db',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
              }}
            >
              Contact information will appear here
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <section style={{ marginBottom: '18px' }}>
        <SectionHeading>Professional Summary</SectionHeading>
        {hasSummary ? (
          <p style={{ margin: 0, color: '#374151', lineHeight: '1.6' }}>{summary}</p>
        ) : (
          <PlaceholderBox>Your professional summary will appear here...</PlaceholderBox>
        )}
      </section>

      {/* Experience */}
      <section style={{ marginBottom: '18px' }}>
        <SectionHeading>Work Experience</SectionHeading>
        {hasExperience ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filledExperiences.map((exp, i) => (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '2px',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                      {exp.jobTitle || 'Job Title'}
                    </span>
                    {exp.company && (
                      <span style={{ color: '#4b5563', fontSize: '12px' }}> · {exp.company}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {exp.startDate && exp.endDate
                      ? `${exp.startDate} – ${exp.endDate}`
                      : exp.startDate || exp.endDate || ''}
                  </span>
                </div>
                {exp.description && (
                  <p style={{ margin: '2px 0 0 0', color: '#374151', fontSize: '12px', lineHeight: '1.5' }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <PlaceholderBox>Work experience entries will appear here...</PlaceholderBox>
        )}
      </section>

      {/* Education */}
      <section style={{ marginBottom: '18px' }}>
        <SectionHeading>Education</SectionHeading>
        {hasEducation ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filledEducation.map((edu, i) => (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                      {edu.degree || 'Degree'}
                      {edu.major ? ` in ${edu.major}` : ''}
                    </span>
                    {edu.institution && (
                      <span style={{ color: '#4b5563', fontSize: '12px' }}> · {edu.institution}</span>
                    )}
                  </div>
                  {edu.graduationYear && (
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{edu.graduationYear}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PlaceholderBox>Education entries will appear here...</PlaceholderBox>
        )}
      </section>

      {/* Skills */}
      <section style={{ marginBottom: '18px' }}>
        <SectionHeading>Skills</SectionHeading>
        {hasSkills ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px 24px',
            }}
          >
            {filledSkills.map((skill, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#374151', fontSize: '12px' }}>{skill.name}</span>
                <SkillBar level={skill.level} />
              </div>
            ))}
          </div>
        ) : (
          <PlaceholderBox>Skills will appear here...</PlaceholderBox>
        )}
      </section>

      {/* Projects */}
      {hasProjects && (
        <section style={{ marginBottom: '18px' }}>
          <SectionHeading>Projects</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filledProjects.map((proj: Project, i: number) => (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '2px',
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                    {proj.name || 'Project Name'}
                  </span>
                  {proj.link && (
                    <span style={{ fontSize: '11px', color: '#1d4ed8' }}>{proj.link}</span>
                  )}
                </div>
                {proj.techStack && (
                  <div style={{ marginBottom: '2px' }}>
                    {proj.techStack.split(',').map((tech, ti) => (
                      <span
                        key={ti}
                        style={{
                          display: 'inline-block',
                          fontSize: '10px',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          marginRight: '4px',
                          marginBottom: '2px',
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {proj.description && (
                  <p style={{ margin: 0, color: '#374151', fontSize: '12px', lineHeight: '1.5' }}>
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications && (
        <section style={{ marginBottom: '18px' }}>
          <SectionHeading>Certifications</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filledCertifications.map((cert, i) => (
              <div
                key={i}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
              >
                <div>
                  <span style={{ fontWeight: '600', color: '#111827', fontSize: '13px' }}>
                    {cert.name || 'Certification Name'}
                  </span>
                  {cert.issuer && (
                    <span style={{ color: '#4b5563', fontSize: '12px' }}> · {cert.issuer}</span>
                  )}
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {cert.issueDate}
                  {cert.expiryDate ? ` – ${cert.expiryDate}` : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
