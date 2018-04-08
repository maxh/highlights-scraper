const {Builder, By} = require('selenium-webdriver');

const scrapeBooks = async (driver, highlightsUrl) => {
  await driver.get(highlightsUrl);
  const bookEls = await driver.findElements(By.css('.annotatedBookItem'));
  const books = await Promise.all(bookEls.map(async (bookEl) => {
    const linkEl = await bookEl.findElement(By.css(".annotatedBookItem__knhLink"));
    const link = await linkEl.getAttribute("href");

    const titleEl = await bookEl.findElement(By.css(".annotatedBookItem__bookInfo__bookTitle"));
    const title = await titleEl.getText();

    const authorEl = await bookEl.findElement(By.css(".annotatedBookItem__bookInfo__bookAuthor"));
    const author = await authorEl.findElement(By.css("span:last-child")).getText();

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

const scrapeBooksWithHighlights = async (highlightsUrl) => {
  const driver = await new Builder().forBrowser('safari').build();
  try {
    const books = await scrapeBooks(driver, highlightsUrl);
    // Note: We do this with a for loop rather than e.g. a map() because
    // webdriver must load each page serially.
    for (let i = 0; i < books.length; i++) {
      const highlightsForBook = await scrapeHighlightsForBook(driver, books[i]);
      books[i].highlights = highlightsForBook;
    }
    return books;
  } catch(e) {
    console.error(e);
  } finally {
    await driver.quit();
  }
}

const HIGHLIGHTS_URL = "https://www.goodreads.com/notes/69252350-max-heinritz";

scrapeBooksWithHighlights(HIGHLIGHTS_URL).then(books => console.log(books));
