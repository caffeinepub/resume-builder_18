# Specification

## Summary
**Goal:** Fix text visibility by changing the app background to blue and ensuring all text is clearly readable throughout the application.

**Planned changes:**
- Update the `--background` CSS custom property in `index.css` to a solid blue color (e.g., `#1E40AF`)
- Update foreground/text CSS custom properties (`--foreground`, `--muted-foreground`, `--card-foreground`, etc.) to white or light shades for high contrast against the blue background
- Audit and fix any inline text color styles in `App.tsx`, `WelcomeScreen.tsx`, `ResumeForm.tsx`, `ResumePreview.tsx`, and section components to ensure visibility on the blue background
- Keep the resume preview card's inner background white/light with dark text for a clean, print-friendly appearance

**User-visible outcome:** The app shell displays a blue background with all text (headings, labels, form fields, buttons, placeholders) clearly visible, while the resume preview card retains its clean, legible white appearance.
