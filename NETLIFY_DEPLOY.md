# Deploying DenkByte to Netlify (free)

The site is now fully static (content lives in `data/*.json` at the repo root), so it hosts
for free on Netlify with no backend. `index.html` sits at the root, so the default publish
settings just work. Two ways to deploy — pick one.

---

## Option 1 — Connect GitHub (auto-deploys on every push) — recommended

1. Push this repo to GitHub (private is fine).
2. On Netlify: **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build settings (Netlify reads `netlify.toml` automatically):
   - **Build command:** *(leave empty)*
   - **Publish directory:** *(leave empty — it's the repo root)*
4. Click **Deploy**. Every `git push` now redeploys automatically.

---

## Option 2 — Drag & drop (fastest, no GitHub needed)

1. Go to **https://app.netlify.com/drop**
2. Drag the **whole project folder** (the one containing `index.html`) onto the page.
3. Wait a few seconds — you get a live URL like `https://your-site.netlify.app`.
4. (Optional) In **Site settings → Change site name**, rename it to e.g. `denkbyte`.

---

## Contact form (Netlify Forms — free)

The contact form uses **Netlify Forms** (`data-netlify="true"`). Once deployed:
- Submissions appear in your Netlify dashboard under **Forms → contact**.
- Set up email notifications in **Site settings → Forms → Form notifications**.
- A hidden honeypot field blocks basic spam bots.

The form only works on the deployed Netlify site (not on `localhost`, which has no form backend).

---

## Updating content later

Content is in `data/`:
- `config.json` — company name, colors, contact, legal text
- `team.json` — team members
- `services.json` — services

Edit those files, commit, and push — Netlify redeploys automatically.

---

## Course compliance checklist (Planspiel WS 2026/27)

- ✅ Impressum (footer → Impressum)
- ✅ GDPR / Privacy policy (footer → Privacy Policy)
- ✅ Fictional-company disclaimer (footer)
- ✅ Must stay live until **March 31, 2026** — Netlify free tier is fine for this.
