import { LogManager, inject } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import { HttpClient as DeprecatedClient } from 'aurelia-http-client';

const logger = LogManager.getLogger('RequestQueue');


@inject(HttpClient, DeprecatedClient)
export class RequestQueue {
  config = {
    requestMethod: 'post',
    requestParams: {},
    throttleRetries: true,
    retryIntervals: [5, 60, 3600]
  };

  requestQueue = [];

  failedAttempts = 0;
  runningRequest = false;

  constructor(config, client, deprecatedClient) {
    if (config) {
      Object.assign(this.config, config);
    }
    this.client = config.client || client || deprecatedClient;
    if (!this.client) {
      throw new Error(
        'No http client found. Pass the client in the config under the key ' +
        '"client" or register it under aurelia-fetch-client\'s or ' +
        'aurelia-http-client\'s HttpClient class in the DI container.'
      );
    }
  }

  push(requestData) {
    const payload = Object.assign(this.config.requestParams, {
      method: this.config.requestMethod,
      body: json(requestData)
    });
    this.requestQueue.push(payload);

    if (!this.runningRequest) {
      this.sendRequest();
    }
  }

  getThrottleInterval() {
    let waitInterval = 0;
    if (this.config.throttleRetries) {
      if (this.failedAttempts < this.config.retryIntervals.length) {
        waitInterval = this.config.retryIntervals[this.failedAttempts];
      } else {
        waitInterval = this.config.retryIntervals[
          this.config.retryIntervals.length - 1
        ];
      }
    }
    return waitInterval * 1000;
  }

  rescheduleRequest() {
    window.setTimeout(
      this.sendRequest.bind(this),
      this.getThrottleInterval()
    );
  }

  sendWithClient(url, payload) {
    if (this.client instanceof HttpClient) {
      return this.client.fetch(this.config.targetUrl, payload);
    } else if (this.client instanceof DeprecatedClient) {
      const clientMethod = this.client[
        this.config.requestMethod].bind(this.client);
      return clientMethod(this.config.targetUrl, payload);
    }
  }

  sendRequest() {
    if (this.requestQueue.length === 0) {
      return;
    }

    this.runningRequest = true;
    const payload = this.requestQueue[0];
    this.sendWithClient(this.config.targetUrl, payload)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        }
        this.requestQueue.splice(0, 1);
        this.failedAttempts = 0;
      })
      .catch((error) => {
        logger.error(`Couldn't send logs to endpoint: ${error}`);
        this.failedAttempts += 1;
      })
      .finally(() => {
        if (this.requestQueue.length > 0) {
          this.rescheduleRequest();
        } else {
          this.runningRequest = false;
        }
      });
  }
}
