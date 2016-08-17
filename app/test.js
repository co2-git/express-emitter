import Server from './server';

new Server((app) => {
  app.set('port', 5010).use((req, res) => {
    res.send('hello');
  });
}, {cluster: 4});
