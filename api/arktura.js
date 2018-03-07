const scrapeIt = require('scrape-it');
const saveFile = require('../lib/saveFile.js');
const fs = require('fs');

const lineName = 'arktura';
const line = [];

const lineUrls = [
  'https://arktura.com/product_system/standard-ceiling-systems/',
  'https://arktura.com/product_system/standard-wall-systems/',
  'https://arktura.com/product_system/customizable-ceiling-systems/',
  'https://arktura.com/product_system/customizable-wall-systems/'
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
        listItem: '.product-grid-item ',
        data: {
          link: {
            selector: 'a',
            attr: 'href'
          },
          image: {
            selector: '.image-container',
            attr: 'data-image-small'
          },
          title: {
            selector: 'h3',
            convert: x => x.replace(' / Show Details', '')
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
