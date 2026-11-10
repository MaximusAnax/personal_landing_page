const { DateTime } = require("luxon");

require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  // Files in /static are served from the site root (resume.pdf, favicon, robots.txt, og image).
  eleventyConfig.addPassthroughCopy({ static: "/" });

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

  eleventyConfig.addFilter("nl2br", (value) =>
    value ? String(value).replace(/\r?\n/g, "<br />") : ""
  );

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
