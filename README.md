# VSV Project (Backend)

Website: [vsv.bruh.news](https://vsv.bruh.news)

[Frontend](https://github.com/vsv-project/vsv-project.github.io)

## API

(Example)

```js
https:api.vsv.bruh.news     // Domain
  /channel                  // Channel
    /:id                    // ID of channel
      /post                 // POST message
        ?msg: string        // Message content
        ?user: token        // User token
      /get                  // GET messages
        ?scroll: number = 0 // Amount scrolled in logs
```