import { LogManager } from 'aurelia-framework';

import { apiRequestLogger } from './interceptors';
import { BackendAppender } from './log-appender';

const logger = LogManager.getLogger('AureliaBackendLogging');
let appender;

export function configure(_, config) {
  appender = new BackendAppender(config);
  LogManager.addAppender(appender);

  if (config.catchWindowErrors) {
    window.onerror = logger.error;
  }
  if (config.catchPromiseRejections) {
    window.onunhandledrejection =
      (event) => logger.error('unhandledrejection', event.reason.message);
  }
}

export function flushQueue() {
  appender.flushQueue();
}

export {
  apiRequestLogger
};
