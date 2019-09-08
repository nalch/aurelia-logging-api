import { LogManager } from 'aurelia-framework';
import { logLevel } from 'aurelia-logging';

import moment from 'moment';
import _ from 'lodash';

import { RequestQueue } from './request-queue';

const logger = LogManager.getLogger('BackendAppender');

export class BackendAppender {
  config = {
    targetUrl: '',
    bufferSize: 100,
    maxLevel: logLevel.debug,
    joinMessage: false
  };
  messageBuffer = [];

  requestQueue;

  constructor(config) {
    if (config) {
      Object.assign(this.config, config);
    }
    this.requestQueue = new RequestQueue(config || {});

    logger.info(`Init BackendAppender. Send to ${this.config.targetUrl}`);
  }

  log(source, ...rest) {
    if (source.level > this.config.maxLevel) {
      return;
    }

    this.messageBuffer.push({
      timestamp: moment(),
      logger: source.id,
      loglevel: this.getLogLevelName(source.level),
      message: this.getMessage(rest)
    });

    if (this.messageBuffer.length > this.config.bufferSize) {
      this.flushQueue();
    }
  }

  flushQueue() {
    this.requestQueue.push(_.cloneDeep(this.messageBuffer));
    this.messageBuffer = [];
  }

  getMessage(data) {
    return this.config.joinMessage ? data.join(this.config.joinMessage) : data;
  }

  getLogLevelName(number) {
    const name = Object.entries(logLevel).find(
      ([logName, logNumber]) => number === logNumber)[0];
    return name || number;
  }

  debug = this.log;
  info = this.log;
  error = this.log;
  warn = this.log;
}
