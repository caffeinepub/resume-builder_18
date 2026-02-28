import { useState, useEffect, useRef, useCallback } from 'react';
import { getOrCreateSessionToken } from '../utils/sessionToken';
import { useGetResume, useSaveResume } from './useQueries';
import type { ResumeFormData, Project } from '../types/resume';
import { defaultResumeFormData } from '../types/resume';
import type { Resume } from '../backend';
import type { Project as BackendProject } from '../backend';

/**
 * Map a backend Project (title, technologies[]) → local Project (name, techStack string)
 */
function backendProjectToLocal(p: BackendProject): Project {
  return {
    name: p.title ?? '',
    description: p.description ?? '',
    techStack: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
    link: p.link ?? '',
  };
}

/**
 * Map a local Project (name, techStack string) → backend Project (title, technologies[])
 */
function localProjectToBackend(p: Project): BackendProject {
  return {
    title: p.name,
    description: p.description,
    technologies: p.techStack
      ? p.techStack.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    link: p.link || undefined,
  };
}

function resumeToFormData(resume: Resume): ResumeFormData {
  return {
    personalInfo: {
      name: resume.personalInfo.name ?? '',
      jobTitle: '',
      email: resume.personalInfo.email ?? '',
      phone: resume.personalInfo.phone ?? '',
      address: resume.personalInfo.address ?? '',
      summary: resume.personalInfo.summary ?? '',
      linkedin: resume.personalInfo.linkedin ?? '',
      github: resume.personalInfo.github ?? '',
      photoUrl: resume.personalInfo.photoUrl ?? '',
    },
    education: (resume.education ?? []).map((e) => ({
      degree: e.degree ?? '',
      major: e.major ?? '',
      institution: e.institution ?? '',
      graduationYear: e.graduationYear ?? '',
    })),
    experiences: (resume.experiences ?? []).map((e) => ({
      jobTitle: e.jobTitle ?? '',
      company: e.company ?? '',
      startDate: e.startDate ?? '',
      endDate: e.endDate ?? '',
      description: e.description ?? '',
    })),
    skills: (resume.skills ?? []).map((s) => ({
      name: s.name ?? '',
      level: s.level ?? 'Intermediate',
    })),
    projects: (resume.projects ?? []).map(backendProjectToLocal),
    certifications: (resume.certifications ?? []).map((c) => ({
      name: c.name ?? '',
      issuer: c.issuer ?? '',
      issueDate: c.issueDate ?? '',
      expiryDate: c.expiryDate ?? '',
    })),
    profilePhotoUrl: resume.personalInfo.photoUrl ?? '',
  };
}

function formDataToResume(formData: ResumeFormData): Resume {
  const now = BigInt(Date.now());
  return {
    personalInfo: {
      name: formData.personalInfo.name,
      email: formData.personalInfo.email,
      phone: formData.personalInfo.phone,
      address: formData.personalInfo.address,
      summary: formData.personalInfo.summary,
      photoUrl: formData.profilePhotoUrl || undefined,
      linkedin: formData.personalInfo.linkedin || undefined,
      github: formData.personalInfo.github || undefined,
    },
    education: formData.education.map((e) => ({
      degree: e.degree,
      major: e.major,
      institution: e.institution,
      graduationYear: e.graduationYear,
    })),
    experiences: formData.experiences.map((e) => ({
      jobTitle: e.jobTitle,
      company: e.company,
      startDate: e.startDate,
      endDate: e.endDate,
      description: e.description,
    })),
    skills: formData.skills.map((s) => ({
      name: s.name,
      level: s.level,
    })),
    projects: formData.projects.map(localProjectToBackend),
    certifications: formData.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      expiryDate: c.expiryDate,
    })),
    createdAt: now,
    updatedAt: now,
  };
}

const LOCAL_STORAGE_KEY = 'resume_form_data';

function loadFromLocalStorage(): ResumeFormData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeFormData;
    // Ensure all required fields exist with proper defaults (handles old stored data)
    const defaults = defaultResumeFormData();
    return {
      ...defaults,
      ...parsed,
      personalInfo: {
        ...defaults.personalInfo,
        ...(parsed.personalInfo ?? {}),
        // Ensure optional fields are strings, not undefined
        linkedin: parsed.personalInfo?.linkedin ?? '',
        github: parsed.personalInfo?.github ?? '',
        photoUrl: parsed.personalInfo?.photoUrl ?? '',
      },
      education: parsed.education?.length ? parsed.education : defaults.education,
      experiences: parsed.experiences?.length ? parsed.experiences : defaults.experiences,
      skills: parsed.skills?.length ? parsed.skills : defaults.skills,
      projects: parsed.projects?.length ? parsed.projects : defaults.projects,
      certifications: parsed.certifications?.length ? parsed.certifications : defaults.certifications,
    };
  } catch {
    return null;
  }
}

function saveToLocalStorage(data: ResumeFormData) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useResumeData() {
  // Always create/get the session token (never null)
  const sessionToken = getOrCreateSessionToken();

  const { data: backendResume, isLoading: isLoadingResume } = useGetResume(sessionToken);
  const saveResumeMutation = useSaveResume(sessionToken);

  const [resumeData, setResumeDataState] = useState<ResumeFormData>(() => {
    return loadFromLocalStorage() ?? defaultResumeFormData();
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedFromBackend = useRef(false);

  // Load from backend once on mount
  useEffect(() => {
    if (backendResume && !hasLoadedFromBackend.current) {
      hasLoadedFromBackend.current = true;
      const formData = resumeToFormData(backendResume);
      setResumeDataState(formData);
      saveToLocalStorage(formData);
    }
  }, [backendResume]);

  const setResumeData = useCallback(
    (updater: ResumeFormData | ((prev: ResumeFormData) => ResumeFormData)) => {
      setResumeDataState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        saveToLocalStorage(next);
        return next;
      });
    },
    []
  );

  // Debounced auto-save to backend
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const resumePayload = formDataToResume(resumeData);
      setIsSaving(true);
      saveResumeMutation.mutate(resumePayload, {
        onSuccess: () => {
          setIsSaving(false);
          setLastSaved(new Date());
        },
        onError: () => {
          setIsSaving(false);
        },
      });
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [resumeData]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveNow = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    const resumePayload = formDataToResume(resumeData);
    setIsSaving(true);
    saveResumeMutation.mutate(resumePayload, {
      onSuccess: () => {
        setIsSaving(false);
        setLastSaved(new Date());
      },
      onError: () => {
        setIsSaving(false);
      },
    });
  }, [resumeData, saveResumeMutation]);

  return {
    resumeData,
    setResumeData,
    isSaving,
    lastSaved,
    isLoadingResume,
    saveNow,
  };
}
