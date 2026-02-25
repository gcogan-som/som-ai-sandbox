# Backend Strategy: Google Workspace + Firm Ecosystem

Because the firm operates within the Google Workspace ecosystem, the most secure and viable approach for hosting and managing the database for this AI Library—without relying on external subscriptions like Vercel or Supabase—is to utilize Google Cloud Platform (GCP).

## 1. The "Golden Path": Firebase
Firebase is Google's Backend-as-a-Service and provides a generous free tier ("Spark Plan").

*   **Database: Cloud Firestore (NoSQL)**
    *   **Why:** A flexible, scalable NoSQL document database perfectly matched for JSON-like documents (Resources, Tags, Tips, Authors).
    *   **Free Tier:** 1GB total storage, 50k reads/day, 20k writes/day (more than enough for an internal tool).
*   **Hosting: Firebase Hosting**
    *   **Why:** Easily deploy a React/Vite app directly from the CLI. Serves static assets over a global CDN with SSL built-in.
    *   **Free Tier:** 10GB/month bandwidth.
*   **Security & Authentication: Firebase Auth + Security Rules**
    *   **The Killer Feature:** Configure Firebase Auth to **only** allow logins via Google. Further restrict OAuth policies to explicitly accept emails ending in the firm's domain (e.g., `@som.com`).
    *   **Database Lockdown:** Use Firestore Security Rules to physically enforce access purely to authenticated users under the firm's domain, effectively creating a closed-loop system.

## 2. The Containerized Option: Google Cloud Run
If your security team prefers avoiding managed Firebase services or requires backend API processing.

*   **How:** Package the Vite app (or a Node.js backend) into a Docker container. Cloud Run spins up to handle traffic and spins down to zero when idle.
*   **Free Tier:** 2 million requests per month. "Scales to zero" means weekend/nighttime costs are practically nonexistent.
*   **Security (Cloud IAP):** Place the Cloud Run service behind Google Identity-Aware Proxy (IAP). This intercepts every request and forces a Google Workspace login before any app code is even executed.

## 3. The "Ultra-Scrappy" MVP Alternative: Google Sheets + Apps Script
If procurement or IT approvals for GCP are blocked and a database is needed *today*:

*   **How:** Use a Google Sheet as the database and write a Google Apps Script to serve as a simple API layer.
*   **Pros:** Completely free, securely locked via Google Drive permissions, and instantly editable.
*   **Cons:** Slower, more rate limits, and harder to scale. Typically just used for rapid prototyping.

## Recommendation Summary
Proceeding with **Firebase (Firestore + Auth + Hosting)** is the recommended path for a secure, closed-loop, free-tier-friendly backend that perfectly aligns with a firm deeply rooted in Google Workspace.
