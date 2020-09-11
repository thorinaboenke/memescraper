# memescraper

UpLeveled 2020-09-09 node.js Meme Scraper

Link to GitHub: https://github.com/thorinaboenke/memescraper

Run it on repl.it:
https://repl.it/@thorinaboenke/memescraper#.replit

downloads memes from 'https://memegen.link/examples'

```sh
$ node index.js
```

- ask user for number of memes to download and directory to save them in
- add directory name to .gitignore
- retrieve complete HTML content from 'https://memegen.link/examples'
- query html with Cheerio (node package)
- return queried meme URLS to an array
- generate filenames from the URLS
- use array of URLS and Array of names for downloading images with Axios (node package)

# memegenerator

creates memes from https://memegen.link

```sh
$ node memegenerator-index.js
```

- Choose between 35 different memes
- Enter two lines of text
- download custom meme
