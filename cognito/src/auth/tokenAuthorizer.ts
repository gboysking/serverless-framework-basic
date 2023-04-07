import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';
import { generatePolicy } from 'libs/authorization';

export const handler: APIGatewayTokenAuthorizerHandler = async (event) => {
    const token = event.authorizationToken;

    if (token != "test1234") {
        return generatePolicy("user", "Deny", event.methodArn);
    }

    return generatePolicy("user", "Allow", event.methodArn);
};