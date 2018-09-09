const { Chromeless } = require("chromeless");

const scrapeBooks = async (chromeless, highlightsUrl) => {
  return chromeless
    .goto(highlightsUrl)
    .wait(".annotatedBookItem")
    .evaluate(() => {
      const bookEls = [].slice.call(document.querySelectorAll(".annotatedBookItem"));
      const books = bookEls.map(bookEl => {
        const linkEl = bookEl.querySelector(".annotatedBookItem__knhLink");
        const titleEl = bookEl.querySelector(".annotatedBookItem__bookInfo__bookTitle");
        const authorEl = bookEl.querySelector(".annotatedBookItem__bookInfo__bookAuthor span:last-child");
        return {
          link: linkEl.getAttribute("href"),
          title: titleEl.textContent,
          author: authorEl.textContent,
        };
      });
      return books;
    });
};

// book is {link, title, author}
const scrapeHighlightsForBook = async (chromeless, book) => {
  return chromeless
    .goto(book.link)
    .wait(".noteHighlightTextContainer__highlightContainer")
    .evaluate(() => {
      const cls = ".noteHighlightTextContainer__highlightContainer .highlightText span";
      const highlightEls = [].slice.call(document.querySelectorAll(cls));
      const highlights = highlightEls.map(highlightEl => {
        return highlightEl.textContent;
      });
      return highlights;
    });
};

const scrapeHighlights = async (
  highlightsUrl,
  chromelessOptions = {remote: false},
) => {
  const chromeless = new Chromeless(chromelessOptions);

  // Note: Mobile pages are simpler and load more reliably.
  await chromeless
    .setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B137 Safari/601.1')
    .setViewport({width: 414, height: 736, scale: 1});

  try {
    const books = await scrapeBooks(chromeless, highlightsUrl);
    // Note: We do this with a for loop rather than e.g. a map() because
    // webdriver must load each page serially.
    for (let i = 0; i < books.length; i++) {
      books[i].highlights = await scrapeHighlightsForBook(chromeless, books[i]);
    }
    return books;
  } finally {
    chromeless.end();
  }
}

module.exports = {scrapeHighlights};
