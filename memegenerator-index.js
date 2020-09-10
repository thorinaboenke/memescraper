const fs = require('fs');
const request = require('request-promise');
const $ = require('cheerio');
const Axios = require('axios');
const readline = require('readline-sync');

// site to download from
const sourceUrl = 'https://api.memegen.link/images/';
// potentially limit length of string user can input?
// const maxLength;

// function to replace reserved URL characters,
// make object of reserved URL characters and their replace codes
function replacer(string) {
  const urlEscapers = {
    '?': '~q',
    '%': '~p',
    '#': '~h',
    '/': '~s',
  };
  // did not manage to create a for in method with regex and replaceAll is too new,
  // force it with loop of input length, so it cannot handle underscores or hyphen!
  for (i = 0; i < string.length + 1; i++) {
    for (key in urlEscapers) {
      string = string.replace(`${key}`, `${urlEscapers[key]}`);
    }
  }
  return string;
}

//object with memes to choose from
AllMemeNames = {
  tenguy: 'tenguy/',
  afraid: 'afraid/',
  apcr: 'apcr/',
  older: 'older/',
  aag: 'aag/',
  atis: 'atis/',
  tried: 'tried/',
  biw: 'biw/',
  stew: 'stew/',
  blb: 'blb/',
  bihw: 'bihw/',
  kermit: 'kermit/',
  bd: 'bd/',
  ch: 'ch/',
  cbg: 'cbg/',
  wonka: 'wonka/',
  cb: 'cb/',
  gandalf: 'gandalf/',
  keanu: 'keanu/',
  cryingfloor: 'cryingfloor/',
  dsm: 'dsm/',
  disastergirl: 'disastergirl/',
  live: 'live/',
  ants: 'ants/',
  doge: 'doge/',
  trump: 'trump/',
  drake: 'drake/',
  ermg: 'ermg/',
  facepalm: 'facepalm/',
  feelsgood: 'feelsgood/',
  firsttry: 'firsttry/',
  fwp: 'fwp/',
  fa: 'fa/',
  fbf: 'fbf/',
  fmr: 'fmr/',
  fry: 'fry/',
  ggg: 'ggg/',
  grumpycat: 'grumpycat/',
  harold: 'harold/',
  hipster: 'hipster/',
  icanhas: 'icanhas/',
  crazypills: 'crazypills/',
  mw: 'mw/',
  noidea: 'noidea/',
  regret: 'regret/',
  boat: 'boat/',
  hagrid: 'hagrid/',
  sohappy: 'sohappy/',
  captain: 'captain/',
  bender: 'bender/',
  inigo: 'inigo/',
  iw: 'iw/',
  ackbar: 'ackbar/',
  happening: 'happening/',
  joker: 'joker/',
  ive: 'ive/',
  jd: 'jd/',
  ll: 'll/',
  lrv: 'lrv/',
  leo: 'leo/',
  away: 'away/',
  morpheus: 'morpheus/',
  mb: 'mb/',
  badchoice: 'badchoice/',
  'mini-keanu': 'mini-keanu/',
  mmm: 'mmm/',
  spongebob: 'spongebob/',
  'soup-nazi': 'soup-nazi/',
  jetpack: 'jetpack/',
  imsorry: 'imsorry/',
  red: 'red/',
  mordor: 'mordor/',
  oprah: 'oprah/',
  oag: 'oag/',
  remembers: 'remembers/',
  persian: 'persian/',
  philosoraptor: 'philosoraptor/',
  jw: 'jw/',
  patrick: 'patrick/',
  rollsafe: 'rollsafe/',
  'sad-obama': 'sad-obama/',
  'sad-clinton': 'sad-clinton/',
  sadfrog: 'sadfrog/',
  'sad-bush': 'sad-bush/',
  'sad-biden': 'sad-biden/',
  'sad-boehner': 'sad-boehner/',
  saltbae: 'saltbae/',
  sarcasticbear: 'sarcasticbear/',
  dwight: 'dwight/',
  sb: 'sb/',
  ss: 'ss/',
  soa: 'soa/',
  sf: 'sf/',
  dodgson: 'dodgson/',
  money: 'money/',
  snek: 'snek/',
  sk: 'sk/',
  sohot: 'sohot/',
  nice: 'nice/',
  'awesome-awkward': 'awesome-awkward/',
  awesome: 'awesome/',
  'awkward-awesome': 'awkward-awesome/',
  awkward: 'awkward/',
  'stop-it': 'stop-it/',
  fetch: 'fetch/',
  success: 'success/',
  scc: 'scc/',
  ski: 'ski/',
  'aint-got-time': 'aint-got-time/',
  officespace: 'officespace/',
  interesting: 'interesting/',
  toohigh: 'toohigh/',
  bs: 'bs/',
  fine: 'fine/',
  sparta: 'sparta/',
  ugandanknuck: 'ugandanknuck/',
  puffin: 'puffin/',
  whatyear: 'whatyear/',
  center: 'center/',
  both: 'both/',
  winter: 'winter/',
  xy: 'xy/',
  buzz: 'buzz/',
  yodawg: 'yodawg/',
  yuno: 'yuno/',
  yallgot: 'yallgot/',
  gears: 'gears/',
  bad: 'bad/',
  elf: 'elf/',
  chosen: 'chosen/',
};

//console.log(AllMemeNames);

let longMemeArray = Object.keys(AllMemeNames);
//console.log(longMemeArray);
// selecting via keys works only with 35 items, slice array, maybe upgrade later
let memeArray = longMemeArray.slice(0, 34);
//folder to save custon meme
dir = './custommeme';

//query user input
index = readline.keyInSelect(memeArray, `Which meme do you want to use? `);
console.log('Ok, lets make a  ' + memeArray[index] + ' meme');
chosenMeme = AllMemeNames[memeArray[index]];

const firstline = readline.question(`Enter first line of Text: `);
const secondline = readline.question(`Enter second line of Text: `);

const Name = chosenMeme;
const slash = '/';
const fileExtension = '.png';

const Text1 = replacer(replaceSpaces(firstline));
const Text2 = replacer(replaceSpaces(secondline));
//console.log(Text1);
//console.log(Text2);

const memeUrl = sourceUrl + Name + Text1 + slash + Text2 + fileExtension;
//console.log('memeUrl:' + memeUrl + '\n\n');

//function to replace spaces with underscores
function replaceSpaces(string) {
  let stringUnderscored = string.replace(/ /g, '_');
  return stringUnderscored;
}

// function to make folder
function makeFolder(directory) {
  fs.mkdir(directory, function (err) {
    if (err) {
      console.error(
        err,
        `The folder already exists. I'll add the meme to it I guess.`,
      );
    } else console.log(`Created a new folder ${directory}`);
  });
}

// function to add foldername to .gitignore
function addFolderToGitIgnore(FolderName) {
  // use regex to remove prefixes that are not character, but leave the last /
  let FolderNameTrim = FolderName.replace(/^\W*/, '');
  fs.appendFile('.gitignore', `\n${FolderNameTrim}/`, function (err) {
    if (err) return console.log(err);
    console.log(`The folder ${FolderNameTrim}/ was added to .gitignore`);
  });
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
//console.log('chosenmeme:' + chosenMeme);

let path =
  dir +
  slash +
  chosenMeme.replace('/', '_') +
  Text1 +
  '_' +
  Text2 +
  fileExtension;
//console.log('path:' + path);

makeFolder(dir);
addFolderToGitIgnore(dir);
downloadImage(memeUrl, path);
