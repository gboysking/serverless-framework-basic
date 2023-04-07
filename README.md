# serverless-framework-basic

AWS Cognito + Express + Serverless Framework

This project is an implementation of the AWS Cognito service using Express and the Serverless Framework, written in TypeScript. It is based on the implementation described in [this blog post](https://tobelinuxer.tistory.com/60).

The project includes several functions that demonstrate how to integrate Cognito authentication and authorization into a serverless application built using Express and the Serverless Framework. The functions cover basic user registration, login, and access control using JWT tokens.

## Getting Started

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Set up your AWS Cognito user pool and client app.
4. Create a `.env` file in the root directory of the project with the following variables:
    - AUTH_AUTHORIZATION_URI=<your_authorization_uri>
    - AUTH_TOKEN_URI=<your_token_uri>
    - AUTH_CLIENT_ID=<your_client_id>
    - AUTH_CLIENT_SECRET=<your_client_secret>
    - AUTH_JWKS_URI=<your_jwks_uri>
    - COGNITO_USER_POOL_DOMAIN_NAME=<your_user_pool_domain_name>

5. Deploy the application to AWS Lambda using Serverless Framework by running `sls deploy`.
6. Test the API endpoints using a tool like Postman or cURL.

## Available Functions

The following functions are available in this project:

- `tokenAuthorizer`: A function that authorizes a request using a JWT token.
- `requestAuthorizer`: A function that authorizes a request using a custom header.
- `cognitoAuthorizer`: A function that authorizes a request using AWS Cognito.
- `cookieAuthorizer`: A function that authorizes a request using a cookie.
- `app`: A function that handles HTTP requests for the `/app` endpoint.
- `appToken`: A function that handles HTTP requests for the `/app-token` endpoint, with token-based authorization.
- `appRequest`: A function that handles HTTP requests for the `/app-request` endpoint, with request-based authorization.
- `appUserToken`: A function that handles HTTP requests for the `/app-user-token` endpoint, with user-based token authorization.
- `appUserCookie`: A function that handles HTTP requests for the `/app-user-cookie` endpoint, with user-based cookie authorization.
- `authorize`: A function that handles HTTP requests for the `/authorize` endpoint.

## Configuration

This project uses the `serverless-esbuild` and `serverless-offline` plugins for Serverless Framework. 
The `serverless-esbuild` plugin is used to transpile your TypeScript code to JavaScript, while the `serverless-offline` plugin is used to run your application locally.

The AWS region, runtime, and memory size for your Lambda functions are defined in the `provider` section of the `serverless.yml` file. 
The environment variables used by the functions are also defined in this file.

## Contributing

Contributions and feedback are welcome. Happy coding!


    
