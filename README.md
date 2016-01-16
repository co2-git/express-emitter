express-emitter
===

  Module that wraps express into an events emitter.

# One-liner

Create a new HTTP server that is ready to accept incoming connections in one line:

```js
import Server from 'express-emitter';

// Launches a new HTTP server

new Server();
```

# Listen

`Server` extends node's `EventEmitter` so you can listen to it:

```js
new Server()

  .on('listening', () => console.log('Server is listening'))

  .on('error', error => console.log(error.stack))

  .on('closed', () => console.log('Server is closed'));
```

# Events

- listening
- error
- closed

# Stop and restart server

```js
const server = new Server();

// Stop server
server.stop().on('closed', () => console.log('closed'));

// Start server
server.start().on('listening', () => console.log('closed'));

// Restart server
server
  .stop()
  .start()
  .on('closed', () => console.log('closed'))
  .on('listening', () => console.log('closed'));
```

# Routes

Pass a function as a first argument and it will be feed with the express app:

```js
new Server(app => {
  app.get('/', (req, res, next) => res.send('Welcome to my server!'));

  app.use('/', (req, res, next) => next(new Error('Only GET accepted !')));
});
```

# Options

You can pass any options that will be evaluated as an express attribute.

```js
new Server({ port : 4000 });
```

# Usage

```
{EventEmitter} new Server();
{EventEmitter} new Server([Function]);
{EventEmitter} new Server([Function], {Object});
{EventEmitter} new Server({Object});
{EventEmitter} new Server({Object}, [Function]);
```

# More

More? Checkout express documentation.
