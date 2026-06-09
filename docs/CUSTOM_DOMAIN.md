# Custom domain — production styling fix

## What we found

The latest Cloudflare Pages deploy **works correctly**:

- https://yoni-site-1.pages.dev/css/styles.css → returns real CSS

The custom domain **does not** use that deployment yet:

- https://tessabobir.com.au/css/styles.css → returns the homepage HTML (no styling)

So the site files are fine; **tessabobir.com.au is routed to an old setup** (likely a previous Worker or an older Pages deployment).

## Fix in Cloudflare (one-time)

1. Log in to the **Yoni** Cloudflare account  
2. **Workers & Pages** → **yoni-site-1**  
3. Open **Custom domains**  
   - Confirm **tessabobir.com.au** (and `www` if used) is attached to **this** project  
   - If missing, add the domain here  
4. **DNS** (for the zone `tessabobir.com.au`)  
   - The domain should CNAME to **`yoni-site-1.pages.dev`** (or use Cloudflare Pages custom domain setup — do not point at an old Worker route)  
5. **Workers → Routes**  
   - If any route matches `tessabobir.com.au/*`, remove it or it will override Pages static files  
6. In **yoni-site-1** → **Settings**, disable **Single Page Application** / old **Functions** if enabled from the failed OpenNext experiment  

## Verify

After DNS/routing updates (may take a few minutes):

```text
tessabobir.com.au/css/styles.css  →  should start with  /*  (CSS), not <!DOCTYPE html>
```

Then re-run **Deploy to Cloudflare Production** from GitHub Actions if needed.

## Staging meanwhile

Use GitHub Pages for review until the custom domain is fixed:

https://yoniherbsaustralia.github.io/yoni-site-cursor/
