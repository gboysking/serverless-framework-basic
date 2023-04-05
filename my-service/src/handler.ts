// import serverless from 'serverless-http';
import serverlessExpress from '@vendia/serverless-express';
import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";

import { Express } from "express";

import app from './app';

let serverlessExpressInstance: any = null;

function adaptor(event: APIGatewayProxyEvent, context: Context) {
    const headers = event.multiValueHeaders || {}; // NOTE: Mutating event.headers; prefer deep clone of event.headers
    const eventWithoutBody: { body?: string | null } = Object.assign({}, event);
    if (eventWithoutBody.body) {
        delete eventWithoutBody.body;
    }

    headers['x-apigateway-event'] = [encodeURIComponent(JSON.stringify(eventWithoutBody))];
    headers['x-apigateway-context'] = [encodeURIComponent(JSON.stringify(context))];
}

function setup(event: APIGatewayProxyEvent, context: Context, callback: Callback, app: Express) {
    serverlessExpressInstance = serverlessExpress({ app: app });
    return serverlessExpressInstance(event, context, callback)
}

export let app_handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {

    adaptor(event, context);

    if (serverlessExpressInstance) {
        return serverlessExpressInstance(event, context, callback);
    }

    return setup(event, context, callback, app);
}

