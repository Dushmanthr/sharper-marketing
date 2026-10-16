# Sharper Labs Marketing — Deployment & Operations Guide

This site is a **statically-exported Next.js app**. `npm run build` produces a plain
`out/` folder of HTML/CSS/JS that runs on **any shared hosting** (cPanel/Apache) with
**no Node server and no database**.

The Contact and enquiry forms are handled by third-party services called directly from
the browser (so they work on static hosting): a Google Sheet for record-keeping, and
EmailJS for the team notification and the acknowledgement email.

---

## 1. Build the site

```bash
npm install          # first time only
npm run build        # outputs the static site to ./out
```

Preview the built site exactly as it will appear on the host:

```bash
npx serve out        # then open the printed http://localhost:3000
```

> **Environment variables** (form delivery, site URL) are baked in at build time. Set
> them **before** running `npm run build`. Put them in `.env` (already created) or
> `.env.local`. Because `NEXT_PUBLIC_SITE_URL` controls the `/marketing` subfolder prefix,
> **always rebuild after changing it**.

### If `npm run build` hangs / "keeps loading"

On Windows this is almost always a **dev server still running** in the background
(`npm run dev`) holding a lock on the `.next` folder. Fix it:

```bash
netstat -ano | findstr :3000        # note the PID in the last column
taskkill /PID <pid> /F
rmdir /s /q .next                    # PowerShell: Remove-Item -Recurse -Force .next
npm run build
```

Never run `npm run dev` and `npm run build` at the same time in this project.

---

## 2. Upload to shared hosting

> **Where does the site live?** This is set by `NEXT_PUBLIC_SITE_URL` in `.env`. It is
> `https://dev.sharper-labs.com/marketing/` — a **subfolder** of the group's domain — so
> every asset, link and URL is prefixed with `/marketing` automatically, and you upload
> into `public_html/marketing/`.

1. Run `npm run build`.
2. Open **cPanel → File Manager** (or any FTP client such as FileZilla).
3. Go to your web root, then into (or create) the **`marketing`** folder inside `public_html`.
4. Upload **the contents of the `out/` folder** (not the folder itself) into
   `public_html/marketing/`.
   - Quickest way: zip the contents of `out/`, upload the zip, then **Extract** in cPanel.
   - The result should be `public_html/marketing/index.html`, `public_html/marketing/_next/…`,
     `public_html/marketing/images/…`, etc.
5. Done — visit **https://dev.sharper-labs.com/marketing/**.

Because the build uses `trailingSlash: true`, every page is a real `folder/index.html`,
so Apache serves clean URLs (`/marketing/about/`, `/marketing/services/study-in-the-uk/`)
with **no `.htaccess` rules required**.

> **Hosting at a different path?** If the site ever moves, e.g. to
> `https://sharper-labs.com/marketing/`, just update `NEXT_PUBLIC_SITE_URL` and rebuild. The
> golden rule: **the upload folder must match the path in `NEXT_PUBLIC_SITE_URL`** — a
> mismatch makes the page load HTML but fail to find its CSS/JS/images, so it appears to
> hang.

### Optional `.htaccess` niceties

Create `public_html/marketing/.htaccess`:

```apache
ErrorDocument 404 /marketing/404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 6 months"
  ExpiresByType image/png "access plus 6 months"
</IfModule>
```

---

## 3. Enquiry forms → Google Sheet (free, no backend)

The Contact and home-page enquiry forms post directly from the browser to a **Google
Apps Script Web App**, which appends a row to your Sheet.

1. Create a Google Sheet. In row 1 add headers:
   `Timestamp | Name | Service | Phone | Email | Subject | Message`
2. In the Sheet: **Extensions → Apps Script**. Replace the code with:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const d = JSON.parse(e.postData.contents);
     sheet.appendRow([
       d.submittedAt || new Date(),
       d.name || "", d.service || "", d.phone || "",
       d.email || "", d.subject || "", d.message || ""
     ]);
     return ContentService
       .createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

3. **Deploy → New deployment → Web app.**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   - Click **Deploy**, authorise, and copy the **Web app URL**.
4. Put that URL in `.env` (or `.env.local`):
   ```
   NEXT_PUBLIC_SHEETS_WEBAPP_URL=https://script.google.com/macros/s/XXXX/exec
   ```
5. Rebuild and re-upload.

> The form sends with `mode: "no-cors"`, so the browser won't read the response, that's
> normal for Apps Script and the row is still written. Test by submitting the live form
> and checking the Sheet.

---

## 4. Emails → EmailJS (two templates: team notify + user acknowledgement)

EmailJS sends email from the browser using only **public** keys, safe for a static site.
Each submission sends **two** emails:
1. **Team notification** → to you (Template 1).
2. **Acknowledgement** → to the person who enquired (Template 2).

These variables are available to both templates:
`{{from_name}} {{to_email}} {{reply_to}} {{service}} {{phone}} {{subject}} {{message}} {{submitted_at}}`

### 4a. One-time account setup
1. Sign up at <https://www.emailjs.com> (free tier ≈ 200 emails/month).
2. **Email Services → Add** your provider (Gmail, Outlook, etc.). Note the **Service ID**.
3. **Account → General** → copy your **Public Key**.

### 4b. Template 1 — team notification
1. **Email Templates → Create.** *To* = your inbox; *Reply-To* = `{{reply_to}}`.
2. Put the fields in the body, e.g.
   `New enquiry from {{from_name}} — re: {{service}}. Phone: {{phone}} / Email: {{to_email}}. Message: {{message}}`
3. Save and note the **Template ID**.

### 4c. Template 2 — acknowledgement
1. **Email Templates → Create.**
   - *To Email* = `{{to_email}}` · *From Name* = `Sharper Labs Marketing` · *Reply-To* = `enquiries@sharper-labs.com`
   - *Subject* = `We've received your enquiry — Sharper Labs Marketing`
   - Body: a short thank-you confirming the enquiry was received and that the team will
     be in touch, referencing `{{service}}` and `{{submitted_at}}`.
2. Save and note this **Template ID** (the acknowledgement one).

### 4d. Add the keys
Add to `.env` (or `.env.local`):
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_team_xxx        # Template 1
NEXT_PUBLIC_EMAILJS_ACK_TEMPLATE_ID=template_ack_xxx      # Template 2 (acknowledgement)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxx
```
Then rebuild (`npm run build`) and re-upload.

> You can use **either** Google Sheets, EmailJS, or both. If the acknowledgement template
> ID is omitted, the team still gets notified and the form still works, only the courtesy
> email to the user is skipped. The acknowledgement is best-effort and never blocks a
> submission.

---

## 5. Can I do everything on shared hosting? — quick answers

| Requirement | Works on static shared hosting? | How |
|---|---|---|
| Host the whole site | ✅ Yes | Upload `out/` to `public_html/marketing` |
| Save enquiries to Google Sheet | ✅ Yes | Google Apps Script web app (§3) |
| Email enquiries | ✅ Yes | EmailJS from the browser (§4) |
| SEO / AIO / AEO | ✅ Yes | Pre-rendered HTML, metadata, JSON-LD, sitemap |
| **Instant** publish with no rebuild | ⚠️ Needs automation | Move to Vercel/Netlify, or add a CI/FTP pipeline |

---

## 6. Things to finalise before go-live

- [ ] Set the real domain/path in `.env` → `NEXT_PUBLIC_SITE_URL`.
- [ ] Provision the Google Sheet + Apps Script and EmailJS templates (sections 3–4).
- [ ] Review the testimonials in `components/Testimonials.tsx` and replace them with real,
      approved client quotes before publishing.
- [ ] Add a dedicated social-share image (1200×630) and point the metadata to it
      (currently defaults to `/images/marketing-landing-1.jpeg`).
- [ ] Confirm phone/email/addresses in `lib/site.ts` are current.
- [ ] Have an adviser review the `/privacy` and `/terms` templates before publishing.
- [ ] Confirm the "Other divisions" footer links (`/`, `/hr/`, `/legal/`, `/academy/`,
      `/it/`, `/recruitment/`) match where each division is actually deployed.
- [ ] Submit the sitemap (`https://dev.sharper-labs.com/marketing/sitemap.xml`) in Google
      Search Console.
