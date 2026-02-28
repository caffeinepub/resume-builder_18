import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Education } from '../types/resume';
import { defaultEducation } from '../types/resume';

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

export function EducationSection({ items, onChange }: Props) {
  const update = (index: number, field: keyof Education, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const add = () => onChange([...items, defaultEducation()]);

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
              aria-label="Remove education"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Degree / Qualification</Label>
              <Input
                placeholder="e.g. Bachelor of Science"
                value={item.degree}
                onChange={(e) => update(index, 'degree', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Major / Field of Study</Label>
              <Input
                placeholder="e.g. Computer Science"
                value={item.major}
                onChange={(e) => update(index, 'major', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Institution</Label>
              <Input
                placeholder="e.g. MIT"
                value={item.institution}
                onChange={(e) => update(index, 'institution', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Graduation Year</Label>
              <Input
                placeholder="e.g. 2024"
                value={item.graduationYear}
                onChange={(e) => update(index, 'graduationYear', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-4 h-4" />
        Add Education
      </Button>
    </div>
  );
}
