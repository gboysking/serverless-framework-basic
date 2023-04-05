import { APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';

const generatePolicy = (principalId: string, effect: string, resource: string): APIGatewayAuthorizerResult => {
    return {
        principalId: principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
    };
};

export const handler: APIGatewayTokenAuthorizerHandler = async (event) => {
    const token = event.authorizationToken;

    // 토큰을 검증하는 로직을 작성하세요 (예: JWT 라이브러리 사용)
    // ...

    console.log(token);

    if (token != "test1234") {
        return generatePolicy("user", "Deny", event.methodArn);
    }

    // 검증에 성공하면 인증 정책을 생성하세요

    return generatePolicy("user", "Allow", event.methodArn);
};