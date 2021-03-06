const fs = require('fs');
const request = require('request-promise');
const $ = require('cheerio');
const Axios = require('axios');
const readline = require('readline-sync');

// define page URL for scraping content
let pageUrl = 'https://memegen.link/examples';
// set the name for the directory to be used for creating folder and filenames
// Check if a valid name was entered
function askFolder() {
  const maxLength = 255;
  let directory = readline.question(
    'Where would you like to save your memes? Please specify a folder name (can only contain letters, numbers and underscores). If the folder does not exist yet in the current directory it will be created: ',
  );
  if (directory.length > maxLength) {
    console.log(
      `Sorry, that's too long. Please use max ${maxLength} characters: `,
    );
    askFolder();
  } else if (/^\w+$/.test(directory)) {
    console.log(`Memes will be saved in folder '${directory}'.`);
    directory = './' + directory + '/';
    return directory;
  } else {
    console.log(
      'Sorry, that is not a valid name. The folder name can only contain letters, numbers and underscores',
    );
    askFolder();
  }
}
let directory = askFolder();
// function to ask the user for input (1-20), save return to imageNumber
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
    `How many memes would you like to download? Please enter a number between 1 and 20: `,
  );
  if (imageNumber === '1') {
    console.log(`Downloading ${imageNumber} great meme.`);
  } else if (
    /^\d+$/.test(imageNumber) &&
    1 < parseInt(imageNumber, 10) &&
    parseInt(imageNumber, 10) < 21
  ) {
    console.log(pikachu);
    console.log(`Downloading ${imageNumber} great memes.`);
    return parseInt(imageNumber, 10);
  } else {
    console.log('Sorry, that is not a valid input.');
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
// the goal is to extact a meaningful filename from the url  for filenaming:
//get everything between link/ and .jpg and replace everything that is not a character with _
function extractName(string) {
  const name = string.substring(
    string.indexOf('link/') + 4,
    string.lastIndexOf('.jpg'),
  );
  const nameWithUnderscores = name
    .replace(/\W/g, '_')
    .replace('_your_text_goes_here', '');
  //console.log(nameWithUnderscores);
  return nameWithUnderscores;
}

// function to download file from url
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
function makeFolder(directory) {
  fs.mkdir(directory, function (err) {
    if (err) {
      console.error(
        err,
        `!!!!! The folder already exists. I'll just add more memes to it I guess.`,
      );
    } else console.log(`Created a new folder ${directory}`);
  });
}
makeFolder(directory);

addFolderToGitIgnore(directory);

// http get request with request-promise, gets the full html content
request(pageUrl)
  .then(function (html) {
    // initialize array to hold the image URLS
    // query the html with cheerio for the urls
    const imageUrls = [];

    const prefix = 'https://memegen.link';
    //const selector = `('.meme-img', html).attr('src'))`;
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
    // this adds a custom made progress bar
    const symbol = '\u2588'; //unicode character for filled square == progress
    const restSymbol = '#'; // == remaining par of the bar
    const total = 50; // == length of the bar
    const chunks = imageNames.length; //number of downloads
    const portion = total / chunks; //devide 100% by number of donwloads
    let barPortion = '';
    for (i = 0; i < portion / 2; i++) {
      barPortion += symbol;
    }

    // for loop to download from urls and render the corresponding progress after every iteration
    for (let i = 0; i < imageNames.length; i++) {
      setTimeout(function () {
        downloadImage(tenUrls[i], imageNames[i]);
        let indicator = new Array(Math.round(portion * i))
          .fill(symbol)
          .join('');
        let rest = new Array(total - indicator.length)
          .fill(restSymbol)
          .join('');

        process.stdout.clearLine(); // clear current text
        process.stdout.cursorTo(0); //move cursor to the left
        process.stdout.write(
          `Download in progress: ${
            Math.round(100 / chunks) * i
          }% ${indicator}${rest}`,
        );
        if (i === imageNames.length - 1) {
          //for last iteration print completed message
          let completed = new Array(total).fill(symbol).join('');

          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(`Download has finished: 100% ${completed}`);
        }
      }, i * 300); //this sets timeout for each iteration to make progress visible, decrease for more iterations?
    }

    //
  })
  .catch(function (err) {
    console.log(err);
  });
