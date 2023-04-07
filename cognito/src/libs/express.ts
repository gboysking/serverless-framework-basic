import { NextFunction, Request, Response } from "express";

export interface Options {
    reqPropKey?: string;
    deleteHeaders?: boolean;
}

export let eventContext = (options?: Options) => (req: Request & { [name: string]: any }, _res: Response, next: NextFunction) => {
    options = options || {}; // defaults: {reqPropKey: 'apiGateway', deleteHeaders: true}
    const reqPropKey = options.reqPropKey || 'apiGateway';
    const deleteHeaders = options.deleteHeaders === undefined ? true : options.deleteHeaders;

    if (!req.headers['x-apigateway-event'] || !req.headers['x-apigateway-context']) {
        console.error('Missing x-apigateway-event or x-apigateway-context header(s)');
        next();
        return;
    }

    if (reqPropKey != null) {
        req[reqPropKey] = {
            event: JSON.parse(decodeURIComponent(req.headers['x-apigateway-event'] as string)),
            context: JSON.parse(decodeURIComponent(req.headers['x-apigateway-context'] as string))
        }
    }

    req.headers['x-apigateway-event-requestId'] = req[reqPropKey].event.requestContext.requestId;

    if (deleteHeaders) {
        delete req.headers['x-apigateway-event']
        delete req.headers['x-apigateway-context']
    }

    next();
}
