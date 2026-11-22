# Security, Moderation & Deployment Guide
**Kolar & Chintamani Service Phonebook**
*Production URL: [phonebook-kolar-chintamani.netlify.app](https://phonebook-kolar-chintamani.netlify.app/)*

---

## 1. Overview of Changes

1. **Security & Moderation Enforcement**:
   - Visitors can now **only** view approved contacts, save `.vcf` files, and submit new contacts for review.
   - All delete, edit, and restore capabilities have been completely removed from the public website and relocated exclusively to the password/Google-protected `/admin` portal.
   - Visitor submissions are strictly saved with `status: "pending"` and `verified: false`. They **never** appear in the public directory until you approve them.
   - A hidden bot honeypot field (`website_url_hp`) and client/server validation for 10-digit Indian mobile numbers (`^[6-9]\d{9}$`) are active.

2. **Honest Wording**:
   - Removed the claim "Verified" across page titles, meta descriptions, and taglines.
   - Tagline updated to: *"Local service numbers for plumbers, electricians, painters, carpenters & technicians"*.
   - Added an optional `verified: boolean` field. Contacts verified by you show a discreet badge: **"Confirmed by phone"**.
   - Added footer notice: *"Numbers are collected from public sources and may change. Found a mistake? Tell us."*

3. **Opt-Out & Correction Links**:
   - Every contact card includes a **"Request change or removal"** link that opens WhatsApp directly to `8550093816` with a pre-filled, URL-encoded message identifying the business name and phone number.
   - Added an **"About / Directory Information"** section above the footer explaining that numbers are compiled from public sources and detailing how business owners can request updates or removals.

4. **SEO, WhatsApp Sharing & Crawlability**:
   - Comprehensive Open Graph and Twitter Card tags configured with a generated `1200x630` social card (`og-image.png`).
   - "Share on WhatsApp" header button prefilled with recommendation text and link.
   - Schema.org `ItemList` and `LocalBusiness` JSON-LD structured data.
   - Pre-rendered static HTML cards in `#listingsGrid` so Googlebot and low-bandwidth mobile connections see the listings immediately without waiting for JavaScript.
   - Clean, dedicated crawlable landing pages for cities and trades (e.g. `/kolar/plumbers`, `/chintamani/electricians`).
   - `sitemap.xml` and `robots.txt` generated and configured.

5. **Admin Portal (`/admin` or `admin.html`)**:
   - Supports **both** Email + Password and Google Sign-In.
   - Four dedicated admin tabs:
     1. **Pending Reviews**: One-click **Approve**, **Approve & Mark Confirmed by Phone**, **Edit Details**, or **Reject / Delete**.
     2. **All Active Listings**: Search & filter, toggle **"Confirmed by phone"** on any listing, Edit details, or Delete.
     3. **Trash & Defaults**: Restore individually or one-click **Restore All Defaults**.
     4. **Export CSV**: Download active or pending listings directly as `.csv`.

---

## 2. Firebase Security Rules (`firestore.rules`)

These rules enforce access control at the database engine level so that even if an attacker attempts to call Firestore APIs directly from DevTools or curl, the request is rejected with `PERMISSION_DENIED`.

### Plain Language Explanation:
- **`isAdmin()` Helper**:
  Identifies whether the request comes from an authenticated admin account (signed in via Google or Email/Password, non-anonymous).
- **Public Contacts (`/artifacts/{appId}/public/data/contacts/{id}`)**:
  - `allow read`: Public visitors can **only** read contacts where `status == 'approved'`. Admins can read all contacts (including pending ones).
  - `allow create`: Visitors can only create documents if `status == 'pending'`, `verified == false`, and all fields (name, phone, city, address) conform to strict string size limits. Admins can create approved contacts directly.
  - `allow update, delete`: **Only Admins.** Anonymous visitors cannot modify or delete any contact.
- **Base Overrides (`/artifacts/{appId}/public/data/base_overrides/{id}`)**:
  - `allow read`: Anyone can read overrides to know which hardcoded listings were edited or soft-deleted.
  - `allow write`: **Only Admins.** Visitors cannot soft-delete base listings.
- **Favorites (`/artifacts/{appId}/users/{uid}/favorites/saved`)**:
  - `allow read, write`: Only the user whose UID matches the document path.

### How to Apply in Firebase Console:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`phonebook-fbf5f`**.
3. In the left navigation, go to **Build** &rarr; **Firestore Database**.
4. Click on the **Rules** tab at the top.
5. Replace the editor contents with the code inside `firestore.rules` (shown below) and click **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isNonAnonymousAdmin() {
      return isAuthenticated() && request.auth.token.firebase.sign_in_provider != 'anonymous';
    }

    function isAdmin() {
      return isNonAnonymousAdmin();
    }

    match /artifacts/{appId}/public/data/contacts/{contactId} {
      allow read: if resource.data.status == 'approved' || isAdmin();

      allow create: if (
        (
          request.resource.data.status == 'pending' &&
          request.resource.data.verified == false &&
          request.resource.data.name is string &&
          request.resource.data.name.size() > 0 &&
          request.resource.data.name.size() <= 100 &&
          request.resource.data.phone is string &&
          request.resource.data.phone.size() >= 10 &&
          request.resource.data.phone.size() <= 25 &&
          request.resource.data.city in ['Kolar', 'Chintamani'] &&
          request.resource.data.categories is list &&
          request.resource.data.categories.size() > 0 &&
          request.resource.data.categories.size() <= 6 &&
          request.resource.data.address is string &&
          request.resource.data.address.size() > 0 &&
          request.resource.data.address.size() <= 200
        )
        || isAdmin()
      );

      allow update, delete: if isAdmin();
    }

    match /artifacts/{appId}/public/data/base_overrides/{overrideId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /artifacts/{appId}/users/{userId}/favorites/saved {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }

    match /artifacts/{appId}/admins/{adminId} {
      allow read: if isAdmin();
      allow write: if false;
    }
  }
}
```

---

## 3. Firebase Authentication Setup

To use `/admin` with Google Sign-In and/or Email + Password:
1. In the [Firebase Console](https://console.firebase.google.com/), open **Authentication** &rarr; **Sign-in method**.
2. **Anonymous**: Make sure **Anonymous** is enabled (used for visitor sessions).
3. **Email/Password**: Enable **Email/Password**.
   - Under the **Users** tab, click **Add user** and create your admin account (e.g. `your-email@example.com` and a strong password).
4. **Google**: Enable **Google**.
   - Select your support email and click Save.
   - Under **Authorized domains** (at the bottom of the Sign-in method tab), add:
     - `phonebook-kolar-chintamani.netlify.app`
     - `localhost` (for local testing)

---

## 4. Netlify Deployment Steps

1. **Option A: Drag & Drop Deploy**
   - Log in to your [Netlify Dashboard](https://app.netlify.com/).
   - Open your site `phonebook-kolar-chintamani`.
   - Go to the **Deploys** tab.
   - Drag and drop this folder (`C:\Users\musha\Downloads\Phonebook`) into the deploy area.
2. **Option B: Git Push (if linked to GitHub)**
   - Push your master branch:
     ```bash
     git push origin master
     ```
   - Netlify will automatically build and publish the root directory using the included `netlify.toml`.

---

## 5. Google Search Console Setup

1. Open [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and choose **URL prefix**: `https://phonebook-kolar-chintamani.netlify.app/`.
3. Under verification methods:
   - **HTML file**: Select HTML file. Netlify already hosts `google7f7b6a163f07bb14.html`. Click **Verify**.
   - **HTML tag**: `<meta name="google-site-verification" content="google7f7b6a163f07bb14" />` is already embedded in the `<head>` of all pages.
4. Once verified, go to **Sitemaps** in the left menu, enter `sitemap.xml`, and click **Submit**.

---

## 6. Security Self-Verification Checklist

Run through these checks once deployed:
- [ ] **Visitor cannot delete or edit listings**: Open the site in an incognito window without logging into `/admin`. Notice that edit pencils and trash cans are completely absent from cards.
- [ ] **Visitor cannot delete via console**: In browser DevTools Console, attempt:
  ```javascript
  // Will fail with "Missing or insufficient permissions"
  import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js").then(({ getFirestore, doc, deleteDoc }) => {
    deleteDoc(doc(getFirestore(), "artifacts/kolar-chintamani-phonebook/public/data/contacts/kolar-plumb-1")).catch(console.error);
  });
  ```
- [ ] **Visitor submissions land in pending queue**: Click **Suggest Contact**, submit a test listing. Notice the toast confirms submission for review. Verify the contact does **not** appear on the public directory.
- [ ] **Admin approval works**: Open `/admin`, sign in using Google or your Admin Email. Under **Pending Reviews**, find your test listing and click **Approve**. Refresh the public site in incognito; the contact now appears live.
- [ ] **"Confirmed by phone" badge**: In `/admin`, check the "Confirmed" box on a contact. Go to the public site; the green badge appears on that card.
- [ ] **WhatsApp Removal link**: Click "Request change or removal" on any card. WhatsApp opens with the pre-filled message mentioning the technician name and phone number.

---

## 7. Remaining Considerations & Best Practices

- **Admin Account Management**: Do not create accounts in the Firebase Authentication console for anyone who should not have admin access. Anyone who can authenticate via Email/Password or Google is recognized as an admin by Firestore rules.
- **Offline Resilience**: The app seamlessly falls back to the 36 built-in listings and in-memory operations if mobile visitors lose cellular data or Firebase is unreachable.
