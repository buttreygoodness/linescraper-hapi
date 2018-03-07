const scrapeIt = require('scrape-it');
const saveFile = require('../lib/saveFile.js')
const fs = require('fs');

const lineName = 'esko';
const line = [];

const lineUrls = [
  'http://eskodesign.com/'
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
        listItem: '.lamp-designs .uk-margin .uk-panel',
        data: {
          link: {
            selector: 'span.button2 a',
            attr: 'href',
            convert: x => x.replace(/^\/images\//, 'http://eskodesign.com/images/')
          },
          image: {
            selector: 'figure.uk-overlay img',
            attr: 'src',
            convert: x => x.replace(/^\/images\//, 'http://eskodesign.com/images/')
          },
          title: {
            selector: 'div h5'
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
