const fetch = require('node-fetch')
const cheerio = require('cheerio')

const BryantsWebsite = 'http://cognitivebiasoftheday.com' // why is ssl expired Bryant!? Why? :p
const endpoint = (uri) => `${BryantsWebsite}${uri}`       // create a little helper to generate endpoints

let listCache;
function list() {
  if(undefined !== listCache) {             // If we have a cached value
    console.log('cache hit for /list')
    return Promise.resolve(listCache);      // Bail out & return that.
  }

  console.log('cache miss for /list')
  return fetch(endpoint('/list'))           // fetch the list page
    .then((res) => res.text() )             // get the body
    .then((text) => {
      const $ = cheerio.load(text)            // load the body into cheerio
      const links = $('a')                    // Get all the links on this page
      const biases = []                       // Initialize an array of plain ole javascript objects (POJOs)

      $(links).each((i, elem) => {          // Iterate the links & hydrate the biases array with POJOs
        const link = $(elem)                  // Get a cherio reference to the link element
        biases.push({
          title: link.text(),
          url: link.attr('href')
        })
      })
      listCache = biases;                   // Cache the results for subsequent requests
      return biases
    })
}

let descriptionByUrlCache = {}
function description(url) {
  if(undefined !== descriptionByUrlCache[url]) {
    console.log(`cache hit for ${url}`)
    return Promise.resolve(descriptionByUrlCache[url]);
  }

  console.log(`cache miss for ${url}`)
  return fetch(endpoint(url))               // if you forgot to return the promise graphQL gives a very unhelpful error.
    .then((res) => res.text() )             // get the body
    .then((text) => {
      let $ = cheerio.load(text)            // load the body into cheerio
      return descriptionByUrlCache[url] = $('div.subheading p').text(); // Assign to cache & return
    })
}

module.exports.list = list
module.exports.description = description
