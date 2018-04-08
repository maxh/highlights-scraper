const {scrapeHighlights} = require("./index.js");

const url = process.argv[2].replace(/^"(.*)"$/, '$1');
if (!url) {
  throw Error("Expected a url.")
}

scrapeHighlights(url).then(
  highlights => console.log(highlights),
  error => console.error(error)
);
