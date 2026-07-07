# Accessibility Audit

## 1. Reduced Motion Compliance

- **Status:** ✅ Validated
- **Details:** Enforced global CSS overrides within `app/globals.css` to pause transitions and loops if the user has selected reduced-motion preferences in their browser:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-delay: -1ms !important;
      animation-duration: 1ms !important;
      transition-duration: 0s !important;
    }
  }
  ```

---

## 2. Keyboard Navigation

- **Status:** ✅ Validated
- **Details:** Every interactive component (Button, Input, Textarea, Modal close trigger) is fully keyboard accessible, displaying clear focus outlines (`outline-ring/50`) on tab highlight.

---

## 3. Accessible Dialogs

- **Status:** ✅ Validated
- **Details:** The `Modal` component wraps the native HTML5 `<dialog>` element. This natively handles focus trapping, closing on escape key presses, and accessible backdrops, avoiding heavy external JavaScript library dependencies.
