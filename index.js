const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');
const request = require('request-promise');
const $ = require('cheerio');
const puppeteer = require('puppeteer');
const Axios = require('axios');

// page URL for scraping content
let pageUrl = 'https://memegen.link/examples';
// image URL of first image for testing purposes
let imageUrl =
  'https://memegen.link/bender/your_text/goes_here.jpg?preview=true&watermark=none&share=true';
// set the name for the directory to be used for creating folder and filenames
let directory = './memes/';
// create Array with imageNames meme1-10 to be used in function for file download
let imageNames = [];
for (i = 0; i < 10; i++) {
  imageNames.push(directory + 'meme' + `${i + 1}` + '.jpg');
}

// function to downloadfile from url
async function downloadImage(MyUrl, MyPath) {
  const url = MyUrl;
  const path = MyPath;
  const writer = fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

//define the function to download content

// http get request with request-promise, gets the full html content
request(pageUrl).then(function (html) {
  // initialize array to hold the image URLS
  // query the html with cheerio for the urls
  const imageUrls = [];

  const prefix = 'https://memegen.link';
  const selector = `('.meme-img', html).attr('src'))`;
  //Cheerio query to push image URLS to url array
  //imageUrls.push(prefix + $('.meme-img', html).attr('src')); // -> gets 10x first url

  $('.meme-img', html).each(function (i, e) {
    imageUrls.push(prefix + $(this).attr('src'));
  });
  const tenUrls = imageUrls.slice(1, 11);
  console.log(tenUrls);
  console.log(imageNames);
  for (i = 0; i < 10; i++) {
    downloadImage(tenUrls[i], imageNames[i]);
  }
});
