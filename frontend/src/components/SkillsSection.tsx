import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { Skill } from '../types/resume';
import { defaultSkill } from '../types/resume';

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

interface Props {
  items: Skill[];
  onChange: (items: Skill[]) => void;
}

export function SkillsSection({ items, onChange }: Props) {
  const update = (index: number, field: keyof Skill, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const add = () => onChange([...items, defaultSkill()]);

  const remove = (index: number) => {
    if (items.length === 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
        <Label className="text-xs text-muted-foreground">Skill Name</Label>
        <Label className="text-xs text-muted-foreground w-32">Proficiency</Label>
        <span className="w-8" />
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
          <Input
            placeholder="e.g. React, Python, Figma"
            value={item.name}
            onChange={(e) => update(index, 'name', e.target.value)}
            className="border border-border bg-white text-gray-900"
          />
          <Select value={item.level} onValueChange={(v) => update(index, 'level', v)}>
            <SelectTrigger className="w-32 border border-border bg-white text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={items.length === 1}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
            aria-label="Remove skill"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-4 h-4" />
        Add Skill
      </Button>
    </div>
  );
}
