import { APIGatewayRequestAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";
import { generatePolicy } from "libs/authorization";

export const handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  const customHeader = event.headers["CustomHeader"];

  if (customHeader === "test1234") {
    return generatePolicy("user", "Allow", event.methodArn);
  } else {
    return generatePolicy("user", "Deny", event.methodArn);
  }
};