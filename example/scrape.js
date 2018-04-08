const {scrapeHighlights} = require("../index.js");

// node example/scrape.js
const url = "https://www.goodreads.com/notes/69252350-max-heinritz";
scrapeHighlights(url).then(
  highlights => console.log(highlights),
  error => console.error(error)
);
