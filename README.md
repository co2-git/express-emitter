express-emitter
===

Start a new HTTP server in one-line. Based on express. Emittable and controllable.

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
- starting
- closing

# Stop and restart server

```js
const server = new Server();

// Stop server
server.stop();

// Start server
server.start();

// Restart server
server.restart();

// You can chain control actions with listeners
server
  .restart()
  .on('closed', () => console.log('closed'))
  .on('listening', () => console.log('listening'));
```

# Customize app

You can customize the express app:

```js
new Server(app => {
  app.set('port', 4000);

  app.get('/', (req, res, next) => res.send('Welcome to my server!'));

  app.use('/', (req, res, next) => next(new Error('Only GET accepted !')));
});
```

Checkout express documentation for more.
