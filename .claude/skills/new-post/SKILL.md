---
name: new-post
description: Publish or update a blog post on abdoulndiongue.com. Use when Abdoul shares a draft, says "publish this post", "add a blog post", "new post", or asks to change an existing post or its motif. Turns the draft into a Markdown post, decides whether the story earns a motif, reuses or proposes one, and previews the result before anything goes live.
---

# New post

Every post uses one reading template (`src/_includes/layouts/post.njk`, styled by `assets/css/reader.css`). The template is what keeps posts consistent, so a post never needs its own CSS or layout. The only per-post design decision is the **motif**: one visual idea taken from the story itself.

The reader comes first. If a choice makes the post harder to read, don't make it.

## Steps

### 1. Put the draft in the repo, wording intact

Create `src/blog/posts/<slug>.md` with this front matter:

```yaml
---
layout: layouts/post.njk
title: ...
description: One or two lines; shown as the italic dek and in link previews.
date: YYYY-MM-DD
tags: [building, learning]
permalink: /blog/<slug>/
---
```

Do not rewrite Abdoul's sentences, punctuation or paragraphing. Fix only what he asks you to fix. If something looks like a typo, ask.

### 2. Mark the beats (sparingly)

A beat is a paragraph that is one short sentence and carries a turn in the story ("I believed.", "Keep playing."). Mark it so it sets large:

```html
<p class="beat">I believed.</p>
```

Rules: only sentences Abdoul already wrote as their own paragraph; five or fewer per post; never two in a row.

Other building blocks the stylesheet already supports, all optional:

- Voices piling on: `<div class="room"><p>"..."</p><p>"..."</p></div>` (up to three lines).
- A small table of figures the text states: `<figure class="ledger"><table>...</table></figure>`. The last row is the total.
- Section breaks: a Markdown `---` renders as the star.
- Standard Markdown headings, lists, links, block quotes, images and code blocks.

### 3. Decide whether the story earns a motif

Read the draft and answer three questions:

1. **What is the story's central object or arc?** A score, a countdown, a route, a ledger, a before and after, a build going from v0 to v3.
2. **Does it have a real start and a real end** that reading progress can travel between? The scoreboard goes from 49-76 to 107-106. The maze goes from entrance to exit.
3. **Are the facts in the text?** Every number or label the motif shows must be stated in the post.

If any answer is no, publish with no motif. The plain template is a finished design; most short notes should use it.

### 4. Reuse a motif, or propose one new one

Check the library first:

| Motif | Fits a story about | Settings |
|---|---|---|
| `scoreboard` | two sides and a score that changes: a game, a race, a bet, me against a deadline | documented at the top of `src/_includes/motifs/scoreboard.njk` |
| `maze` | finding a route: building from zero, a search, getting unstuck | documented at the top of `src/_includes/motifs/maze.njk` |

To use one, add a `motif:` block to the post's front matter. See the two existing posts for working examples.

If nothing fits and the story passed step 3, **propose** one new motif to Abdoul in a short message before building it: what it shows at the start, what it shows at the end, what moves as the reader scrolls, and which sentences in the post supply the facts. Build it only after he says yes. Taste is his call.

### 5. Building a new motif

A motif is two files with the same name:

- `src/_includes/motifs/<name>.njk`: the markup. The post layout includes it twice with `slot` set to `"panel"` (under the title) and `"closing"` (after the prose). Render nothing for a slot you don't use. Start the file with a comment that documents the front matter settings.
- `assets/js/motifs/<name>.js`: registers `window.Motifs.<name> = function (ctx) { return { update(p), resize(), redraw() }; }`. `ctx` is `{ article, config, inst, root }`; `p` is reading progress from 0 to 1; `inst` is the small readout in the top bar. `assets/js/reader.js` is the host and has the contract in its header comment.

Constraints, all of them hard:

- One motif per post.
- Nothing moves inside the reading column. Motion lives in the panel and the top-bar readout, and only in response to scrolling.
- Colors come from the tokens in `reader.css` (`--panel`, `--panel-ink`, `--panel-accent`, `--accent`). The post must look right in light and dark.
- The panel is complete without JavaScript and at 0% progress.
- No dependencies, no network requests, no invented data. If the motif interpolates between two real values, say so in a comment in its JS file.
- Add the motif to the table in step 4 of this file.

### 6. Preview before it goes live

Run the dev server (`npm run dev`, or the `site` entry in `.claude/launch.json`) and look at the post at phone width and desktop width, in light and dark. Check:

- the title, dek and first paragraph are on screen without scrolling past the panel on a phone;
- beats don't stack up or overflow;
- the top-bar readout is right at the top, the middle and the bottom of the post;
- the writing index (`/blog/`) and the home page writing section show the new post;
- the "Keep reading" link at the end goes to the next post.

Then show Abdoul the preview and wait for his go-ahead. Do not commit or push without it: pushing to `main` deploys the site.

## Updating an existing post

Edit the Markdown file. If the story's facts change, update the motif settings to match. If the motif no longer fits, remove the `motif:` block; the post falls back to the plain template.
