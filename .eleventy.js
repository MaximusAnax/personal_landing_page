const { DateTime } = require("luxon");

require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLL dd, yyyy");
  });

  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("MMM ''yy");
  });

  eleventyConfig.addFilter("newsDate", (dateStr) => {
    return DateTime.fromISO(dateStr).toFormat("MMM ''yy");
  });

  eleventyConfig.addFilter("newsDateFull", (dateStr) => {
    return DateTime.fromISO(dateStr).toFormat("LLL dd, yyyy");
  });

  eleventyConfig.addFilter("sortNews", (news) => {
    if (!news || !Array.isArray(news)) return [];
    return [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addFilter("limit", (array, limit) => {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("nl2br", (value) => {
    if (!value) return "";
    return String(value)
      .replace(/\r\n/g, "\n")
      .replace(/\n/g, "<br />");
  });

  eleventyConfig.addCollection("posts", (collection) => {
    return collection
      .getFilteredByGlob("src/blog/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

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
