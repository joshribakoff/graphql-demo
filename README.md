# graphql-demo

Run `npm install` & then `npm start` or `yarn install` & `yarn start` (preferred).

Goto `localhost:4000`. Send a graphQL query for a list of cognitive biases, or a random cognitive bias. Choose which fields you need. The script will scrape the cognitive biases website efficiently & with caching, to request the minimum amount to the backend to resolve the graphQL query. For example, if title is not requested, the response is fulfilled only by requesting `/list`, since that page has the titles & is enough to fulfill the query.
![](https://i.imgur.com/eDvVAIZ.png)

# Examples
![](https://i.imgur.com/BkPgK7z.png)
![](https://i.imgur.com/ixBBnyo.png)

# Resolver
The resolver is not documented very well in the GraphQL reference implementations (the apollo server documentation is better http://dev.apollodata.com/tools/graphql-tools/resolvers.html). The way resolvers can be nested is by flattening them like a router. First the query hits the `Query` property, and looks for the field matching your request.

Next, consider that the description property is missing from the list of biases returned by `list()`, it only returned a list of partial biases. They are missing their descriptions.

If & *only if* the user asked for the descriptions, the GraphQL resolver iterates the resolvers again, and ends up down on the `bias.description` resolver, which uses the `description()` function to resolve the description for the partial bias object into a bias object complete enough to fulfill the query. This ensures if the user does NOT select bias.description, there is no superfluous calls to the backend or extra junk in the response which wasn't needed.
```js
  Query: {
    list: () => {
      // return something like [{title:'foo'},{title:'bar'}] or in other words 'description' is missing..
      return list();
    },
  },
  
  // The "router" will never reach here, unless bias.description is part of the query.
  Bias: {
    // bias.description resolver is being assigned to promise generating description() function
    // Description() will be called with the "incomplete bias" object as it's first arg.
    // Description() is expected to return a promise, which resolves to the value of the description.
    description: description  
  }
```

For a more intuitive explanation of the resolvers concept, check out the videos about netflix's falcor. GraphQL is objectively a more robust & powerful tool but Falcor is easier to understand, partially because its more limited, but also due to it's focus on the inner workings & less developer evangelism.

# When not to use GraphQL

https://github.com/facebook/graphql/issues/91
https://github.com/facebook/graphql/issues/237

- Don't use it to convert a tree into a graph back into a tree.
- Don't use it where N+1 queries to the backend will be an issue & SQL is easier.
- Don't use it if you want a document, or blob of json. Not everything needs a strict type system. If you don't need to query into a blob of data, use REST to fetch that blob.
- Netflix's Falcor is interested because it de-dupes data using a "symlinks" concept, instead of exploding data out, which might make cyclic self referencing graphs more tennable.
- If you're a small team with simple use cases you can do this "resolver" concept with local function calls & ad-hoc query flags, without graphQL. A tree of graphQL resolvers is just like a tree of local function calls.
- https://en.wikipedia.org/wiki/Inner-platform_effect

# When to use GraphQL

- Large teams
- Many client-apps to support
- Rich views that are used in different contexts
- Network resources are limited or unreliable
- When you find yourself doing lots of client-side processing
- When you find that your backend is becoming your own sort of bug ridden hard-coded version of graphQL.

# A picture is worth 1000 words

![](https://i.imgur.com/l8cAHSN.png)
![](https://i.imgur.com/7I96Ixk.png)
![](https://i.imgur.com/BZG9Rkh.png)

https://www.youtube.com/watch?v=Tpf9kVE2AY8
