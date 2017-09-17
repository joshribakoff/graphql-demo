# graphql-demo

Run `npm install` & then `npm start` or `yarn install` & `yarn start` (preferred).

Goto `localhost:4000`. Send a graphQL query for a list of cognitive biases, or a random cognitive bias. Choose which fields you need. The script will scrape the cognitive biases website efficiently & with caching, to request the minimum amount to the backend to resolve the graphQL query. For example, if title is not requested, the response is fulfilled only by requesting `/list`, since that page has the titles & is enough to fulfill the query.
![](https://i.imgur.com/eDvVAIZ.png)

# Examples
![](https://i.imgur.com/BkPgK7z.png)
![](https://i.imgur.com/ixBBnyo.png)

# Resolver
The resolver is not documented very well in the GraphQL reference implementations (the apollo server documentation is better http://dev.apollodata.com/tools/graphql-tools/resolvers.html). The way resolvers can be nested is by flattening them like a router. First the query hits the `Query` property, and looks for the field you're requesting (random, or list).

Next, consider that the description property is missing from the list of biases returned by `list()`, it only returned a list of partial biases, that is they're missing their descriptions.

If & *only if* the user asked for the descriptions, the GraphQL resolver iterates the resolvers again, ands end up on the `bias.description` resolver, which uses the `description()` function to resolve the description for the partial bias object into a complete (from the query's perspective) hydrated object.
```js
  Query: {
    list: () => {
      // return something like [{title:'foo'},{title:'bar'}] or in other words 'description' is missing..
      return list();
    },
  },
  
  // The "router" will never reach here, unless bias.description is part of the query.
  Bias: {
    // bias.description will resolve to the promise returned by description()
    // this causes an http fetch for the details page of the bias, to get the description
    description: description  
  }
```

# When not to use GraphQL

https://github.com/facebook/graphql/issues/91
https://github.com/facebook/graphql/issues/237

- Don't use it to convert a tree into a graph back into a tree.
- Don't use it where N+1 queries to the backend will be an issue & SQL is easier.
- Don't use it if you want a document, or blob of json. Not everything needs a strict type system. If you don't need to query into a blob of data, use REST to fetch that blob.

# When to use GraphQL

- Large teams
- Many client-apps to support
- Rich views that are used in different contexts
- Network resources are limited or unreliable

# A picture is worth 1000 words

![](https://i.imgur.com/l8cAHSN.png)
![](https://i.imgur.com/7I96Ixk.png)
![](https://i.imgur.com/BZG9Rkh.png)

https://www.youtube.com/watch?v=Tpf9kVE2AY8
