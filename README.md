# Abdoul Ndiongue — Personal Site

Static personal site built with [Eleventy](https://www.11ty.dev/) on the HTML5 UP Spectral theme. Deployed to GitHub Pages at [abdoulndiongue.com](https://abdoulndiongue.com).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## Build

```bash
npm run build
```

Output is written to `_site/`.

## Last.fm (Headphone Lens)

The homepage **Headphone Lens** section pulls now playing and top albums from Last.fm at build time.

1. Create an API key at [last.fm/api/account/create](https://www.last.fm/api/account/create).
2. Set your username in [`src/_data/site.js`](src/_data/site.js): `lastfmUsername: "your-username"`.
3. For local builds, create a `.env` file in the project root:

   ```
   LASTFM_API_KEY=your_api_key_here
   ```

4. For production, add `LASTFM_API_KEY` as a **GitHub Actions secret** (Settings → Secrets and variables → Actions).

The deploy workflow rebuilds every **15 minutes** (cron) so now playing stays reasonably fresh without exposing your API key in the browser. You can also trigger a manual rebuild from the Actions tab.

Optional: change `topAlbumsPeriod` in `site.js` (`overall`, `1month`, `3month`, etc.).

If the API key or username is missing, the section falls back to placeholder albums from [`src/_data/music.js`](src/_data/music.js).

## Content workflow

| Task | Edit |
|------|------|
| Write a blog post | Add `src/blog/posts/my-post.md` with front matter (`title`, `date`, `description`, `permalink`) |
| Add news | Edit `src/_data/news.js` |
| Update interests (future About Me) | Edit `src/_data/interests.js` |
| Last.fm username / album period | Edit `src/_data/site.js` |
| Replace site photos | Overwrite files in `images/` (see `images/README.md`) |
| Change nav or footer | Edit `src/_includes/header.njk` or `footer.njk` |

### Blog post example

````markdown
---
layout: layouts/post.njk
title: My Post Title
description: |
  First line of the subtitle.
  Second line, aligned how you want it.
date: 2026-06-11
permalink: /blog/my-post-title/
---

Your content here in Markdown.
````

**Description line breaks:** use `description: |` in front matter (as above) so each line becomes a break in the post header. You can also use `<br />` in a quoted string: `description: "Line one<br />Line two"`.

## Deployment

Pushes to `main` and the 15-minute cron schedule run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes `_site/` to GitHub Pages. Ensure GitHub Pages is set to **GitHub Actions** as the source in repository settings.

## Project structure

```
src/              Templates and content
  _data/          JS data (news, interests, music, lastfm, site)
  _includes/      Shared layout partials
  blog/posts/     Markdown blog posts
  index.njk       Homepage
  portfolio.njk   Portfolio page
  news/           News archive
assets/           CSS, JS, fonts (Spectral theme)
images/           Site photos and album covers
CNAME             Custom domain for GitHub Pages
```
