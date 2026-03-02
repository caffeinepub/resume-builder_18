import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiLinkedin, SiGithub } from 'react-icons/si';
import type { ResumeFormData } from '../types/resume';

interface Props {
  data: ResumeFormData['personalInfo'];
  onChange: (data: ResumeFormData['personalInfo']) => void;
}

export function PersonalInfoSection({ data, onChange }: Props) {
  const update = (field: keyof ResumeFormData['personalInfo'], value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pi-name">Full Name *</Label>
          <Input
            id="pi-name"
            placeholder="e.g. Jane Smith"
            value={data.name ?? ''}
            onChange={(e) => update('name', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-jobtitle">Job Title / Role</Label>
          <Input
            id="pi-jobtitle"
            placeholder="e.g. Software Engineer"
            value={data.jobTitle ?? ''}
            onChange={(e) => update('jobTitle', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-email">Email Address</Label>
          <Input
            id="pi-email"
            type="email"
            placeholder="jane@example.com"
            value={data.email ?? ''}
            onChange={(e) => update('email', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-phone">Phone Number</Label>
          <Input
            id="pi-phone"
            placeholder="+1 (555) 000-0000"
            value={data.phone ?? ''}
            onChange={(e) => update('phone', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="pi-address">Address / Location</Label>
          <Input
            id="pi-address"
            placeholder="City, State, Country"
            value={data.address ?? ''}
            onChange={(e) => update('address', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pi-summary">Professional Summary</Label>
        <Textarea
          id="pi-summary"
          placeholder="A brief summary of your professional background and goals..."
          rows={3}
          value={data.summary ?? ''}
          onChange={(e) => update('summary', e.target.value)}
          className="resize-none border border-border bg-white text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pi-linkedin" className="flex items-center gap-1.5">
            <SiLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
            LinkedIn URL
          </Label>
          <Input
            id="pi-linkedin"
            placeholder="https://linkedin.com/in/username"
            value={data.linkedin ?? ''}
            onChange={(e) => update('linkedin', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pi-github" className="flex items-center gap-1.5">
            <SiGithub className="w-3.5 h-3.5" />
            GitHub URL
          </Label>
          <Input
            id="pi-github"
            placeholder="https://github.com/username"
            value={data.github ?? ''}
            onChange={(e) => update('github', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
