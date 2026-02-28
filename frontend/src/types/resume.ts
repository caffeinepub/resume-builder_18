import type { PersonalInfo, Education, Experience, Skill, Certification, Resume } from '../backend';

export type { PersonalInfo, Education, Experience, Skill, Certification, Resume };

export interface ResumeFormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    jobTitle: string;
    linkedin: string;
    github: string;
    photoUrl?: string;
  };
  education: Education[];
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  profilePhotoUrl: string;
}

export interface Project {
  name: string;
  description: string;
  techStack: string;
  link: string;
}

export const defaultPersonalInfo = (): ResumeFormData['personalInfo'] => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  jobTitle: '',
  linkedin: '',
  github: '',
  photoUrl: '',
});

export const defaultEducation = (): Education => ({
  degree: '',
  institution: '',
  graduationYear: '',
  major: '',
});

export const defaultExperience = (): Experience => ({
  jobTitle: '',
  company: '',
  startDate: '',
  endDate: '',
  description: '',
});

export const defaultSkill = (): Skill => ({
  name: '',
  level: 'Intermediate',
});

export const defaultProject = (): Project => ({
  name: '',
  description: '',
  techStack: '',
  link: '',
});

export const defaultCertification = (): Certification => ({
  name: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
});

export const defaultResumeFormData = (): ResumeFormData => ({
  personalInfo: defaultPersonalInfo(),
  education: [defaultEducation()],
  experiences: [defaultExperience()],
  skills: [defaultSkill()],
  projects: [defaultProject()],
  certifications: [defaultCertification()],
  profilePhotoUrl: '',
});
