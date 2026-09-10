# CLAUDE.md

## About the Project

**Site Name:** Трофик (TRoFIK)
**Description:** Сайт салона красоты «Трофик». _[TODO: дополнить описание — 1-3 предложения: услуги, город/локация, целевая аудитория]_
**Stack:** Next.js (App Router)
**Priority:** SEO — well-indexed and ranked (Google/Yandex). All decisions serve this.

**Hosting:** Beget VPS with Node.js — full server mode, no static export, no PHP hybrid. `next build` runs locally (via Claude Code), the finished build (`.next/`, `node_modules`, `package.json`, `next.config.js`) is shipped to the server over SSH/rsync — never rebuilt on the VPS itself, to avoid OOM on smaller plans. On the server, `next start` runs under **PM2** (auto-restart on crash/reboot), with **Nginx** in front as a reverse proxy terminating TLS on 80/443 and forwarding to the internal Node.js port (typically 3000).

---

## Project Structure

```
app/
  layout.jsx / page.jsx / globals.css
  (routes)/ · api/ · middleware.js
components/  lib/  hooks/  actions/
public/ (images/ sitemap.xml robots.txt)
```

**Naming:** Components PascalCase.jsx · hooks useSomething.js · actions actionName.js ('use server'). One component = one file; split past ~350 lines. Don't rename page.jsx/layout.jsx.

---

## Next.js Rules

**Server by default.** 'use client' only for hooks, event handlers, browser APIs, or client-only libs. Keep page/layout server, pass data down as props to a small client child — don't client-ify the whole page for one widget. metadata/generateMetadata can't live in a 'use client' file.

**Images:** next/image only, always alt, width/height for external.
**Links:** next/link for nav, plain `<a>` for #anchors.
**SEO metadata:** unique per page (static or generateMetadata), never duplicated.

**Data fetching:** fetch in Server Components. No useEffect+fetch on the client — breaks SSR/SEO. Admin-managed content (services/price list, masters, reviews, blog) is queried directly from MySQL inside Server Components/Server Actions — no PHP layer, no duplicated markup between two renderers.

**Caching:** `no-store` (always fresh) · `revalidate: N` (ISR) · `force-cache` (until rebuild). Revalidate/tag after mutations. Suspense around slow fetches.

**Server Actions** over /api routes where it fits, with revalidatePath.
**Middleware** for auth/redirects/headers. **API routes**: app/api/x/route.js, GET/POST/etc.
**Errors:** error.jsx (client, reset()) · not-found.jsx + notFound().
**Env vars:** NEXT_PUBLIC_* = public only. Secrets stay unprefixed, server-only.
**Never** touch window/document/localStorage in a Server Component.

---

## Deploy — Beget VPS, Node.js, PM2, Nginx

Goal: full SSR/ISR, no static-export compromises, no PHP layer anywhere.

- **Build locally, ship the artifact.** `next build` runs on the dev machine (via Claude Code). Never run `next build` on the VPS itself — smaller Beget VPS plans can OOM mid-build. Sync the built output (`.next/`, `node_modules`, `package.json`, `package-lock.json`, `next.config.js`, `public/`) to the server over SSH/rsync.
- **Deploy isolation (critical):** the `.env`/config file with real DB credentials and secrets lives on the server only, outside the synced deploy set, and is gitignored. Build a dedicated deploy package/script that excludes it explicitly, and hard-fail the packaging step if a real secrets filename ends up inside it. Never point rsync's `--delete` or an FTP client's mirror feature at a path that includes the live `.env`.
- **Process manager:** run the app with `pm2 start npm --name "trofik" -- start` (or an ecosystem file pinning `NODE_ENV=production` and the port). PM2 restarts the Node process on crash and on server reboot (`pm2 startup` + `pm2 save`).
- **Reverse proxy:** Nginx listens on 80/443, terminates TLS (Let's Encrypt via certbot), and proxies to the internal Node port (`proxy_pass http://127.0.0.1:3000;` typically) with `proxy_set_header Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto` set so Next.js sees the real client info.
- **Headers** (CSP/HSTS/X-Frame-Options/etc.) are set the normal Next.js way — via `headers()` in `next.config.js` or middleware — since there's no static-export restriction anymore. No `.htaccess`, no OPcache gotchas.
- **Smoke test after every deploy:** curl the homepage and a DB-backed page, confirm HTTP 200 and expected content, check `pm2 logs trofik` for startup errors before considering the deploy done.
- **Zero-downtime restarts:** prefer `pm2 reload trofik` over `restart` where the app supports it, so a deploy doesn't drop in-flight requests.

---

## SEO Infrastructure

- `metadataBase` set once in `app/layout.jsx` (the site's real production URL — _[TODO: домен]_) — this resolves all relative OG/canonical URLs across the app, so every page's `openGraph.url` and `alternates.canonical` can stay relative/page-scoped instead of hardcoding the domain everywhere.
- `app/sitemap.js` / `app/robots.js` via Next.js file conventions — generated **dynamically per request** (or on a `revalidate` interval), querying MySQL directly for services/blog entries. New services/posts appear in the sitemap without a rebuild.
- `alternates.canonical` on every page, pointing at the canonical (non-parameterized, non-trailing-slash-duplicated) URL.
- Fonts only via next/font.
- JSON-LD (`<script type="application/ld+json">`) for entities — built from live DB data at request time where relevant: `BeautySalon` (LocalBusiness: address, geo, openingHours, telephone), `Service`/`Offer` for services with prices, `Review`/`AggregateRating`, plus `WebSite`/`BreadcrumbList`.

---

## Task Workflow

**Small** (1-2 files, styling, point fixes) — just do it.
**Large** (new feature, structural change, Server/Client boundary calls) — plan first.
Rule of thumb: expensive to redo if wrong? → plan first.

1. Unfinished PLAN.md? Ask whether to continue or restart.
2. Analyze affected code.
3. Write PLAN.md: goal, files (marked Server/Client), steps, risks.
4. Show plan, wait for confirmation (unless "automatic mode" was requested for this session).
5. Follow it; note and flag any deviation.
6. Mark complete when done.

---

## Git & Commits

Claude commits and pushes on its own — don't wait to be asked. Claude decides what counts as "something worth committing" (a finished PLAN.md step, a completed feature, a meaningful fix), not just at the very end of the whole task.

- After finishing a self-contained piece of work (not mid-edit, not a half-broken state), stage and commit with a clear, descriptive message (match the project's existing commit style/language) summarizing what changed and why.
- Push to the remote after each such commit, unless working on a feature branch awaiting review or explicitly told to hold off.
- Don't ask permission before each individual commit — this is default behavior. Do call it out in the summary if a commit touches something risky (env vars, deleted files, hosting/config changes) so the person notices.
- Never commit secrets/tokens (per the Env vars rule above) — verify .env files are gitignored before the first commit of a session.
- One commit per logical change: don't bundle unrelated fixes into one commit, and don't split a single atomic change across many tiny commits.

---

## Code Principles

- Clean, no over-abstraction. No new deps without a stated reason.
- Comments only where logic isn't obvious.
- After big changes: recheck Server/Client boundaries.
- TypeScript if the project supports it. Small, focused components.
- Before deploying: verify SSR fetches, metadata, no console errors.
