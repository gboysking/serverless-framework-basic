import { CustomAuthorizerResult, Context, APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { generatePolicy, verifyToken } from "libs/authorization";

export const handler = async (event: APIGatewayRequestAuthorizerEvent, _context: Context): Promise<CustomAuthorizerResult> => {
    const headers = event.headers;
    const cookies = headers ? headers.Cookie : null;

    if (cookies) {

        const parsedCookies = cookies.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});

        const credentials = JSON.parse(parsedCookies['credentials']);

        try {
            const decoded = await verifyToken(credentials.access_token);
            const policy = generatePolicy(decoded.sub, "Allow", event.methodArn, decoded);
            return policy;
        } catch (error) {
            console.error("Token verification failed:", error.message);
            throw new Error("Unauthorized"); // 인증 실패시 Unauthorized 에러 발생
        }
    }

    throw new Error("Unauthorized"); // 인증 실패시 Unauthorized 에러 발생
};
