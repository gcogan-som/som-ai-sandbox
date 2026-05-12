# Release security checklist

Complete this checklist **before** production or firm-wide release builds (including CI pipelines that deploy hosting or ship bundled assets).

## 1. Credentials and source control

- [ ] **No secrets in committed source** — Search the repo for accidental keys (e.g. `AIzaSy`, private key blocks, OAuth client secrets). Firebase Web config must come only from **build-time environment variables** (`VITE_FIREBASE_*`), not hardcoded strings.
- [ ] **`.env.local` is not committed** — Confirm it stays gitignored and does not appear in PRs or release artifacts.
- [ ] **Git history / GitHub** — If credentials were ever pushed, confirm **old keys are revoked** in Google Cloud, GitHub secret scanning alerts are **resolved** per org policy, and follow any required **history scrub** (e.g. `git filter-repo`) if mandated.
- [ ] **Other repositories** — If this app (or the same Firebase project) is bundled elsewhere (plugins, internal tools), confirm those pipelines also avoid committed keys and use the same rotation posture.

## 2. Google Cloud and Firebase (production project)

- [ ] **Browser API key** — Restrict with **HTTP referrers** (or equivalent) to production origins only; include **staging** origins explicitly if needed. Avoid overly broad patterns unless policy allows.
- [ ] **API restrictions** — Browser key is limited to the **minimum set of APIs** required for this app (typically Firebase-related services used by the Web SDK). Remove unused APIs from the allowlist when safe to do so.
- [ ] **Firebase App Check** — Enabled for production (and enforced on Firestore/Storage/Functions as applicable) so the browser key alone is not sufficient for abuse.
- [ ] **Firebase Authentication** — **Authorized domains** include every production (and staging) hostname that serves this app; dev-only domains are documented and not used for prod builds.
- [ ] **OAuth consent / branding** — Meets firm and Google requirements if users see Google’s sign-in UI.

## 3. Build and release pipeline

- [ ] **CI secrets** — All `VITE_FIREBASE_*` values for release builds are injected from an **approved secret store** (e.g. GitHub Actions secrets, vault), not from developer laptops or chat.
- [ ] **No `dummy` or placeholder env** — Release jobs must not inherit stale shell or test variables that override real config (verify job logs or a post-build sanity check).
- [ ] **Artifact hygiene** — Production bundles (`dist/`) are **not** pushed to **public** repositories; deploy from CI to hosting or internal distribution only.

## 4. Application and data rules

- [ ] **Firestore / Storage rules** — Reviewed for least privilege (including any broad `match` paths). Confirm `@som.com` or admin-only paths match current policy.
- [ ] **Dependencies** — Quick pass for unused packages that imply extra auth surfaces (e.g. duplicate OAuth libraries); run `npm audit` or org-equivalent and address **critical** issues per policy.

## 5. Post-release verification

- [ ] **Smoke test on production URL** — Sign-in, read, and write paths that matter; confirm **Network** tab shows expected Firebase endpoints and **no** `API_KEY_INVALID` or `unauthorized-domain` errors.
- [ ] **Monitoring** — Error reporting or GCP/Firebase monitoring in place for auth and API anomalies after cutover.

---

**Sign-off:** Record who completed this checklist and the release version or commit SHA per your firm’s change-management process.
