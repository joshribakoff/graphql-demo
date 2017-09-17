const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema  } = require('graphql-tools');
const typeDefs = require('./types')
const resolvers = require('./resolvers')

const schema = makeExecutableSchema({typeDefs, resolvers})

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
