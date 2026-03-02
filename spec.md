# Specification

## Summary
**Goal:** Fix invisible input fields and form elements across all resume form sections so they are always visually distinct and legible at rest, without requiring hover or focus.

**Planned changes:**
- Update all input fields, textareas, and select elements in PersonalInfoSection, EducationSection, ExperienceSection, SkillsSection, ProjectsSection, CertificationsSection, and ProfilePhotoSection to have a consistently visible border at rest
- Set a non-transparent background color on all form fields that contrasts with the page background
- Ensure text and placeholder text are readable without hovering
- Apply fixes consistently for both light and dark theme color tokens

**User-visible outcome:** All form fields are clearly visible and legible at all times — users no longer need to hover over fields to see them.
