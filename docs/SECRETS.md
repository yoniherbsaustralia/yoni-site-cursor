# Secrets setup (one-time, for a developer)

This page is for whoever sets up GitHub Actions the first time. **Tessa does not need to do this.**

Secrets are stored in **GitHub**, not inside the repository files. That way any AI tool can deploy without Tessa pasting passwords into a chat.

---

## Where to add them

1. Open https://github.com/yoniherbsaustralia/yoni-site-cursor  
2. **Settings** → **Secrets and variables** → **Actions**  
3. Add **Repository secrets** (see table below)  
4. Add **Repository variables** (non-secret settings)

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

1. Go to **Actions** → **Deploy to Cloudflare Production**  
2. **Run workflow** → type `deploy` in the confirmation box  
3. Wait ~1–2 minutes  
4. Check https://tessabobir.com.au  

Staging does **not** need these secrets — it uses GitHub Pages only.

---

## Rotating a token

If a token is leaked or staff change:

1. Create a new token in Cloudflare  
2. Update `CLOUDFLARE_API_TOKEN` in GitHub Secrets  
3. Revoke the old token in Cloudflare  

No changes needed in the website files.
