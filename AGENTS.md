# Agent guide — Tessa Bobir website

**Read this file first.** It is the single source of truth for any AI coding agent (Cursor, Codex, Claude Code, Antigravity, etc.) working on this project.

Human owner: **Tessa Bobir / Yoni Herbs Australia**  
Technical maintainer: **Middle Out Consult** (separate Cloudflare account — do not mix credentials)

---

## What this project is

A **static HTML website** (no build step required today):

- Pages: `*.html` at repository root  
- Assets: `css/`, `js/`, `images/`  
- Hosting config: `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`

There is **no npm install**, **no framework**, and **no compile step** unless you introduce one. Deploy = upload these files.

---

## Repositories

| Repo | URL | Role |
|------|-----|------|
| **This repo** | `yoniherbsaustralia/yoni-site-cursor` | Active work, staging + production deploy |
| **Archive** | `yoniherbsaustralia/yoni-site-ag1` | Read-only backup (June 2026). Do not edit unless asked to recover old files. |

---

## Environments

| Environment | URL | How it updates |
|-------------|-----|----------------|
| **Staging** | https://yoniherbsaustralia.github.io/yoni-site-cursor/ | Automatic on every push to `main` |
| **Production** | https://tessabobir.com.au | Manual — run GitHub Action **“Deploy to Cloudflare Production”** |
| **Production (alt)** | https://caba13f0.yoni-site-1.pages.dev | Same as production (Cloudflare Pages project `yoni-site-1`) |

**Rule:** Always verify changes on **staging** before deploying to **production**.

---

## Secrets and configuration (GitHub — not in repo files)

**Never commit API tokens, passwords, or `.env` files with real values.**

All production credentials live in **GitHub → Repository → Settings → Secrets and variables → Actions**.

### Required secrets (set once by a developer)

| Secret name | Used for |
|-------------|----------|
| `CLOUDFLARE_API_TOKEN` | Deploy to Cloudflare Pages (Yoni account only) |
| `CLOUDFLARE_ACCOUNT_ID` | Yoni Cloudflare account ID |

Create the token in the **Yoni** Cloudflare dashboard with permission **Cloudflare Pages → Edit** for account `yoni-site-1` only.

### Repository variables (non-secret, set once)

| Variable name | Default | Purpose |
|---------------|---------|---------|
| `CF_PAGES_PROJECT_NAME` | `yoni-site-1` | Cloudflare Pages project name |

See [docs/SECRETS.md](docs/SECRETS.md) for step-by-step setup instructions for humans.

---

## What agents MAY do

- Edit HTML, CSS, JS, and images at repo root  
- Fix copy, layout, accessibility, SEO (`sitemap.xml`, meta tags)  
- Fix known issues: testimonial encoding (mojibake), broken sitemap on production  
- Add or remove pages (update `sitemap.xml` and nav links in all affected pages)  
- Push to `main` to update **staging**  
- Trigger production deploy **only when the user explicitly asks** to go live  
- Read the archive repo for reference  

---

## What agents MUST NOT do

- Commit secrets, tokens, or API keys  
- Run `wrangler login` globally (would affect other Middle Out projects on the same machine)  
- Change Cloudflare or domain DNS unless explicitly asked  
- Deploy to production without user confirmation  
- Edit `yoni-site-ag1` except to read/reference  
- Point `yoniherbsaustralia.com.au` DNS until the user says the domain transfer is ready  
- Change the Stripe payment URL in `js/booking.js` without explicit approval  

---

## Deploy workflows

### Staging (automatic)

- **Workflow file:** `.github/workflows/deploy-staging.yml`  
- **Trigger:** Push to `main`  
- **Target:** GitHub Pages  

### Production (manual)

- **Workflow file:** `.github/workflows/deploy-production.yml`  
- **Trigger:** Actions tab → “Deploy to Cloudflare Production” → Run workflow → type `deploy`  
- **Target:** Cloudflare Pages project `yoni-site-1`  
- **Requires:** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets  

Agents with GitHub CLI access can run:

```bash
gh workflow run deploy-production.yml -f confirm=deploy
```

Only after the user has approved going live.

---

## Swapping the front end

The **deployable site** is everything at the **repository root** except:

- `.github/` — CI/CD (keep unless refactoring deploy)  
- `docs/` — documentation  
- `AGENTS.md`, `README.md` — guides  
- `.gitignore`  

To replace the entire front end (e.g. new static export, different template):

1. Replace root `*.html`, `css/`, `js/`, `images/`, and hosting files (`_headers`, `_redirects`, etc.)  
2. Keep `.github/workflows/` and this file unless deploy paths change  
3. Push to `main` → check staging URL  
4. Run production workflow when approved  

**Future option:** move site files into a `site/` folder and set `SITE_ROOT: site` in both workflow files — document the change here if you do that.

---

## Local preview (optional, for agents)

No build step. Open any `.html` file in a browser, or use a simple static server:

```bash
npx --yes serve .
```

Note: `_headers` / `_redirects` only apply on Cloudflare, not locally or on GitHub Pages.

---

## Known issues (as of June 2026)

1. **Mojibake** in testimonial text (`Â` characters) — fix in HTML or run encoding cleanup  
2. **Production sitemap** may error — local `sitemap.xml` is valid; redeploy to production should fix  
3. **Legacy `retreats.html`** may still exist on production but not in this repo — do not re-add unless asked  
4. **Booking** uses live Stripe link in `js/booking.js` — use care on staging  

---

## File map (quick reference)

| Path | Purpose |
|------|---------|
| `index.html` | Home page |
| `blog.html` + `blog-*.html` | Blog listing and posts |
| `booking.html`, `js/booking.js` | Booking flow + Stripe redirect |
| `css/styles.css` | Global styles |
| `images/` | Photos and graphics |
| `_headers`, `_redirects` | Cloudflare-only rules |
| `sitemap.xml`, `robots.txt` | SEO |

---

## Instructions for the site owner (Tessa)

You do **not** need to configure hosting or secrets yourself.

1. Clone or open this repo in your AI tool:  
   `https://github.com/yoniherbsaustralia/yoni-site-cursor`
2. Tell the agent: **“Read AGENTS.md and follow it.”**
3. Describe what you want changed in plain language.
4. Ask the agent to show you the **staging link** after changes.
5. When happy, ask: **“Deploy to production.”**

One-time secret setup is done by your developer in GitHub Settings (see `docs/SECRETS.md`).

---

## Tool compatibility

| Tool | How to start |
|------|----------------|
| **Cursor** | Open repo → “Read AGENTS.md first” |
| **Codex / ChatGPT** | Paste repo URL + “Follow AGENTS.md” |
| **Claude Code / Antigravity** | Clone repo → read `AGENTS.md` at root |
| **Any agent** | Root entry point is always **`AGENTS.md`** |

If a tool looks for `CONTRIBUTING.md` or `.cursor/rules`, point it to this file.
