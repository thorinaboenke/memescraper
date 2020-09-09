const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');
const request = require('request-promise');
const $ = require('cheerio');
const Axios = require('axios');
const readline = require('readline-sync');

// page URL for scraping content
let pageUrl = 'https://memegen.link/examples';
// image URL of first image for testing purposes
let imageUrl =
  'https://memegen.link/bender/your_text/goes_here.jpg?preview=true&watermark=none&share=true';
// set the name for the directory to be used for creating folder and filenames
let directory = './memes/';
// function to ask the user how many memes he wants to download, save return to image number
function askNumber() {
  const pikachu = `⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⣠⣤⣶⣶ 
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣀⣀⣾⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⡏⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿ 
⣿⣿⣿⣿⣿⣿⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠉⠁⠀⣿ 
⣿⣿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠙⠿⠿⠿⠻⠿⠿⠟⠿⠛⠉⠀⠀⠀⠀⠀⣸⣿ 
⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣴⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⢰⣹⡆⠀⠀⠀⠀⠀⠀⣭⣷⠀⠀⠀⠸⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠈⠉⠀⠀⠤⠄⠀⠀⠀⠉⠁⠀⠀⠀⠀⢿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⢾⣿⣷⠀⠀⠀⠀⡠⠤⢄⠀⠀⠀⠠⣿⣿⣷⠀⢸⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⡀⠉⠀⠀⠀⠀⠀⢄⠀⢀⠀⠀⠀⠀⠉⠉⠁⠀⠀⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿ 
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿`;

  const imageNumber = readline.question(
    `How many memes would you like to download? Please enter a number between 1 and 99: `,
  );
  if (0 < parseInt(imageNumber, 10) && parseInt(imageNumber, 10) < 100) {
    //console.log(pikachu);
    console.log(`Downloading ${imageNumber} great memes.`);
    return parseInt(imageNumber, 10);
  } else {
    console.log('Sorry, thats not a valid input.');
    askNumber();
  }
}

const imageNumber = askNumber();

// function to add foldername to .gitignore
function addFolderToGitIgnore(FolderName) {
  // use regex to remove prefixes that are not character, but leave the last /
  let FolderNameTrim = FolderName.replace(/^\W*/, '');
  fs.appendFile('.gitignore', `\n${FolderNameTrim}`, function (err) {
    if (err) return console.log(err);
    console.log(`The folder ${FolderNameTrim} was added to .gitignore`);
  });
}
// the goal is to extact a meaningful filename from the url to append to meme1 for filenaming
//get everything between link/ and .jpg and replace everything that is not a character with _
function extractName(string) {
  const name = string.substring(
    string.lastIndexOf('link/') + 4,
    string.lastIndexOf('.jpg'),
  );
  const nameWithUnderscores = name
    .replace(/\W/g, '_')
    .replace('_your_text_goes_here', '');
  console.log(nameWithUnderscores);
  return nameWithUnderscores;
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

//make directory
fs.mkdirSync(directory);
// add directory to gitignore
addFolderToGitIgnore(directory);

// http get request with request-promise, gets the full html content
request(pageUrl)
  .then(function (html) {
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
    const tenUrls = imageUrls.slice(1, imageNumber + 1);
    // generate image names here

    let imageNames = [];
    for (i = 0; i < imageNumber; i++) {
      imageNames.push(
        directory +
          'meme_' +
          `${i + 1}` +
          `${extractName(tenUrls[i])}` +
          '.jpg',
      );
    }

    for (i = 0; i < imageNumber; i++) {
      downloadImage(tenUrls[i], imageNames[i]);
    }
  })
  .catch(function (err) {
    console.log(err);
  });
