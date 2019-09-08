import { LogManager } from 'aurelia-framework';

const logger = LogManager.getLogger('AureliaDevApp');

export class App {
  message = 'from Aurelia!';

  clicked() {
    logger.info('send', 'information', 'as', 'needed');
  }
}
