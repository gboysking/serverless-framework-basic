import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult, Context } from "aws-lambda";
import { generatePolicy, verifyToken } from "libs/authorization";

export const handler = async (event: APIGatewayTokenAuthorizerEvent, _context: Context): Promise<CustomAuthorizerResult> => {
    const token = event.authorizationToken;

    try {
        const tokenPart = token.split(" ");

        if (tokenPart[0] !== "Bearer") {
            throw new Error("This token is not Bearer type.");
        }

        const decoded = await verifyToken(tokenPart[1]);
        const policy = generatePolicy(decoded.sub, "Allow", event.methodArn);
        return policy;
    } catch (error) {
        console.error("Token verification failed:", error.message);
        throw new Error("Unauthorized");
    }
};
