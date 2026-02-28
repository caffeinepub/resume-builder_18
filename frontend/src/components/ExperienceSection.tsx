import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Experience } from '../types/resume';
import { defaultExperience } from '../types/resume';

interface Props {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}

export function ExperienceSection({ items, onChange }: Props) {
  const update = (index: number, field: keyof Experience, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const add = () => onChange([...items, defaultExperience()]);

  const remove = (index: number) => {
    if (items.length === 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="relative p-4 rounded-lg border border-border bg-secondary/30 space-y-3">
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove experience"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Job Title</Label>
              <Input
                placeholder="e.g. Software Engineer"
                value={item.jobTitle}
                onChange={(e) => update(index, 'jobTitle', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input
                placeholder="e.g. Google"
                value={item.company}
                onChange={(e) => update(index, 'company', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Input
                placeholder="e.g. Jan 2022"
                value={item.startDate}
                onChange={(e) => update(index, 'startDate', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End Date</Label>
              <Input
                placeholder="e.g. Dec 2023 or Present"
                value={item.endDate}
                onChange={(e) => update(index, 'endDate', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description / Responsibilities</Label>
            <Textarea
              placeholder="Describe your key responsibilities and achievements..."
              rows={3}
              value={item.description}
              onChange={(e) => update(index, 'description', e.target.value)}
              className="resize-none"
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-4 h-4" />
        Add Experience
      </Button>
    </div>
  );
}
