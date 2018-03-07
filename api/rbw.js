const puppeteer = require('puppeteer');
const fs = require('fs');
const saveFile = require('../lib/saveFile.js');

const lineName = 'rbw';

const scraper = {
  run: async function () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const lineName = 'rbw';

    await page.goto('https://richbrilliantwilling.com/collections/all');

    const extractedData = await this.extractData(page);

    async function save () {
      const savedFile = await saveFile(lineName, extractedData);
    }
    save();

    browser.close();

    return extractedData;
  },

  extractData: async function (page) {
    const LENGTH_SELECTOR_CLASS = 'eight columns thumbnail';
    const LIST_TITLE_SELECTOR = '#content_wrapper > div:nth-child(1) > div.container.main.content > div:nth-child(1) > div.featured_collections > div:nth-child(INDEX) > div > div > a:nth-child(1) > h5';
    const LIST_IMAGE_SELECTOR = '#content_wrapper > div:nth-child(1) > div.container.main.content > div:nth-child(1) > div.featured_collections > div:nth-child(INDEX) > div > a > img';
    const LIST_LINK_SELECTOR = '#content_wrapper > div:nth-child(1) > div.container.main.content > div:nth-child(1) > div.featured_collections > div:nth-child(INDEX) > div > a';

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
        .replace(/^\/([collections,products])/, 'https://richbrilliantwilling.com/$1')
      }, linkSelector)

      let image = await page.evaluate((sel) => {
        return document.querySelector(sel)
        .getAttribute('data-src')
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
