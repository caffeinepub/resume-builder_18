import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Project } from '../types/resume';
import { defaultProject } from '../types/resume';

interface Props {
  items: Project[];
  onChange: (items: Project[]) => void;
}

export function ProjectsSection({ items, onChange }: Props) {
  const update = (index: number, field: keyof Project, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const add = () => onChange([...items, defaultProject()]);

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
              aria-label="Remove project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Project Name</Label>
              <Input
                placeholder="e.g. Portfolio Website"
                value={item.name}
                onChange={(e) => update(index, 'name', e.target.value)}
                className="border border-border bg-white text-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tech Stack</Label>
              <Input
                placeholder="e.g. React, Node.js, MongoDB"
                value={item.techStack}
                onChange={(e) => update(index, 'techStack', e.target.value)}
                className="border border-border bg-white text-gray-900"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Project Link</Label>
              <Input
                placeholder="https://github.com/username/project"
                value={item.link}
                onChange={(e) => update(index, 'link', e.target.value)}
                className="border border-border bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe what the project does and your role..."
              rows={2}
              value={item.description}
              onChange={(e) => update(index, 'description', e.target.value)}
              className="resize-none border border-border bg-white text-gray-900"
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-4 h-4" />
        Add Project
      </Button>
    </div>
  );
}
