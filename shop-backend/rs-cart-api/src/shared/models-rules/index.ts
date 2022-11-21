import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  if(request.user) {
    return request.user.id;
  }

  if(request.body && request.body.user) {
    return request.body.user.id;
  }
  return 'b2c4e1c4-7dbb-432d-90ba-dd1fd3e32abd';
}
