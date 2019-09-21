import { LogManager, inject } from 'aurelia-framework';

import { BackendAppender } from 'resources';

const logger = LogManager.getLogger('AureliaDevApp');

@inject(BackendAppender)
export class App {
  message = 'from Aurelia!';

  constructor(appender) {
    this.appender = appender;
    logger.debug('Use the injected appender', appender);
  }

  clicked() {
    logger.info('send', 'information', 'as', 'needed');
  }
}
