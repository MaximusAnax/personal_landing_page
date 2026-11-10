# abdoulndiongue.com

Source for [abdoulndiongue.com](https://abdoulndiongue.com), my personal site. It's a static [Eleventy](https://www.11ty.dev/) build with one hand-written stylesheet and about 30 lines of JavaScript, and no client framework. GitHub Pages deploys it through Actions.

## Run it

```bash
npm install
npm run dev     # http://localhost:8080
npm run build   # writes _site/
```

Requires Node 20+.

## Where things live

| What | File |
| --- | --- |
| Name, links, SEO description | `src/_data/site.js` |
| Selected work (projects) | `src/_data/projects.js` |
| Personal agent systems ("The lab") | `src/_data/lab.js` |
| Experience, leadership, education | `src/_data/experience.js` |
| News items | `src/_data/news.js` |
| Blog posts | `src/blog/posts/*.md` |
| Homepage template | `src/index.njk` |
| Layout, `<head>`, header, footer | `src/_includes/` |
| Styles (light and dark tokens) | `assets/css/site.css` |
| Files served at the root (resume, favicon, OG image, robots) | `static/` |

To add a project, append an entry to `projects.js`. The homepage renders it automatically.

## Last.fm "On rotation"

The music strip is fetched at build time, so the API key never ships to the browser.

- **Locally:** put `LASTFM_API_KEY=...` in `.env`.
- **In CI:** the key comes from the `LASTFM_API_KEY` Actions secret.

The workflow rebuilds on every push and every 6 hours. If there's no key or Last.fm returns nothing, the section is hidden; it never shows placeholder data.

GitHub pauses scheduled workflows after 60 days with no pushes. If that happens, the site stays up and only the music goes stale. Re-enable it under **Actions → Deploy → Enable workflow**.

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. `CNAME` points the custom domain at Pages.
