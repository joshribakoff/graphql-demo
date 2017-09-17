module.exports = `
  type Bias {
    title: String!
    description: String!
    url: String!
  }
  type Query {
    list: [Bias]!
    random: Bias!
  }
`
