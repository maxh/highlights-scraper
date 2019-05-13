# Highlights Scraper [![npm version](https://badge.fury.io/js/highlights-scraper.svg)](https://badge.fury.io/js/highlights-scraper)

Scrape Kindle highlights from public Goodreads pages ([example](https://www.goodreads.com/notes/69252350-max-heinritz)).

## Installation

```
npm install --save highlights-scraper
```

## Usage
```js
const {scrapeHighlights} = require("highlights-scraper");

const url = "https://www.goodreads.com/notes/69252350-max-heinritz";
scrapeHighlights(url).then(
  highlights => console.log(highlights),
  error => console.error(error)
);
```

- Find your Kindle highlights URL by logging into Goodreads and clicking
"Kindle Notes & Highlights" under "Your Reading Activity" in the left panel.
- Load the URL in an incognito window to ensure the highlights you expect
to be public actually are.
- You can toggle your individual highlights to be public or not in the web UI for
a given book.

### Command-line interface

```
scrape-highlights https://www.goodreads.com/notes/69252350-max-heinritz > highlights.json
```

## Result format

```
[
  {
    link: string,
    title: string,
    author: string,
    highlights: [string],
  },
  ...
]
```

### Example

```
[
  {
    link: 'https://www.goodreads.com/notes/19028079-a-splendid-exchange/69252350-max-heinritz?ref=abp',
    title: 'A Splendid Exchange: How Trade Shaped the World',
    author: 'William J. Bernstein',
    highlights: [
      'Although world trade grew in tandem with the technological innovations of land and sea transport, political stability was even more important.',
      'To this day, success or failure in the global marketplace depends not on size but on advanced political, legal, and financial institutions;'
    ]
  },
  {
    link: 'https://www.goodreads.com/notes/20576437-crossing-to-safety/69252350-max-heinritz?ref=abp',
    title: 'Crossing to Safety (Modern Library Classics)',
    author: 'Wallace Stegner',
    highlights: [
      'It is a relationship that has no formal shape, there are no rules or obligations or bonds as in marriage or the family, it is held together by neither law nor property nor blood, there is no glue in it but mutual liking. It is therefore rare.',
      'She’s simply incredible, the way she can organize a day. But one thing, I don’t think I ever saw her pick up one of those cute kids and give him a big squeeze, just because he’s himself, and hers, and she loves him. When we get ours, don’t let me have an agenda every time I’m with him.”',
    ],
  },
]
```
