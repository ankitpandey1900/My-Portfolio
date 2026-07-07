# Security Audit

## 1. Environment Variable Validation

- **Status:** ✅ Validated
- **Details:** Built `src/lib/env.ts` to perform runtime assertions of required public and private tokens on application startup, throwing structured errors if any are missing.

---

## 2. Secure HTTP Headers

- **Status:** ✅ Validated
- **Details:** Configured security headers inside `next.config.ts` to protect against cross-site scripting (XSS), clickjacking, and MIME-sniffing:
  - `X-Frame-Options: DENY` (prevents clickjacking)
  - `X-Content-Type-Options: nosniff` (prevents MIME-sniffing)
  - `Referrer-Policy: origin-when-cross-origin`

---

## 3. Input Validation

- **Status:** ✅ Validated
- **Details:** Form fields utilize custom `Input` and `Textarea` components, validating inputs on the client before submission.
