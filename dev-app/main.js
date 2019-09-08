// regenerator-runtime is to support async/await syntax in ESNext.
// If you don't use async/await, you can remove regenerator-runtime.
import 'regenerator-runtime/runtime';
import environment from './environment';

import { HttpClient } from 'aurelia-fetch-client';

import { apiRequestLogger } from 'resources/interceptors';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging(environment.debug ? 'debug' : 'warn');

  const client = new HttpClient().configure((config) => {
    config.withInterceptor(apiRequestLogger);
  });

  aurelia.use.plugin('resources', {
    targetUrl: 'logs',
    bufferSize: 100,
    client: client,
    joinMessage: false,
    catchWindowErrors: true,
    catchPromiseRejections: true
  });

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => {
    aurelia.setRoot();
  });
}
