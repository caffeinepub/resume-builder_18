import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { Certification } from '../types/resume';
import { defaultCertification } from '../types/resume';

interface Props {
  items: Certification[];
  onChange: (items: Certification[]) => void;
}

export function CertificationsSection({ items, onChange }: Props) {
  const update = (index: number, field: keyof Certification, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  const add = () => onChange([...items, defaultCertification()]);

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
              aria-label="Remove certification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Certification Name</Label>
              <Input
                placeholder="e.g. AWS Certified Developer"
                value={item.name}
                onChange={(e) => update(index, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Issuing Organization</Label>
              <Input
                placeholder="e.g. Amazon Web Services"
                value={item.issuer}
                onChange={(e) => update(index, 'issuer', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Issue Date</Label>
              <Input
                placeholder="e.g. March 2023"
                value={item.issueDate}
                onChange={(e) => update(index, 'issueDate', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input
                placeholder="e.g. March 2026 or No Expiry"
                value={item.expiryDate}
                onChange={(e) => update(index, 'expiryDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="gap-1.5">
        <Plus className="w-4 h-4" />
        Add Certification
      </Button>
    </div>
  );
}
