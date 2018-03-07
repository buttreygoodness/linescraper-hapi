const puppeteer = require('puppeteer');
const saveFile = require('../lib/saveFile.js')
const fs = require('fs');

const lineName = 'hennepinmade';

const scraper = {
  run: async function () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://shop.hennepinmade.com/');

    const extractedData = await this.extractData(page);

    async function save () {
      const savedFile = await saveFile(lineName, extractedData);
    }
    save();

    browser.close();

    return extractedData;
  },

  extractData: async function (page) {
    const LENGTH_SELECTOR_CLASS = 'product-grid-item';
    const LIST_TITLE_SELECTOR = '#collection-grid > li:nth-child(INDEX) > div > div.collection-hd > h3';
    const LIST_IMAGE_SELECTOR = '#collection-grid > li:nth-child(INDEX) > div > div.collection-image > img';
    const LIST_LINK_SELECTOR = '#collection-grid > li:nth-child(INDEX) > div > div.product-information > div > a';

    const dataArray = {
      title: await page.evaluate(() => {
        return document.title;
      }),
      collections: []
    };

    const itemsLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, LENGTH_SELECTOR_CLASS)

    for (let i=1; i <= itemsLength; i++) {
      let titleSelector = LIST_TITLE_SELECTOR.replace('INDEX', i);
      let linkSelector = LIST_LINK_SELECTOR.replace('INDEX', i);
      let imageSelector = LIST_IMAGE_SELECTOR.replace('INDEX', i);

      let title = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText
      }, titleSelector)

      let link = await page.evaluate((sel) => {
        return document.querySelector(sel)
        .getAttribute('href')
        .replace(/^\/([collections,products])/, 'https://shop.hennepinmade.com/$1')
      }, linkSelector)

      let image = await page.evaluate((sel) => {
        return document.querySelector(sel)
        .getAttribute('src')
        .replace(/\?v=.*$/, '')
      }, imageSelector)

      dataArray.collections.push({ title, link, image })
    }

    return [dataArray];
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
