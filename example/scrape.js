const {scrapeHighlights} = require("../index.js");

// node example/scrape.js
const URL = "https://www.goodreads.com/notes/69252350-max-heinritz";
scrapeHighlights(URL).then(highlights => console.log(highlights));
