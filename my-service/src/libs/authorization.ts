import { APIGatewayAuthorizerResultContext, CustomAuthorizerResult } from "aws-lambda";
import { JwtHeader } from "jsonwebtoken";
import { verify } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import jwt from 'jsonwebtoken';
import { Credentials } from "./interface";
import axios from "axios";

const client = jwksClient({
  jwksUri: process.env.AUTH_JWKS_URI,
});

export let getKey = (header: JwtHeader, callback: (err: Error | null, signingKey?: string) => void): void => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export let verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    verify(token, (header, callback) => getKey(header, callback), { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export let generatePolicy = (principalId: string, effect: string, resource: string | string[], context?: APIGatewayAuthorizerResultContext): CustomAuthorizerResult => {
  return {
    principalId,
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
    context: context,
  };
}

export let getAuthorizationUrl = (params: {
  ClientId: string;
  ResponseType: string;
  Scope: string;
  RedirectUri: string;
  State: string;
}): string => {
  const queryParams = new URLSearchParams({
    client_id: params.ClientId,
    response_type: params.ResponseType,
    scope: params.Scope,
    redirect_uri: params.RedirectUri,
    state: params.State,
  });

  return `${process.env.AUTH_AUTHORIZATION_URI}?${queryParams.toString()}`;
}

export let getAccessTokenWithRefreshToken = (refreshToken: string, clientId: string, clientSecret: string, tokenUri: string): Promise<Credentials> => {
  return new Promise((resolve, reject) => {
    const body = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId
    };

    const credentials = `${clientId}:${clientSecret}`;
    const base64EncodedCredentials = Buffer.from(credentials).toString('base64');

    axios.post<Credentials>(tokenUri, body, {
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64EncodedCredentials}`
      }
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export let getAccessToken = (code: string, redirectUri: string, clientId: string, clientSecret: string, tokenUri: string): Promise<Credentials> => {
  return new Promise((resolve, reject) => {
    const body = {
      grant_type: "authorization_code",
      code: code,
      client_id: clientId,
      redirect_uri: redirectUri,
    };

    const credentials = `${clientId}:${clientSecret}`;
    const base64EncodedCredentials = Buffer.from(credentials).toString('base64');

    axios.post<Credentials>(tokenUri, body, {
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64EncodedCredentials}`
      }
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export let isTokenExpired = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const decodedToken: any = jwt.decode(token);
      const expirationTime = decodedToken.exp * 1000; // JWT 토큰에서 exp 필드는 초 단위로 저장되어 있으므로 밀리초로 변환

      resolve(Date.now() > expirationTime);
    } catch (err) {
      reject(err);
    }
  });

}