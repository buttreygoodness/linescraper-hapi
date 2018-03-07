const scrapeIt = require('scrape-it');
const fs = require('fs');
const saveFile = require('../lib/saveFile.js')

const lineName = 'cabdeco';
const line = [];

const lineUrls = [
  'http://cabdeco.ca/en/product-category/chairs/?viewall=true',
  'http://cabdeco.ca/en/product-category/stools/?viewall=true',
  'http://cabdeco.ca/en/product-category/lounge-seating/?viewall=true',
  'http://cabdeco.ca/en/product-category/tables/?viewall=true',
  'http://cabdeco.ca/en/product-category/public-seating/?viewall=true',
  'http://cabdeco.ca/en/product-category/accessories/'
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
            selector: 'a.woocommerce-loop-product__link',
            attr: 'href'
          },
          image: {
            selector: 'div.product-image-front img.wp-post-image',
            attr: 'src',
            convert: x => x.replace(/^\/\//, 'http://')
          },
          title: {
            selector: 'h3 a'
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
