const inert = require('./inert.js');
const all = require('./all.js');

const arktura = require('./arktura.js');
const baux = require('./baux.js');
const cabdeco = require('./cabdeco.js');
const esko = require('./esko.js');
const finium = require('./finium.js');
const hennepinmade = require('./hennepinmade.js');
const offecct = require('./offecct.js');
const rbw = require('./rbw.js');

module.exports = {
  name: "ApiPlugin",
  register: async (server, options) => {
    server.route([
      all,
      inert,
      arktura,
      baux,
      cabdeco,
      esko,
      finium,
      hennepinmade,
      offecct,
      rbw
    ]);
  }
}
