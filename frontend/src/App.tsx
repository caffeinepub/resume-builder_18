import React, { useRef, useState } from 'react';
import { Save, Download, Loader2, CheckCircle, FileText, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import WelcomeScreen from './components/WelcomeScreen';
import { useResumeData } from './hooks/useResumeData';
import { useDownloadPDF } from './hooks/useDownloadPDF';

const WELCOME_KEY = 'resume_builder_started';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem(WELCOME_KEY) === 'true';
  });

  const { resumeData, setResumeData, isSaving, lastSaved, saveNow } = useResumeData();
  const { downloadHTML, isGenerating } = useDownloadPDF(resumeData);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    localStorage.setItem(WELCOME_KEY, 'true');
    setHasStarted(true);
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return null;
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 60) return 'Saved just now';
    return `Saved ${Math.floor(diffSec / 60)}m ago`;
  };

  if (!hasStarted) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-40 no-print"
        style={{
          background: 'linear-gradient(90deg, oklch(0.20 0.07 240) 0%, oklch(0.28 0.11 240) 100%)',
          borderBottom: '1px solid oklch(0.36 0.15 240)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'oklch(0.48 0.18 240)' }}
            >
              <img
                src="/assets/generated/resume-logo.dim_256x256.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h1
                className="text-base font-bold leading-none"
                style={{ color: 'oklch(0.97 0.02 240)', fontFamily: "'Playfair Display', serif" }}
              >
                Resume Builder
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.70 0.08 240)' }}>
                Professional Resume Creator
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auto-save status */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'oklch(0.70 0.08 240)' }}>
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: 'oklch(0.62 0.18 240)' }} />
                  <span>{formatLastSaved(lastSaved)}</span>
                </>
              ) : null}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={saveNow}
              disabled={isSaving}
              className="gap-1.5 text-xs font-medium"
              style={{
                borderColor: 'oklch(0.48 0.18 240)',
                color: 'oklch(0.80 0.06 240)',
                background: 'transparent',
              }}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Save</span>
            </Button>

            <Button
              size="sm"
              onClick={downloadHTML}
              disabled={isGenerating}
              className="gap-1.5 text-xs font-semibold"
              style={{
                background: 'linear-gradient(135deg, oklch(0.52 0.19 240), oklch(0.44 0.18 240))',
                color: 'oklch(0.97 0.02 240)',
                border: 'none',
              }}
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Save as HTML</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form panel */}
          <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 no-print">
            <div
              className="rounded-xl overflow-hidden shadow-card"
              style={{ border: '1px solid oklch(0.86 0.09 240 / 0.5)' }}
            >
              <div
                className="px-4 py-3 flex items-center gap-2"
                style={{ background: 'oklch(0.93 0.05 240)', borderBottom: '1px solid oklch(0.86 0.09 240)' }}
              >
                <FileText className="w-4 h-4" style={{ color: 'oklch(0.44 0.18 240)' }} />
                <span className="text-sm font-semibold" style={{ color: 'oklch(0.28 0.11 240)' }}>
                  Resume Details
                </span>
              </div>
              <div className="bg-card">
                <ResumeForm
                  formData={resumeData}
                  onChange={(updater) => setResumeData(updater)}
                />
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="flex-1 min-w-0">
            <div
              className="rounded-xl overflow-hidden shadow-card"
              style={{ border: '1px solid oklch(0.86 0.09 240 / 0.5)' }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between no-print"
                style={{ background: 'oklch(0.93 0.05 240)', borderBottom: '1px solid oklch(0.86 0.09 240)' }}
              >
                <span className="text-sm font-semibold" style={{ color: 'oklch(0.28 0.11 240)' }}>
                  Live Preview
                </span>
                <span className="text-xs" style={{ color: 'oklch(0.52 0.06 240)' }}>
                  Updates as you type
                </span>
              </div>
              <div ref={previewRef} className="overflow-auto">
                <ResumePreview formData={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Download FAB */}
      <button
        onClick={downloadHTML}
        disabled={isGenerating}
        className="fixed bottom-6 right-6 z-50 lg:hidden no-print w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, oklch(0.52 0.19 240), oklch(0.44 0.18 240))',
          color: 'oklch(0.97 0.02 240)',
        }}
        aria-label="Save as HTML"
      >
        {isGenerating ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Download className="w-6 h-6" />
        )}
      </button>

      {/* Footer */}
      <footer
        className="no-print py-4 text-center text-xs"
        style={{
          background: 'oklch(0.20 0.07 240)',
          color: 'oklch(0.60 0.06 240)',
          borderTop: '1px solid oklch(0.28 0.09 240)',
        }}
      >
        <span>
          © {new Date().getFullYear()} Resume Builder · Built with{' '}
          <Heart className="inline w-3 h-3 mx-0.5" style={{ color: 'oklch(0.62 0.18 240)' }} />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'resume-builder')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: 'oklch(0.70 0.10 240)' }}
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
