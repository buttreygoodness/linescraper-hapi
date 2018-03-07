const fs = require('fs');

async function saveFile(lineName, data) {
  const indexName = `${__dirname}/../linefiles/index.json`
  const dirName = `${__dirname}/../linefiles/${lineName}`
  const fileName = `${lineName}.json`
  const emptyObj = [];
  let lineData;

  if (!fs.existsSync(dirName)) {
    fs.mkdir(dirName, (err) => {
      if (err) {
        return console.error(err);
      }
    })
  }

  fs.writeFile(`${dirName}/${lineName}.json`, JSON.stringify(data), 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  })

  if (!fs.existsSync(indexName)) {
    fs.writeFileSync(`${indexName}`, JSON.stringify(emptyObj))
  }

  lineData = JSON.parse(fs.readFileSync(`${indexName}`))

  lineData.push({
    name: lineName,
    endpoint: `/api/${lineName}`
  })

  fs.writeFile(`${indexName}`, JSON.stringify(lineData), 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }
  })
}

module.exports = saveFile;
