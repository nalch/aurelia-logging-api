import { LogManager } from 'aurelia-framework';

import { apiRequestLogger } from './interceptors';
import { BackendAppender } from './log-appender';

const logger = LogManager.getLogger('AureliaBackendLogging');
let appender;

const defaultConfig = {
  catchWindowErrors: false,
  catchPromiseRejections: false,
  flushOnUnload: true
};

export function configure(aurelia, config) {
  const mergedConfig = Object.assign(defaultConfig, config);
  appender = new BackendAppender(mergedConfig);
  LogManager.addAppender(appender);

  if (mergedConfig.catchWindowErrors) {
    window.onerror = logger.error;
  }
  if (mergedConfig.catchPromiseRejections) {
    window.onunhandledrejection =
      (event) => logger.error('unhandledrejection', event.reason.message);
  }
  if (mergedConfig.flushOnUnload) {
    window.onunload = () => flushQueue();
  }

  aurelia.container.registerInstance(BackendAppender, appender);
}

export function flushQueue() {
  appender.flushQueue();
}

export {
  BackendAppender,
  apiRequestLogger
};
