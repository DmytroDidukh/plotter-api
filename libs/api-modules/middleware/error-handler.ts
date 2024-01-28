import { NextFunction, Request, Response } from 'express';

import { ResponseService } from '../services/response';

// Express relies on the arity (number of parameters) of the function to determine if it's an error
// handling middleware or not. If the function has four parameters, Express considers it an error
// handling middleware and will pass errors to it.
// So, even if you don't actually use the next parameter in the body of the errorHandlerMiddleware
// function, you should still include it in the function signature to ensure that Express properly
// recognizes the middleware as an error handler.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandlerMiddleware(err, req: Request, res: Response, next: NextFunction) {
    // TODO: customize the response based on the error ( for example, body validation and params validation)
    ResponseService.sendError(res, err);
}

export { errorHandlerMiddleware };
