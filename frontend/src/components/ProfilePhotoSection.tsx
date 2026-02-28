import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  photoUrl: string;
  onChange: (url: string) => void;
}

export function ProfilePhotoSection({ photoUrl, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string>('');

  // Revoke object URLs on cleanup to avoid memory leaks
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    // Revoke previous object URL if any
    if (localPreview && localPreview.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview);
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    onChange(objectUrl);
  };

  const handleRemove = () => {
    if (localPreview && localPreview.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const displayUrl = photoUrl || localPreview;

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        {displayUrl ? (
          <div className="relative">
            <img
              src={displayUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-border shadow-card"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-xs hover:opacity-90 transition-opacity"
              aria-label="Remove photo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-border bg-secondary/50 flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Profile Photo</p>
        <p className="text-xs text-muted-foreground">Upload a professional headshot (JPG, PNG, WebP)</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Photo
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
