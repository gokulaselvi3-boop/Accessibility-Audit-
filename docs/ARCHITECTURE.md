# Project Architecture

## 1. Project Overview

### Purpose
This project is created to perform a website accessibility audit and document accessibility issues based on WCAG 2.1.

### Target Users
- Website developers
- Students
- Accessibility testers
- Users who depend on accessible websites

### Key Features
1. Lighthouse accessibility testing
2. Keyboard-only navigation testing
3. Manual accessibility testing
4. Documentation of five accessibility issues
5. Accessibility improvement recommendations

## 2. Project Boundaries

### In Scope
- Website accessibility audit
- Lighthouse testing
- Keyboard navigation testing
- WCAG issue documentation
- Accessibility evidence screenshots

### Out of Scope
- Website redesign
- Production deployment
- User authentication
- Database implementation

### Dependencies
- Google Chrome
- Chrome DevTools Lighthouse
- GitHub
- Markdown

## 3. System Architecture

### Architecture Pattern
Client-side web application with accessibility testing and documentation.

### Technology Stack
- Frontend: HTML, CSS, JavaScript
- Testing: Chrome Lighthouse
- Documentation: Markdown
- Repository: GitHub

### Architecture Diagram

```text
User
  |
  v
Website
  |
  v
Accessibility Testing
  |
  +---- Lighthouse
  |
  +---- Keyboard Testing
  |
  +---- Manual Testing
  |
  v
Audit Findings
  |
  v
AUDIT_REPORT.md
