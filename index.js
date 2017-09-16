const {list, description, hydrate} = require('./api');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const _ = require('lodash');

const schema = buildSchema(`
  type Bias {
    title: String!
    description: String!
    url: String!
  }
  type Query {
    list: [Bias]!
    random: Bias!
  }
`);

let root = {
  random: function() {
    return list()
      .then((theList) => {
        let bias = _.sample(theList);
        return hydrate(bias)
      })
  },
  list: () => {
    return list()
      .then((theList) => {
        return Promise.all(theList.map((bias) => {
          return hydrate(bias)
        }))
      })
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
