const {list, description} = require('./api');
const _ = require('lodash');

module.exports = {
  Query: {
    random: () => {
      return list().then((theList) => _.sample(theList))
    },
    list: () => {
      return list();
    },
  },
  Bias: {
    description: (bias) => description(bias.url)
  }
}
