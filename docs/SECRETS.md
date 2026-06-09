# Secrets setup (one-time, for a developer)

This page is for whoever sets up GitHub Actions the first time. **Tessa does not need to do this.**

Secrets are stored in **GitHub**, not inside the repository files. That way any AI tool can deploy without Tessa pasting passwords into a chat.

---

## Where to add them

1. Open https://github.com/yoniherbsaustralia/yoni-site-cursor  
2. **Settings** → **Secrets and variables** → **Actions**  
3. Add **Repository secrets** (see table below)  
4. Add **Repository variables** (non-secret settings)

### Codespaces secrets will NOT work for deploy

If you added secrets under **Codespaces** (user or org) and linked the repo there, that only applies when someone is **coding inside a Codespace**. It does **not** supply GitHub Actions when you run **Deploy to Cloudflare Production**.

For deploy workflows, secrets must appear under **Settings → Secrets and variables → Actions** for this repo (repository secrets), **or** as **organization secrets** with this repo in the “Repository access” list.

To verify: **Settings → Secrets and variables → Actions** should list `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. If the list is empty, deploy will fail with “set CLOUDFLARE_API_TOKEN”.

---

## Repository secrets

| Name | How to get it |
|------|----------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → **My Profile** → **API Tokens** → Create token. Use **Custom token** with **Account** → **Cloudflare Pages** → **Edit** for the **Yoni** account only. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → any site → **Overview** → **Account ID** (right column) |

**Important:** Use the **Yoni** Cloudflare account, not Middle Out’s account.

---

## Repository variables

| Name | Value |
|------|--------|
| `CF_PAGES_PROJECT_NAME` | `yoni-site-1` |

Variables are visible to collaborators but are not secret — they are just configuration.

---

## Verify production deploy works

1. Confirm **Actions secrets** exist under **Settings → Secrets and variables → Actions** (repository or org secrets with access to this repo).
2. Go to **Actions** → **Deploy to Cloudflare Production**  
3. **Run workflow** → type `deploy` in the confirmation box  
4. Wait ~1–2 minutes — the run must show a **green tick** (not red).
5. Check https://tessabobir.com.au — pages should have colours and layout (not plain black/white HTML).

Staging does **not** need Cloudflare secrets — it uses GitHub Pages only.

### Sitemap looks “unstyled”

That is **normal**. https://tessabobir.com.au/sitemap.xml is plain XML for Google — it is not meant to look like the website.

### Site loads but has no styling

The CSS file must be real CSS, not HTML. If production looks unstyled, re-run **Deploy to Cloudflare Production** after the latest workflow fix is on `main`. In Cloudflare → **Workers & Pages** → **yoni-site-1**, check that an old **Worker** is not overriding static files (Settings → disable SPA / remove old Worker if present).

---

## Rotating a token

If a token is leaked or staff change:

1. Create a new token in Cloudflare  
2. Update `CLOUDFLARE_API_TOKEN` in GitHub Secrets  
3. Revoke the old token in Cloudflare  

No changes needed in the website files.
