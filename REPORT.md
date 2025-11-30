Personal Portfolio — Interactive Enhancements

Author: Do Tung Thanh
Date: 30 November 2025

1. Objectives

This project enhances a static multi-page portfolio website by adding client-side interactivity using vanilla JavaScript. The primary objectives were:

- Implement real-time project search and filtering to help visitors find relevant projects quickly.
- Provide a contact form with robust client-side validation and the ability to save drafts locally so users don't lose partially-composed messages.
- Add a light/dark theme toggle with preference persistence across sessions.
- Keep the implementation lightweight, dependency-free, and accessible on modern browsers.

These changes aim to improve usability, demonstrate front-end development skills, and provide a solid foundation for future enhancements.

2. Design

User Experience (UX)

- Projects page: a search box and tag filter appear above the project grid. Users type in the search box to filter cards in real time. The filter select allows quick narrowing by category (IoT, Linux, Security).

- Contact page: users can compose a message and either save a draft to localStorage or submit the form (submission is simulated in this static demo). Drafts are auto-saved during editing.

- Global: The theme toggle is a floating button at the bottom-right. The active navigation item is highlighted based on the current URL.

Data Storage

- Preferences and drafts are stored using the browser's `localStorage` API for persistence: the theme under `theme`, and contact drafts under `contact_draft_v1`.

Accessibility & Responsiveness

- Controls are keyboard-accessible (native form controls). The modal can be closed with the Escape key or by clicking the backdrop. Further accessibility improvements (focus trapping, ARIA roles) are recommended as next steps.

3. Implementation

Files changed or added

- `script.js` — Additions:
  - Active nav highlighting
  - Theme toggle (persisted)
  - Project details modal
  - Project search and filter
  - Contact form validation, auto-save, manual save, and clear draft
  - Smooth scrolling for anchors

- `style.css` — Additions:
  - Dark-theme color variables / class rules
  - Styles for modal and floating theme toggle button

- `projects.html` — Additions:
  - Search input and filter select
  - Tag markup in project cards to support filtering

- `contact.html` — Additions:
  - Contact form with `name`, `email`, `message` fields, and `Save Draft` / `Clear Draft` buttons

- `README.md` — Project description and run instructions (existing file present)

Implementation notes

- Search & filtering: on each input/change event, JavaScript normalizes (lowercases) the user's query and compares it against project card titles, descriptions, and tag text. Cards are shown/hidden via `style.display`.

- Draft saving: a debounced auto-save ensures the draft is not written on every keystroke. Manual save and clear buttons provide explicit control.

- Modal: generated dynamically from existing card content. It supports closing by clicking outside or pressing Escape.

4. Testing

Local testing steps performed

- Launched the included `server.py` (Python 3) and visited `http://localhost:8080` in a browser.
- Verified the following behaviors:
  - Theme toggle persists selection across reloads.
  - Project search filters cards in real time; tag select narrows results.
  - Clicking "Details" for placeholder cards opens a modal and can be closed via click or Escape.
  - Contact form loads any saved draft on page load, auto-saves while typing, and can manually save/clear the draft.
  - Submission validates inputs; since there is no backend endpoint in this static demo the form clears the draft and shows a success alert.

Edge cases tested

- Empty search input shows all projects.
- Filter "All" combined with a search query works as expected.
- Draft persisted even after closing and reopening the browser tab (localStorage behavior).

5. Results

The interactive enhancements improve discoverability of projects and reduce the risk of losing composed messages. The implementation is intentionally lightweight and uses no external libraries.

6. Limitations & Future Work

- Accessibility: Add ARIA roles, focus trapping inside modals, and explicit keyboard navigation for improved accessibility compliance.
- Backend integration: Wire the contact form to a server endpoint (e.g., an API or form service) to enable real message delivery.
- Progressive enhancement: For environments without JavaScript, consider server-side fallbacks.
- UX polish: Animate the modal open/close transitions and add tag chips with clickable filters.

7. How to run locally

Start the local server and open the site:

```bash
python3 ./server.py
```

Open `http://localhost:8080` in a browser.

8. Conclusion

This enhancement demonstrates practical, user-centered interactive features implemented with vanilla JavaScript. It meets the project requirements for search/filter, contact draft saving, validation, and theme preference persistence while remaining easy to maintain and extend.

