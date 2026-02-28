import { useState, useCallback } from 'react';
import type { ResumeFormData, Project } from '@/types/resume';

const SKILL_LEVEL_MAP: Record<string, number> = {
  beginner: 1,
  elementary: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

function skillDots(level: string): string {
  const filled = SKILL_LEVEL_MAP[level?.toLowerCase()] ?? 3;
  return [1, 2, 3, 4, 5]
    .map(
      (i) =>
        `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${
          i <= filled ? '#1e40af' : '#dbeafe'
        };margin-right:3px;"></span>`
    )
    .join('');
}

async function toDataUrl(src: string): Promise<string> {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return src;
  }
}

function sectionHeader(title: string): string {
  return `
    <div style="margin:20px 0 8px 0;">
      <h2 style="font-size:14px;font-weight:700;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0;font-family:'Inter',system-ui,sans-serif;">${title}</h2>
      <div style="height:2px;background:#1e40af;border-radius:1px;"></div>
    </div>
  `;
}

export function useDownloadPDF(formData?: ResumeFormData) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadHTML = useCallback(async () => {
    if (!formData) return;

    setIsGenerating(true);

    try {
      const {
        personalInfo,
        education = [],
        experiences = [],
        skills = [],
        projects = [],
        certifications = [],
        profilePhotoUrl = '',
      } = formData;

      const name = personalInfo?.name ?? '';
      const email = personalInfo?.email ?? '';
      const phone = personalInfo?.phone ?? '';
      const address = personalInfo?.address ?? '';
      const summary = personalInfo?.summary ?? '';
      const linkedin = personalInfo?.linkedin ?? '';
      const github = personalInfo?.github ?? '';

      // Convert profile photo to base64 if present
      let photoDataUrl = '';
      if (profilePhotoUrl) {
        photoDataUrl = await toDataUrl(profilePhotoUrl);
      }

      const filledEducation = education.filter(
        (e) => e.degree || e.institution || e.major || e.graduationYear
      );
      const filledExperiences = experiences.filter(
        (e) => e.jobTitle || e.company || e.description
      );
      const filledSkills = skills.filter((s) => s.name);
      const filledProjects = projects.filter((p: Project) => p.name || p.description);
      const filledCertifications = certifications.filter((c) => c.name || c.issuer);

      // Build header section
      const photoHtml = photoDataUrl
        ? `<img src="${photoDataUrl}" alt="Profile" style="width:80px;height:80px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #dbeafe;" />`
        : '';

      const contactItems = [
        email ? `<span>✉ ${email}</span>` : '',
        phone ? `<span>📞 ${phone}</span>` : '',
        address ? `<span>📍 ${address}</span>` : '',
        linkedin ? `<span>🔗 <span style="color:#1d4ed8;">${linkedin}</span></span>` : '',
        github ? `<span>💻 <span style="color:#1d4ed8;">${github}</span></span>` : '',
      ]
        .filter(Boolean)
        .join('');

      const headerHtml = `
        <div style="display:flex;align-items:flex-start;gap:20px;margin-bottom:20px;border-bottom:2px solid #1e40af;padding-bottom:16px;">
          ${photoHtml}
          <div style="flex:1;">
            <h1 style="font-size:26px;font-weight:700;color:#1e3a8a;margin:0 0 6px 0;font-family:'Playfair Display',Georgia,serif;letter-spacing:-0.3px;">
              ${name || '<span style="color:#9ca3af;font-style:italic;">Your Name</span>'}
            </h1>
            <div style="display:flex;flex-wrap:wrap;gap:4px 16px;font-size:12px;color:#374151;">
              ${contactItems}
            </div>
          </div>
        </div>
      `;

      // Summary
      const summaryHtml = summary
        ? `
          ${sectionHeader('Professional Summary')}
          <p style="font-size:13px;color:#374151;line-height:1.6;margin:0;">${summary}</p>
        `
        : '';

      // Experience
      const experienceHtml =
        filledExperiences.length > 0
          ? `
          ${sectionHeader('Work Experience')}
          ${filledExperiences
            .map(
              (exp) => `
            <div style="margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;">
                <div>
                  <span style="font-size:13px;font-weight:700;color:#111827;">${exp.jobTitle || ''}</span>
                  ${exp.company ? `<span style="font-size:13px;color:#374151;"> · ${exp.company}</span>` : ''}
                </div>
                ${
                  exp.startDate || exp.endDate
                    ? `<span style="font-size:12px;color:#6b7280;">${exp.startDate || ''}${exp.startDate && exp.endDate ? ' – ' : ''}${exp.endDate || ''}</span>`
                    : ''
                }
              </div>
              ${exp.description ? `<p style="font-size:12px;color:#4b5563;margin:4px 0 0 0;line-height:1.5;">${exp.description.replace(/\n/g, '<br/>')}</p>` : ''}
            </div>
          `
            )
            .join('')}
        `
          : '';

      // Education
      const educationHtml =
        filledEducation.length > 0
          ? `
          ${sectionHeader('Education')}
          ${filledEducation
            .map(
              (edu) => `
            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;">
                <div>
                  <span style="font-size:13px;font-weight:700;color:#111827;">${edu.degree || ''}${edu.major ? ` in ${edu.major}` : ''}</span>
                  ${edu.institution ? `<span style="font-size:13px;color:#374151;"> · ${edu.institution}</span>` : ''}
                </div>
                ${edu.graduationYear ? `<span style="font-size:12px;color:#6b7280;">${edu.graduationYear}</span>` : ''}
              </div>
            </div>
          `
            )
            .join('')}
        `
          : '';

      // Skills
      const skillsHtml =
        filledSkills.length > 0
          ? `
          ${sectionHeader('Skills')}
          <div style="display:flex;flex-wrap:wrap;gap:8px 24px;">
            ${filledSkills
              .map(
                (skill) => `
              <div style="display:flex;align-items:center;gap:8px;min-width:160px;">
                <span style="font-size:12px;color:#374151;min-width:80px;">${skill.name}</span>
                <div style="display:flex;align-items:center;">${skillDots(skill.level)}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
          : '';

      // Projects
      const projectsHtml =
        filledProjects.length > 0
          ? `
          ${sectionHeader('Projects')}
          ${filledProjects
            .map(
              (proj: Project) => `
            <div style="margin-bottom:12px;">
              <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">
                <span style="font-size:13px;font-weight:700;color:#111827;">${proj.name || ''}</span>
                ${proj.techStack ? `<span style="font-size:11px;color:#6b7280;background:#f3f4f6;padding:1px 6px;border-radius:4px;">${proj.techStack}</span>` : ''}
                ${proj.link ? `<a href="${proj.link}" style="font-size:11px;color:#1d4ed8;">${proj.link}</a>` : ''}
              </div>
              ${proj.description ? `<p style="font-size:12px;color:#4b5563;margin:4px 0 0 0;line-height:1.5;">${proj.description}</p>` : ''}
            </div>
          `
            )
            .join('')}
        `
          : '';

      // Certifications
      const certificationsHtml =
        filledCertifications.length > 0
          ? `
          ${sectionHeader('Certifications')}
          ${filledCertifications
            .map(
              (cert) => `
            <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;">
              <div>
                <span style="font-size:13px;font-weight:700;color:#111827;">${cert.name || ''}</span>
                ${cert.issuer ? `<span style="font-size:12px;color:#374151;"> · ${cert.issuer}</span>` : ''}
              </div>
              <div style="font-size:12px;color:#6b7280;">
                ${cert.issueDate || ''}${cert.issueDate && cert.expiryDate ? ' – ' : ''}${cert.expiryDate || ''}
              </div>
            </div>
          `
            )
            .join('')}
        `
          : '';

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name ? `${name} – Resume` : 'Resume'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .resume-page {
      max-width: 794px;
      margin: 32px auto;
      background: #ffffff;
      padding: 40px 44px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      border-radius: 8px;
    }
    @media print {
      html, body { background: white; }
      .resume-page {
        margin: 0;
        box-shadow: none;
        border-radius: 0;
        padding: 24px 28px;
        max-width: 100%;
      }
      @page {
        size: A4;
        margin: 12mm 14mm;
      }
    }
  </style>
</head>
<body>
  <div class="resume-page">
    ${headerHtml}
    ${summaryHtml}
    ${experienceHtml}
    ${educationHtml}
    ${skillsHtml}
    ${projectsHtml}
    ${certificationsHtml}
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = name ? `${name.replace(/\s+/g, '_')}_resume.html` : 'resume.html';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error('HTML export failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [formData]);

  // Keep downloadPDF as alias for backward compatibility
  const downloadPDF = downloadHTML;

  return { downloadHTML, downloadPDF, isGenerating };
}
