# Tessa Bobir website — project guide

This folder (on GitHub) holds the **working copy** of the Tessa Bobir / Yoni Herbs Australia website — the pages, pictures, and settings used to build and update the site.

You do **not** need to be technical to read this guide. It explains how things are organised and where to look if you are curious.

---

## What is this website?

The site is a **collection of web pages** about holistic women’s wellness services — massage, yoni steaming, wellbeing programs, blog articles, booking, and contact information.

The **public website** people visit in a browser is separate from this GitHub folder. Think of GitHub as the **workshop** where the site is stored and updated. The **live site** is what visitors see after changes are published.

---

## Website addresses (good to bookmark)

| What | Address | In plain English |
|------|---------|------------------|
| **Live site (main)** | https://tessabobir.com.au | What most visitors use today |
| **Live site (backup link)** | https://caba13f0.yoni-site-1.pages.dev | Same site, technical hosting link |
| **Future domain** | yoniherbsaustralia.com.au | Being transferred — **not in use yet** |

If the live site looks wrong, tell your developer. Do not change domain settings yourself unless you have been shown how.

---

## How the setup works (simple version)

```text
  [ This GitHub project ]     →     [ Preview / test site ]     →     [ Live site ]
   where files are kept            try changes safely               tessabobir.com.au
```

1. **This repo (`yoni-site-cursor`)** — the main place to work on the site going forward. Clean, organised copy of the website files.

2. **Archive repo (`yoni-site-ag1`)** — a full backup snapshot from June 2026, including old drafts and duplicates. Kept for reference only. **Do not use it for day-to-day edits.**

3. **Preview / staging** (planned) — a test copy of the site on the internet so you can check changes **before** they go live. Like proofreading before printing.

4. **Live / production** — the real site at **tessabobir.com.au**, hosted on **Cloudflare** (the company that serves the site to the world).

**Important:** Changes saved in GitHub do **not** automatically change the live site until someone **publishes** (deploys) them. That is intentional — it stops half-finished edits going public by accident.

---

## What is inside this project? (folder guide)

When the site files are added here, they will look roughly like this:

| Folder or file | What it is | Would a visitor see it? |
|----------------|------------|-------------------------|
| **Pages ending in `.html`** (e.g. `index.html`, `blog.html`) | The actual web pages — home, services, blog, booking, contact | Yes — these become the website |
| **`images/`** | Photos and graphics used on the site | Yes — pictures on the pages |
| **`css/`** | Styling — colours, fonts, layout | Yes — controls how things look |
| **`js/`** | Small programs that run in the browser (e.g. mobile menu, booking form) | Partly — you see the result, not the file itself |
| **`sitemap.xml`** | A list of all pages, for Google and search engines | Not directly — helps search engines find pages |
| **`robots.txt`** | Instructions for search engines | Not directly |
| **`_headers` and `_redirects`** | Technical rules for the live host (Cloudflare only) | Visitors do not see these files |

There should **not** be duplicate “build” or “deploy” folders here — those only exist in the archive backup repo.

---

## Two GitHub repos — which one to open?

| Repo | Name | Use it for… |
|------|------|-------------|
| **This one** | `yoni-site-cursor` | Normal work, updates, and publishing the site |
| **Archive** | `yoni-site-ag1` | Looking up old files or “what did we have in May?” — not for editing |

If you are unsure which repo to open, **start with `yoni-site-cursor`**.

---

## Staging vs live — why two versions?

| | Staging (preview) | Live (production) |
|--|-------------------|-------------------|
| **Purpose** | Check changes safely | What the public sees |
| **Who uses it** | You, your developer, anyone reviewing | Customers, Google, social links |
| **If something breaks** | No problem — fix it and try again | Needs fixing quickly |
| **Planned hosting** | GitHub Pages (free preview link) | Cloudflare + tessabobir.com.au |

**Helpful habit:** Always look at the **preview** link after a change and say “yes, that looks right” before publishing to the live site.

---

## Helpful tips for exploring on GitHub

**Browsing pages**
- Click any `.html` file, then use GitHub’s **Preview** or **Raw** view to see content.
- The home page is `index.html`.

**Finding something**
- Use the GitHub search bar at the top of the repo and type a page name (e.g. `wellbeing` or `booking`).

**Pictures**
- Open the `images/` folder. File names are often descriptive (e.g. massage, retreat, logo).

**Blog articles**
- Each blog post is its own file, named like `blog-something.html`.
- The main blog listing is `blog.html`.

**Booking**
- `booking.html` is the booking page.
- Payment uses a secure **Stripe** link (online payments) — only change this with developer help.

**What not to do unless you know what you are doing**
- Delete whole folders.
- Rename many files at once.
- Change domain or hosting settings in Cloudflare.
- Edit `js/booking.js` payment links without checking with your developer.

**Safe things you can explore**
- Read any page file to check wording.
- Look at images to see what is on the site.
- Open `sitemap.xml` to see the full list of pages.

---

## Known things to be aware of (June 2026)

These are documented so you are not surprised if you hear about them:

- The live **sitemap** (`tessabobir.com.au/sitemap.xml`) has had errors — being fixed in the clean build.
- Some **testimonial text** shows odd characters (encoding issue) — fix scripts exist in the archive repo.
- An old page **`retreats.html`** may still appear on the live site but is **not** in the current source — it should be removed when the site is republished.
- Branding on the current site says **Tessa Bobir** (not “Yoni Herbs Australia” on every page) — that is intentional for now.

---

## Who does what?

| Task | Who |
|------|-----|
| Wording, photos, “can we add a page?” | You / site owner — ask your developer to implement |
| Publishing to live site | Developer (Middle Out / technical contact) |
| Domain transfer (`yoniherbsaustralia.com.au`) | Domain registrar + developer when ready |
| Paying for hosting | Cloudflare account (Yoni) — separate from developer’s other clients |

---

## Quick glossary (no jargon)

| Term | Meaning |
|------|---------|
| **GitHub** | Online storage for project files, with a history of changes |
| **Repo (repository)** | One project folder on GitHub |
| **Deploy / publish** | Push the latest files to the live website |
| **Staging / preview** | A test copy of the site, not the main public address |
| **Cloudflare** | The service that hosts and delivers the live website |
| **Domain** | The web address people type in (e.g. tessabobir.com.au) |
| **HTML** | A web page file |
| **Stripe** | Secure online payment service used for booking deposits |

---

## Questions?

If something in this project is confusing, note **which page or picture** you are looking at and ask your developer. You do not need to understand the technical files to give good feedback on content and design.

**Archive backup (old files only):** https://github.com/yoniherbsaustralia/yoni-site-ag1
