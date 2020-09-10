# memescraper

UpLeveled 2020-09-09 node.js Meme Scraper

https://repl.it/@thorinaboenke/memescraper#.replit

downloads memes from 'https://memegen.link/examples'

Performs the following steps:

- ask user for number of memes to download and directory to save them in
- add directory name to .gitignore
- retrieve complete HTML content from 'https://memegen.link/examples'
- query html with Cheerio (node package)
- return queried meme URLS to an array
- generate filenames from the URLS
- use array of URLS and Array of names for downloading images with Axios (node package)
