import { LogManager } from 'aurelia-framework';

const logger = LogManager.getLogger('ApiRequestLogger');

export const apiRequestLogger = {
  request(request) {
    logger.info('Request to api', request.url, request.method);
    return request;
  },
  response(response) {
    logger.info('Response from api', response.url, response.status);
    return response;
  }
};
