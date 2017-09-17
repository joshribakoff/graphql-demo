const {list, description} = require('./api');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const _ = require('lodash');
const { makeExecutableSchema  } = require('graphql-tools');

const typeDefs = `
  type Bias {
    title: String!
    description: String!
    url: String!
  }
  type Query {
    list: [Bias]!
    random: Bias!
  }
`;

const resolvers = {
  Query: {
    random: function() {
      return list()
        .then((theList) => {
          let bias = _.sample(theList);
          return bias;
        })
    },
    list: () => {
      return list()
        .then((theList) => {
          return theList.map((bias) => {
            return bias;
          })
        })
    },
  },
  Bias: {
    description: (bias) => {
      return description(bias.url)
    }
  }
}

const schema = makeExecutableSchema({typeDefs, resolvers})

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
