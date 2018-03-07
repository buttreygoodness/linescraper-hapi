const Path = require('path');
const fs = require('fs');

module.exports = {
  method: 'GET',
  path: '/api/all',
  handler: async (request, h) => {
    const fileObj = `${__dirname}/../linefiles/index.json`

    if (fs.existsSync(fileObj)) {
      const data = fs.readFileSync(fileObj)
      return JSON.parse(data)
    }

    return 'Error';
  }
}
