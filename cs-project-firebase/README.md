
# OnePage Shop — Next.js + Firebase + Stripe (No Supabase)

This version uses **Firebase** (Google) for Auth, Firestore (DB), and Storage. It deploys cleanly to **Vercel** and requires no local installs if you do everything via GitHub/Vercel.

## What you get
- 🔐 Firebase Auth (email/password)
- 📄 Firestore collections: `products`, `purchases`, `profiles`
- 🗂 Firebase Storage for images (public) + product files (private)
- 🛒 Stripe Checkout + webhook to record purchases
- ⬇️ Signed download links
- ✨ Tailwind dark UI

---

## 1) Upload to GitHub (web)
- Create a repo and upload the contents of this folder.

## 2) Firebase (console.firebase.google.com)
- Create project → Add Web App to get your **public web config** (API key etc.).
- Build → Authentication → **Sign-in method** → enable **Email/Password**.
- Build → Firestore Database → **Create database** (production mode).
- Build → Storage → **Get started**. Create two folders at root: `images/` and `product-files/`.
- Project Settings → Service Accounts → **Generate new private key** → you’ll use `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` envs.

### Security Rules (copy into Firestore/Storage as noted below)
**Firestore rules (very simple demo; tighten later):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return request.auth.token.admin == true; }

    match /profiles/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    match /products/{doc} {
      allow read: if resource.data.isPublished == true || isAdmin();
      allow write: if isAdmin();
    }

    match /purchases/{doc} {
      allow read: if isSignedIn() && request.auth.uid == resource.data.userId;
      allow create: if true; // created by webhook
    }
  }
}
```

**Storage rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return request.auth.token.admin == true; }

    match /images/{allPaths=**} {
      allow read: if true;  // public images
      allow write: if isAdmin();
    }
    match /product-files/{allPaths=**} {
      allow read: if false; // downloads via signed URL only
      allow write: if isAdmin();
    }
  }
}
```

> To set `admin` custom claim for your own account once: use Firebase Admin SDK in a one-off script or Cloud Functions. For now, the app checks admin by a document in `profiles` too (simpler).

Create a document `profiles/{uid}` when a user signs up (app will do it on first admin attempt if missing). Set `role: "admin"` manually in Firestore for your user to unlock `/admin`.

## 3) Stripe (stripe.com)
- Copy **Secret key** for `STRIPE_SECRET_KEY`.
- After deploy, add a webhook for `checkout.session.completed` to `/api/stripe/webhook`.

## 4) Vercel Deploy
- Import GitHub repo.
- Add Environment Variables:
  - All `NEXT_PUBLIC_FIREBASE_*` (from Firebase web app config)
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_STORAGE_BUCKET` (from service account key; escape newlines as \n)
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET` (after webhook is created)
  - `NEXT_PUBLIC_SITE_URL` = your Vercel URL
- Deploy.

## 5) Make yourself admin
- Visit `/login` → sign up.
- In Firestore → `profiles/{yourUID}` set `{ role: "admin" }`.
- Now `/admin` lets you upload products.

## 6) Test a purchase
- Go to a product → Buy Now → test card `4242 4242 4242 4242`.
- `/downloads` shows your file via signed URL.

---

Local dev (optional):
```bash
npm i
cp .env.local.example .env.local
# fill env
npm run dev
```
