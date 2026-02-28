# Specification

## Summary
**Goal:** Replace the broken PDF download functionality with a "Save as HTML" download that works reliably in any browser.

**Planned changes:**
- Remove the existing `useDownloadPDF.ts` logic (window.print() / html2canvas approach) and replace it with an HTML export function
- Generate a fully self-contained `.html` file that inlines all resume content (personal info, education, experience, skills, projects, certifications, LinkedIn, GitHub) with inline CSS styles
- Convert the profile photo blob URL to a base64 data URL so it is embedded in the exported file and works offline
- Trigger the download of `resume.html` via a programmatic anchor click with a blob URL
- Update the download button label to "Download as HTML" or "Save as HTML"

**User-visible outcome:** Clicking the download button immediately downloads a `resume.html` file. Opening it in any browser displays the complete, formatted resume, which can be printed or saved as PDF from the browser's print dialog with no blank pages or loading issues.
