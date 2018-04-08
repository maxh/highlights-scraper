const {Builder, By} = require('selenium-webdriver');

const scrapeBooks = async (driver, highlightsUrl) => {
  await driver.get(highlightsUrl);
  const bookEls = await driver.findElements(By.css('.annotatedBookItem'));
  const books = await Promise.all(bookEls.map(async (bookEl) => {
    const linkEl = await bookEl.findElement(
      By.css(".annotatedBookItem__knhLink")
    );
    const link = await linkEl.getAttribute("href");

    const titleEl = await bookEl.findElement(
      By.css(".annotatedBookItem__bookInfo__bookTitle")
    );
    const title = await titleEl.getText();

    const authorEl = await bookEl.findElement(
      By.css(".annotatedBookItem__bookInfo__bookAuthor span:last-child"),
    );
    const author = await authorEl.getText();

    return {link, title, author};
  }));
  return books;
};

// book is {link, title, author}
const scrapeHighlightsForBook = async (driver, book) => {
  await driver.get(book.link);
  const els = await driver.findElements(
    By.css(".noteHighlightTextContainer__highlightContainer .highlightText")
  );
  const highlights = await Promise.all(els.map(async (el) => {
    return await el.findElement(By.css("span")).getText();
  }));
  return highlights;
};

const scrapeHighlights = async (highlightsUrl) => {
  const driver = await new Builder().forBrowser('safari').build();
  try {
    const books = await scrapeBooks(driver, highlightsUrl);
    // Note: We do this with a for loop rather than e.g. a map() because
    // webdriver must load each page serially.
    for (let i = 0; i < books.length; i++) {
      books[i].highlights = await scrapeHighlightsForBook(driver, books[i]);
    }
    return books;
  } finally {
    await driver.quit();
  }
}

module.exports = {scrapeHighlights};
