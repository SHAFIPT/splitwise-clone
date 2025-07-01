import { Request as ExpressRequest } from 'express';

export interface CookieRequest extends ExpressRequest {
  cookies: {
    refresh_token?: string;
  };
}
