# abdoulndiongue.com

Source for [abdoulndiongue.com](https://abdoulndiongue.com), my personal site. It's a static [Eleventy](https://www.11ty.dev/) build with hand-written CSS and JavaScript, no client framework and no runtime dependencies. GitHub Pages deploys it through Actions.

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
| Home page layout, styles, interactions | `src/_includes/layouts/home.njk`, `assets/css/home.css`, `assets/js/home.js` |
| Reading pages (posts, writing index, news, 404) | `src/_includes/layouts/base.njk` and `post.njk`, `assets/css/reader.css`, `assets/js/reader.js` |
| Post motifs | `src/_includes/motifs/*.njk` with `assets/js/motifs/*.js` |
| Playbook for publishing a post | `.claude/skills/new-post/SKILL.md` |
| Files served at the root (resume, favicon, OG image, robots) | `static/` |

To add a project, append an entry to `projects.js`. The homepage renders it automatically, both as a card in the scrolling WORK section and as a row in the list under it.

## Writing a post

Add a Markdown file to `src/blog/posts/`. Every post gets the same reading template. A post can opt into one motif, a visual taken from its own story that responds to reading progress, by adding a `motif:` block to its front matter:

- `scoreboard`: two sides and a score that moves from a start to an end.
- `maze`: a maze that solves itself as the reader scrolls.

Settings are documented at the top of each file in `src/_includes/motifs/`. The full process, including when a post should have no motif and how to add a new one, is in `.claude/skills/new-post/SKILL.md`.

## Last.fm "On rotation"

The last-played track is fetched at build time, so the API key never ships to the browser.

- **Locally:** put `LASTFM_API_KEY=...` in `.env`.
- **In CI:** the key comes from the `LASTFM_API_KEY` Actions secret.

The workflow rebuilds on every push and every 6 hours. If there's no key or Last.fm returns nothing, the "On rotation" line in the home page footer is hidden; it never shows placeholder data. It is also hidden when the most recent play is more than `rotationMaxAgeDays` (in `src/_data/site.js`, 14 by default) old, which usually means the music app stopped scrobbling to Last.fm.

GitHub pauses scheduled workflows after 60 days with no pushes. If that happens, the site stays up and only the music goes stale. Re-enable it under **Actions → Deploy → Enable workflow**.

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. `CNAME` points the custom domain at Pages.
