import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Certification {
    issueDate: string;
    expiryDate: string;
    name: string;
    issuer: string;
}
export interface Skill {
    name: string;
    level: string;
}
export interface Experience {
    endDate: string;
    description: string;
    company: string;
    jobTitle: string;
    startDate: string;
}
export interface Education {
    major: string;
    institution: string;
    graduationYear: string;
    degree: string;
}
export interface PersonalInfo {
    linkedin?: string;
    name: string;
    photoUrl?: string;
    email: string;
    summary: string;
    address: string;
    phone: string;
    github?: string;
}
export interface Project {
    title: string;
    link?: string;
    description: string;
    technologies: Array<string>;
}
export interface Resume {
    projects: Array<Project>;
    createdAt: bigint;
    education: Array<Education>;
    updatedAt: bigint;
    experiences: Array<Experience>;
    certifications: Array<Certification>;
    personalInfo: PersonalInfo;
    skills: Array<Skill>;
}
export interface backendInterface {
    deleteResume(sessionToken: string): Promise<void>;
    getResume(sessionToken: string): Promise<Resume>;
    saveResume(sessionToken: string, resume: Resume): Promise<void>;
}
