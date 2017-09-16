const fetch = require('node-fetch')
const cheerio = require('cheerio')

let url = 'http://cognitivebiasoftheday.com' // why is ssl expired?

let endpoint = (uri) => `${url}${uri}`

export function list() {
  fetch(endpoint('/list'))
  .then((res) => res.text() )
  .then((body) => {
    let $ = cheerio.load(body)
    let links = $('a');
    $(links).each((i, elem)=>{
      let link = $(elem);
      console.log(link.text())
      console.log(link.attr('href'))
    })
  })
}
