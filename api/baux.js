const scrapeIt = require('scrape-it');
const fs = require('fs');
const saveFile = require('../lib/saveFile.js')

const lineName = 'baux';
const line = [];

const lineUrls = [
  'https://www.baux.se/patterns/filter/tiles/f/f/f/',
  'https://www.baux.se/patterns/filter/panels/f/f/f/'
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
        listItem: '.product.has-post-thumbnail',
        data: {
          link: {
            selector: 'a.product-link',
            attr: 'href'
          },
          image: {
            selector: 'img.product-loop-image',
            attr: 'src'
          },
          title: {
            selector: 'div.title',
            convert: x => x.replace(/        Tiles used:.*/gi, '')
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
