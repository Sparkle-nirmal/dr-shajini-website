# Dr. Shajini — personal website

A 6-page static site (Home/About, Treatments, Accomplishments, Publications, Gallery, Contact)
with a free password-protected admin page for editing every word yourself, forever.

## How editing works

- All the text/images that change (bio, treatments, accomplishments, publications, gallery
  photos, contact details) live in plain files inside `/content/*.json`.
- The pages themselves (`index.html`, `treatments.html`, ...) never need to be touched again —
  they just read whatever is in `/content/*.json` and display it.
- `/admin` is a visual editor (Decap CMS) that edits those same files through simple forms,
  behind a login. No code, no HTML.

## One-time setup (about 15 minutes)

### 1. Put the code on GitHub
1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new **public or private repository**, e.g. `my-website`.
3. Upload every file in this folder to that repository (GitHub's web UI has an
   "Add file → Upload files" button — drag the whole folder in).

### 2. Deploy on Netlify (free)
1. Create a free account at https://app.netlify.com/signup (you can sign up with GitHub).
2. Click **Add new site → Import an existing project → GitHub**, and pick your repository.
3. Build settings: leave the build command empty and set the publish directory to `.` (this
   is already set in `netlify.toml`). Click **Deploy**.
4. Netlify gives you a free URL like `https://your-site-name.netlify.app`. You can rename this
   later in Site settings → Domain management, and you can also connect a custom domain if you
   ever buy one — the free `.netlify.app` address works fine on its own.

### 3. Turn on the login (Netlify Identity + Git Gateway)
1. In your Netlify site dashboard: **Site configuration → Identity → Enable Identity**.
2. Under Identity settings, set **Registration** to "Invite only" (so only you can log in).
3. Scroll to **Services → Git Gateway** and click **Enable Git Gateway**. This lets the
   admin page save your edits back to GitHub automatically.
4. Still in Identity, click **Invite users** and invite your own email address. You'll get an
   email with a link — click it, set a password. That password is what protects `/admin`.

### 4. Point the admin page at your real site
Open `admin/config.yml` in your repository and replace these two lines with your actual
Netlify URL (from step 2):
```
site_url: https://your-site-name.netlify.app
display_url: https://your-site-name.netlify.app
```

### 5. Log in and edit
Go to `https://your-site-name.netlify.app/admin/`, log in with the email + password from
step 3, and you'll see six sections (Home, Treatments, Accomplishments, Publications,
Gallery, Contact) — each with a form matching what's on the site. Every "Publish" click
updates the live site within about a minute.

## Replacing the placeholder content
Right now every page shows placeholder text and soft illustration "photos" so you can see
the full site before adding real content. Go through `/admin` and replace, in order:
1. **Home** — your real photo, tagline, and bio paragraphs.
2. **Treatments** — a real photo + description for each entry (pick an icon from the dropdown).
3. **Accomplishments** — fill in your awards, memberships/fellowships, and media mentions.
4. **Publications** — replace each placeholder citation with your real papers in Vancouver style.
5. **Gallery** — swap in event/conference photos.
6. **Contact** — your real email, mobile/WhatsApp number, and clinic address.

## Editing without the admin page
If you're ever comfortable doing so, you can also edit the `.json` files in `/content`
directly on GitHub (click the file → pencil icon → commit) — the admin page is just a
friendlier layer on top of the same files.

## Local preview (optional, for anyone technical helping you)
From this folder: `python3 -m http.server 8000`, then open `http://localhost:8000`.
