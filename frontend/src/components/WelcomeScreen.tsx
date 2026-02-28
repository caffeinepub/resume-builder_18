import React from 'react';
import { FileText, CheckCircle, Download, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const features = [
  { icon: FileText, text: 'Professional resume templates' },
  { icon: CheckCircle, text: 'Easy section-by-section editing' },
  { icon: Download, text: 'Download as PDF instantly' },
  { icon: Zap, text: 'Auto-saves your progress' },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, oklch(0.20 0.07 240) 0%, oklch(0.28 0.11 240) 40%, oklch(0.36 0.15 240) 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.62 0.18 240)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'oklch(0.76 0.13 240)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl w-full">
        {/* Logo */}
        <div
          className="mb-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: 'oklch(0.48 0.18 240)' }}
        >
          <img
            src="/assets/generated/resume-logo.dim_256x256.png"
            alt="Resume Builder Logo"
            className="w-14 h-14 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-3 leading-tight"
          style={{ color: 'oklch(0.97 0.02 240)', fontFamily: "'Playfair Display', serif" }}
        >
          Welcome to Resume Builder
        </h1>

        <p
          className="text-lg md:text-xl mb-10 leading-relaxed"
          style={{ color: 'oklch(0.80 0.06 240)' }}
        >
          Create a stunning, professional resume in minutes. Fill in your details, preview in real-time, and download as PDF.
        </p>

        {/* Feature list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full max-w-lg">
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{
                background: 'oklch(0.28 0.09 240 / 0.6)',
                border: '1px solid oklch(0.48 0.18 240 / 0.3)',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.76 0.13 240)' }} />
              <span className="text-sm font-medium" style={{ color: 'oklch(0.90 0.04 240)' }}>
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group px-10 py-4 rounded-xl text-lg font-semibold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400"
          style={{
            background: 'linear-gradient(135deg, oklch(0.62 0.18 240), oklch(0.52 0.19 240))',
            color: 'oklch(0.98 0.005 240)',
            boxShadow: '0 8px 32px oklch(0.48 0.18 240 / 0.4)',
          }}
        >
          <span className="flex items-center gap-2">
            Get Started
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        <p className="mt-6 text-sm" style={{ color: 'oklch(0.65 0.06 240)' }}>
          No account required · Your data is saved automatically
        </p>
      </div>
    </div>
  );
}
