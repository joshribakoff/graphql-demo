const {list, description} = require('./api');
const _ = require('lodash');

module.exports = {
  Query: {
    random: () => {
      return list().then(_.sample)
    },
    list: () => {
      return list();
    },
  },
  Bias: {
    description: description
  }
}
