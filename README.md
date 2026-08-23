# Dr. Shajini — Website

## What's different from yesterday's version
Every page (Home/About, Treatments, Accomplishments, Publications, Gallery,
Contact us) now reads its content from one file, `content.json`. The admin
page can edit every page, not just Home. Nothing goes live until you click
**Publish** on the admin page — until then, changes only sit as a draft in
your browser.

## 1. Upload these files to your repo
Replace everything in your `sparkle-nirmal/dr-shajini-website` repo with
this folder's contents (keep the same repo name so your live link doesn't
change): https://sparkle-nirmal.github.io/dr-shajini-website/

## 2. Set your password
Open `assets/js/admin.js`, find this line near the top:

```
const ADMIN_PASSWORD = "changeme123";
```

Change `"changeme123"` to whatever you'd like your password to be, save,
and upload that file to the repo. This is a basic, on-site password — good
enough to keep casual visitors out of the edit page, not bank-grade
security.

## 3. Create a GitHub Personal Access Token (one-time, ~2 minutes)
This token is what lets the **Publish** button actually update your live
site. Without it, "Publish" cannot work — GitHub Pages has no server of
its own, so the admin page talks to GitHub directly using this token.

1. Go to https://github.com/settings/tokens?type=beta
2. Click **Generate new token**
3. Under **Repository access**, choose "Only select repositories" and pick
   `dr-shajini-website`
4. Under **Permissions → Repository permissions**, set **Contents** to
   **Read and write**
5. Generate the token and copy it (it starts with `github_pat_...`)
6. Keep it somewhere safe (like a notes app) — GitHub only shows it once

You'll paste this token into the admin page each time you want to publish.
It is never saved anywhere except that browser tab for that session.

## 4. Using the admin page
1. Go to `https://sparkle-nirmal.github.io/dr-shajini-website/admin.html`
2. Enter your password
3. Paste your GitHub token and click **Connect & load current content**
4. Edit any page using the tabs across the top
5. Click **Save draft** any time to keep your progress in this browser
   without publishing it
6. When you're happy with the changes, click **Publish — make live** —
   this is the approval step; only then do visitors see the update

## Notes
- Photos are stored directly inside `content.json` as part of the page
  content, so there's nothing extra to upload separately — just choose a
  photo in the admin page and it's included automatically when you publish.
  For faster page loads, resize photos to a reasonable size (under ~1MB
  each) before uploading them.
- If you edit on two different devices, always check whether there's a
  saved draft when you connect — the admin page will ask before loading one.
