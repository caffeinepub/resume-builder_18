import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import WelcomeScreen from './components/WelcomeScreen';
import { useResumeData } from './hooks/useResumeData';
import { useDownloadPDF } from './hooks/useDownloadPDF';
import { useDownloadImage } from './hooks/useDownloadImage';
import {
  Download,
  FileImage,
  FileCode2,
  Loader2,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  Heart,
} from 'lucide-react';

const WELCOME_KEY = 'resume_builder_started';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem(WELCOME_KEY) === 'true';
  });

  const { resumeData, setResumeData, isSaving, lastSaved, saveNow } = useResumeData();
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { downloadHTML, isGenerating: isGeneratingHTML } = useDownloadPDF(resumeData);
  const { downloadImage, isGenerating: isGeneratingImage } = useDownloadImage(previewRef);

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/resume-logo.dim_256x256.png"
              alt="Resume Builder"
              className="w-8 h-8 rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div>
              <h1 className="text-base font-bold leading-tight" style={{ color: 'oklch(0.15 0.03 240)' }}>
                Resume Builder
              </h1>
              <p className="text-xs hidden sm:block" style={{ color: 'oklch(0.45 0.04 240)' }}>
                Professional Resume Creator
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Auto-save status */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: 'oklch(0.45 0.04 240)' }}>
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  <span>{formatLastSaved(lastSaved)}</span>
                </>
              ) : null}
            </div>

            {/* Mobile preview toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </>
              )}
            </Button>

            {/* Save */}
            <Button
              variant="outline"
              size="sm"
              onClick={saveNow}
              disabled={isSaving}
              className="gap-1.5"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Save</span>
            </Button>

            {/* Download as Image */}
            <Button
              variant="outline"
              size="sm"
              onClick={downloadImage}
              disabled={isGeneratingImage}
              className="gap-1.5"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileImage className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isGeneratingImage ? 'Capturing…' : 'Save as Image'}
              </span>
            </Button>

            {/* Save as HTML */}
            <Button
              size="sm"
              onClick={downloadHTML}
              disabled={isGeneratingHTML}
              className="gap-1.5"
            >
              {isGeneratingHTML ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileCode2 className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {isGeneratingHTML ? 'Generating…' : 'Save as HTML'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Form panel */}
          <div
            className={`w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 ${
              showPreview ? 'hidden lg:block' : 'block'
            }`}
          >
            <ResumeForm
              formData={resumeData}
              onChange={(updater) => setResumeData(updater)}
            />
          </div>

          {/* Preview panel */}
          <div
            className={`w-full lg:flex-1 min-w-0 ${
              showPreview ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-20">
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: 'oklch(0.26 0.10 240 / 0.5)',
                  borderColor: 'oklch(0.50 0.14 240 / 0.4)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: 'oklch(0.95 0.01 240)' }}
                  >
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </span>
                  <span className="text-xs" style={{ color: 'oklch(0.78 0.06 240)' }}>
                    Updates as you type
                  </span>
                </div>
                <div className="overflow-auto rounded-lg shadow-lg bg-white">
                  <ResumePreview formData={resumeData} previewRef={previewRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile FABs */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 lg:hidden z-40">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg w-12 h-12 bg-card"
          onClick={downloadImage}
          disabled={isGeneratingImage}
          title="Save as Image"
        >
          {isGeneratingImage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileImage className="w-5 h-5" />
          )}
        </Button>
        <Button
          size="icon"
          className="rounded-full shadow-lg w-12 h-12"
          onClick={downloadHTML}
          disabled={isGeneratingHTML}
          title="Save as HTML"
        >
          {isGeneratingHTML ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Footer */}
      <footer
        className="border-t mt-auto"
        style={{
          background: 'oklch(0.24 0.10 240)',
          borderColor: 'oklch(0.42 0.12 240 / 0.5)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: 'oklch(0.78 0.06 240)' }}>
          <span>© {new Date().getFullYear()} Resume Builder. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 fill-current" style={{ color: 'oklch(0.70 0.18 25)' }} />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname || 'resume-builder'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors"
              style={{ color: 'oklch(0.85 0.08 240)' }}
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
