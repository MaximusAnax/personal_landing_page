const { DateTime } = require("luxon");

require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  // Files in /static are served from the site root (resume.pdf, favicon, robots.txt, og image).
  eleventyConfig.addPassthroughCopy({ static: "/" });

  // Cache-busting: `{{ "/assets/css/home.css" | asset }}` appends a short hash of the file's contents.
  // The host tells browsers to keep CSS and JS for hours; without this, a returning visitor gets the
  // new HTML with the old stylesheet after a deploy. The hash only changes when the file does.
  const fs = require("fs");
  const crypto = require("crypto");
  eleventyConfig.addFilter("asset", (url) => {
    try {
      const hash = crypto.createHash("md5").update(fs.readFileSync("." + url)).digest("hex").slice(0, 8);
      return `${url}?v=${hash}`;
    } catch (e) {
      return url;
    }
  });

  eleventyConfig.addGlobalData("build", () => ({
    year: new Date().getFullYear(),
    iso: new Date().toISOString(),
  }));

  eleventyConfig.addFilter("readableDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLL d, yyyy")
  );

  eleventyConfig.addFilter("isoDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toISODate()
  );

  eleventyConfig.addFilter("newsDate", (dateStr) =>
    DateTime.fromISO(dateStr).toFormat("LLL yyyy")
  );

  eleventyConfig.addFilter("sortNews", (news) => {
    if (!Array.isArray(news)) return [];
    return [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addFilter("limit", (array, n) =>
    Array.isArray(array) ? array.slice(0, n) : []
  );

  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  eleventyConfig.addFilter("firstLine", (value) =>
    value ? String(value).trim().split(/\r?\n/)[0] : ""
  );

  // Reading time from rendered HTML, at about 230 words a minute.
  eleventyConfig.addFilter("readTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 230));
  });

  // The next older post, wrapping to the newest. Null when there is only one post.
  eleventyConfig.addFilter("nextPost", (posts, url) => {
    if (!Array.isArray(posts) || posts.length < 2) return null;
    const i = posts.findIndex((p) => p.url === url);
    return posts[(i + 1) % posts.length];
  });

  eleventyConfig.addFilter("nl2br", (value) =>
    value ? String(value).replace(/\r?\n/g, "<br />") : ""
  );

  // Links that leave the site (and PDFs) open in a new tab, so visitors keep their place.
  // Applied to every built HTML page, so templates and Markdown posts need no per-link markup.
  const siteUrl = require("./src/_data/site.js").url;
  eleventyConfig.addTransform("newTabLinks", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/<a\s([^>]*?)href="([^"]+)"([^>]*)>/g, (tag, pre, href, post) => {
      const external = /^https?:\/\//.test(href) && !href.startsWith(siteUrl);
      const pdf = /\.pdf(\?|#|$)/.test(href);
      if ((!external && !pdf) || /\starget=/.test(tag)) return tag;
      return `<a ${pre}href="${href}"${post} target="_blank" rel="noopener">`;
    });
  });

  eleventyConfig.addCollection("posts", (collection) =>
    collection
      .getFilteredByGlob("src/blog/posts/*.md")
      .sort((a, b) => b.date - a.date)
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
