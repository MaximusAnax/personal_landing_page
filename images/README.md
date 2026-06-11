# Site Images

Replace these placeholder files with your own photos. **Keep the exact filenames** — the theme references them by path.

## Required files

| File | Used for | Recommended size |
|------|----------|------------------|
| `banner.jpg` | Homepage hero background | Landscape, ≥ 1920×1080 |
| `pic01.jpg` | About Me spotlight | Portrait, ≥ 800×1000 |
| `pic02.jpg` | Builder spotlight | Portrait, ≥ 800×1000 |
| `pic03.jpg` | Professional Interests spotlight | Portrait, ≥ 800×1000 |
| `pic04.jpg` | Headphone Lens spotlight | Portrait, ≥ 800×1000 |
| `music/album1.jpg` … | Album cover thumbnails | Square, ≥ 300×300 |

## How to swap in your photos

1. Export as JPG (PNG OK for album covers).
2. Resize before adding (banner max ~2400px wide; spotlights ~1200px; covers 300×300).
3. **Overwrite** the placeholder file — do not rename.
4. For custom album filenames, update `coverUrl` in [`src/_data/music.js`](../src/_data/music.js).
5. Run `npm run dev` and check `/`.
6. Commit and push so GitHub Pages can serve them.

## Blog images (optional)

Create `images/blog/` and reference in Markdown: `![alt text](/images/blog/my-photo.jpg)`.
