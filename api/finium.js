const scrapeIt = require('scrape-it');
const saveFile = require('../lib/saveFile.js');
const fs = require('fs');

const lineName = 'finium';
const line = [];

const lineUrls = [
  'http://finium.ca/en/collections/'
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
      title: {
        selector: 'title',
        convert: x => `Finium ${x}`
      },
      collections: {
        listItem: 'div.container.box .col-md-4',
        data: {
          link: {
            selector: 'a',
            attr: 'href',
            convert: x => x.replace(/^\/en\//, 'http://finium.ca/en/')
          },
          image: {
            selector: 'img.img-fluid',
            attr: 'src'
          },
          title: {
            selector: 'a'
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
