import { NextFunction, Request, Response } from 'express';

/**
 * An Express.js middleware to inject CORS flags in response headers.
 *
 * @param req  - Express Request
 * @param res  - Express Response
 * @param next - Express Next
 */
export async function enableCorsMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // If method is OPTIONS, the request is a CORS preflight one [1]. we allow the request, see https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
  if (req.method === 'OPTIONS') {
    res.send();
    return;
  } else {
    next();
  }
}
