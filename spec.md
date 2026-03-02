# Specification

## Summary
**Goal:** Fix invisible text color issues in the resume builder and add a "Download as Image" (PNG) feature.

**Planned changes:**
- Audit and fix text color contrast in `ResumePreview.tsx`, `ResumeForm.tsx`, and `index.css` so all text is clearly visible against its background in both light and dark themes
- Add a "Download as Image" button in the sticky header alongside the existing "Save as HTML" button
- Implement DOM-to-canvas capture of the resume preview using html2canvas, downloading the result as `resume.png`
- Ensure the profile photo is included in the captured image

**User-visible outcome:** All text in the resume builder is clearly readable, and users can download their resume as a PNG image by clicking the new "Download as Image" button in the header.
