const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');
const request = require('request-promise');
const $ = require('cheerio');
const puppeteer = require('puppeteer');

// page URL for scraping content
let pageUrl = 'https://memegen.link/examples';
// image URL of first image for testing purposes
let imageUrl =
  'https://memegen.link/bender/your_text/goes_here.jpg?preview=true&watermark=none&share=true';

// http get request with request-promise, gets the full html content
request(pageUrl)
  .then(function (html) {
    // initialize array to hold the image URLS
    // query the html with cheerio for the urls
    const imageUrls = [];
    for (let i = 0; i < 10; i++) {
      const prefix = 'https://memegen.link';
      const selector = `('.meme-img', html).attr('src'))`;
      //Cheerio query to push image URLS
      //imageUrls.push($(('.meme-img').attr('src')), html)[i]);
      //imageUrls.push($('.meme-img', html)[i].attr('src'));
      //imageUrls.push($('.meme-img'.attr('src'), html)[i]);
      //imageUrls.push($('.meme-img', html).attr('src')[i]); //-> works kinda, get the letters of the string
      //imageUrls.push(prefix + $('.meme-img', html).attr('src')); // -> gets 10x first url
      /*$('.meme-img', html)
        .attr('src')
        .each(function (i, elm) {
          imageUrls.push(prefix + elm);
        });*/
      $('.meme-img', html).each(function (i, e) {
        imageUrls.push(prefix + $(this).attr('src'));
      });
      console.log(imageUrls);
    }
  })

  .catch(function (err) {
    console.log(err);
  });
/*
$('.meme-img', html).each(function(i,e) {
  console.log([this].attr('src'))


}
 $('li').each(function (i, e) {
        hobbies[i] = $(this).text();
    });

$('#browse-results li').each(function (i, elm) {
  console.log($(this).text()); // for testing do text()
});
*/
/*
  const wikiUrls = [];
    for (let i = 0; i < 45; i++) {
      wikiUrls.push($('big > a', html)[i].attribs.href);
    }
    console.log(wikiUrls);
  })
  

// look of a cheerio query
let title = $('title').text();
console.log(title);

// initialize array to hold the image URLS
*/
