const scrapeIt = require('scrape-it');
const saveFile = require('../lib/saveFile.js')
const fs = require('fs');

const lineName = 'offecct';
const line = [];

const lineUrls = [
  'https://www.offecct.com/product-families/'
]

const scraper = {
  run: async function () {
    for (var i = lineUrls.length - 1; i >= 0; i--) {
      await this.getItems(lineUrls[i])
      .then((response) => {
        line.push(response.data);
      })
    }
    async function save () {
      const savedFile = await saveFile(lineName, line);
    }
    save()

    return line;
  },
  getItems: async function (getUrl) {
    const response = await scrapeIt(getUrl, {
      title: 'title',
      collections: {
        listItem: 'article.product-list-article',
        data: {
          link: {
            selector: 'a.link',
            attr: 'href'
          },
          image: {
            selector: 'img',
            attr: 'src'
          },
          title: 'h1',
          designer: {
            selector: 'p.truncate',
            convert: x => x.replace('by ', '')
          }
        }
      }
    })

    return response;
  }
}

module.exports = {
  method: "GET",
  path: `/api/${lineName}`,
  handler: async (request, h) => {
    const fileObj = `${__dirname}/../linefiles/${lineName}/${lineName}.json`

    if (fs.existsSync(fileObj)) {
      const data = fs.readFileSync(fileObj)
      return JSON.parse(data)
    }

    return await scraper.run();
  }
}
