// server.js
// where the node app starts

// init project
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');

const apiRouter = require('./routes/api');
const DataLoadService = require('./service/DataLoadService');
const errorHandler = require('./service/GlobalErrorHandlerService').errorHandler;
const QueueService = require('./service/QueueService');
const QueueConsumerService = require('./service/QueueConsumerService');

app.use(bodyParser());
app.use(morgan());

// Plugin custom api routes to the app
app.use('/api', apiRouter);

// react app build is served as static folder, build is only available after running 'npx build' in client app folder
app.use(express.static('client/build/')); 

// serve homepage at root
app.get('/', (request, response) => {
  //response.sendFile(__dirname + '/views/index.html');
  response.sendFile(__dirname + '/client/build/index.html'); // serve react app at root
});

// Plugin global error handler to return proper error response
app.use(errorHandler);

// Load data once and make it available on all subsiquest requests
let dataservice = new DataLoadService();
dataservice.fetchData().then((data)=>{
  // provide data to app context which is available on all requests and sessions
  app.locals.data = data;

  // Start Queue service before starting server
  // This Queue is used to queue email tasks which is processed by consumer every fixed interval
  let queue = new QueueService();
  
  // store queue in app context
  app.locals.queue = queue;
  // Starting consumer service by providing the queue
  QueueConsumerService.startConsumer(app.locals.queue);

  // listen for requests :)
  const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
})


