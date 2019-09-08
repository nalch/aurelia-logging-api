import { LogManager } from 'aurelia-framework';

const logger = LogManager.getLogger('ApiRequestLogger');

export const apiRequestLogger = {
  request(request) {
    logger.info('Request to api', request);
    return request;
  },
  response(response) {
    logger.info('Response from api', response);
    return response;
  }
};
