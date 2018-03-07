const Path = require('path');

module.exports = {
  method: 'GET',
  path: '/{param*}',
  handler: (request, h) => {
    return h.file(request.params.param || 'index.html')
  }
}
