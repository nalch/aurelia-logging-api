[![Build Status](https://travis-ci.org/nalch/aurelia-logging-api.svg?branch=master)](https://travis-ci.org/nalch/aurelia-logging-api)
# `aurelia-logging-api`

> Catch, bundle and send all aurelia logs to an api endpoint.

`aurelia-logging-api` provides an easy to use log appender for Aurelia's LogManager to bundle logs and send them to an endpoint.

The received logs are enriched with the timestamp, source logger and loglevel of the message. The actual message will be sent as list or joined with a configurable separator:
```js
[
  {
    timestamp: '2020-01-01T12:00:00Z',
    logger: 'my-app-logger',
    loglevel: 'info',
    message: ['log', 'data', 'list']
  },
  {
    ...
  }
]
```

It adds the abilities to throttle sending after failed requests and catches the following javascript information/errors if configured to do so:
* window errors
* unhandled promise rejections
* requests/responses to the api

## Installation
```bash
npm i aurelia-logging-api --save
```

## Usage
`aurelia-logging-api` uses `aurelia-fetch-client` or `aurelia-http-client` to send logs to a server by providing it with the application's client 
or creating a new one. This makes reusing the connection configuration and authorization easier.
Use the plugin by loading it in the app's `main.js`. The configuration's default values are shown, but can be changed or omitted.
```js
import { HttpClient } from 'aurelia-fetch-client';

...

config = {
  targetUrl: '',
  client: new HttpClient(),
  bufferSize: 100,
  maxLevel: logLevel.debug,
  joinMessage: false,
  requestMethod: 'post',
  requestParams: {},
  throttleRetries: true,
  retryIntervals: [5, 60, 3600],
  catchWindowErrors: false,
  catchPromiseRejections: false,
  flushOnUnload: true
};
aurelia.use.plugin('aurelia-logging-api', config);
// for webpack user, use PLATFORM.moduleName wrapper
aurelia.use.plugin(PLATFORM.moduleName('aurelia-logging-api'), config);
```

## Configuration

| Configuration Key      | Default       | Description |
| ---------------------- | ------------- | ----------- |
| targetUrl              | ''            | Url to send the logs to. |
| client                 | null          | The http (fetch) client to be used to send the logs. Can be intercepted to log the requests/responses as well. |
| bufferSize             | 100           | Number of log messages to be bundled until the batch is sent to the server. |
| maxLevel               | debug (40)    | Max level to include in the collection of logs. Usually used to restrict lower level priority logs to the frontend instead of sending to the api. |
| joinMessage            | false         | If set to a string log message data is joined by the separator and sent as string instead of list. |
| requestMethod          | 'post'        | Request method to use for sending the logs. |
| requestParams          | {}            | Arbitrary request parameters to use for the log sending. Only needed, if they are not set on the provided client. |
| throttleRetries        | true          | Throttle subsequent requests, if a request fails. |
| retryIntervals         | [5, 60, 3600] | Intervals to wait between retrying a failed log request. If more fails occur than intervals are given, the last value is used. After a successfull request all data is retried without waiting. |
| catchWindowErrors      | false         | Catch all javascript window errors and log them as errors. |
| catchPromiseRejections | false         | Catch all unhandled promise rejections and log them as errors. |
| flushOnUnload          | false         | Flush the queue, when the window is reloaded or closed. |

## Additional error catching
`aurelia-logging-api` provides some convenience function to catch and log the following errors in the application.
### Window errors
All javascript errors caught by the window's error handler can be logged as error by setting the config's `catchWindowErrors` value to `true`.
### Undhandled promise rejections
All unhandled promise rejections (if supported by the browser) can be logged as error by setting the config's `catchPromiseRejections` value to `true`.
### Api requests/responses
All requests and responses to and from a client can be logged as info by adding `aurelia-logging-api`'s `apiRequestLogger` interceptor:
```js
import { addRequestLogger } from 'aurelia-logging-api';

...

const client = new HttpClient().configure((config) => {
  config.withInterceptor(apiRequestLogger);
});
```
