import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import { eventContext } from 'libs/express';
import cookieParser from 'cookie-parser';
import { getAccessToken, getAccessTokenWithRefreshToken, getAuthorizationUrl, isTokenExpired } from 'libs/authorization';

const app = express();

//API Gateway event parsing
app.use(eventContext());

// CORS
app.use(cors());

// Security
app.use(helmet());

// Logging
app.use(morgan((tokens, req: any, res) => {
  const requestId = req.headers['x-apigateway-event-requestId']; // API Gateway 요청 ID 가져오기

  return JSON.stringify({
    request_id: requestId,
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    response_time: tokens['response-time'](req, res) + ' ms',
    remote_addr: tokens['remote-addr'](req, res),

  });
}));

// Compression
app.use(compression());

// Cookie
app.use(cookieParser());


app.get('/login', (req: Request, res: Response, next: NextFunction) => {
  const protocol = process.env.IS_OFFLINE ? "http" : req.protocol;
  const hostname = req.get('host');
  const callbackPath = '/authorize/callback';
  const baseUrl = req.baseUrl.replace('/login', '');

  let callbackUrl = `${protocol}://${hostname}${baseUrl}/${process.env.STAGE}${callbackPath}`;

  if (process.env.AUTH_CALLBACK_URI) {
    callbackUrl = process.env.AUTH_CALLBACK_URI;
  }

  if (req.cookies && req.cookies.credentials) {

    let accessToken = req.cookies.credentials.access_token;
    let refreshToken = req.cookies.credentials.refresh_token;

    isTokenExpired(accessToken)
      .then(async (result) => {

        if (result) {
          const newCredentials = await getAccessTokenWithRefreshToken(refreshToken, process.env.AUTH_CLIENT_ID, process.env.AUTH_CLIENT_SECRET, process.env.AUTH_TOKEN_URI);
          console.log("credentials update.");
          res.cookie('credentials', JSON.stringify(newCredentials), { httpOnly: true, secure: true });
          res.redirect('/dev/app-user-cookie/hello');

        } else {
          res.redirect('/dev/app-user-cookie/hello');
        }
      })
      .catch((_err) => {
        console.log("cookie credentials error. redirect to login page.");
        const url = getAuthorizationUrl({ ClientId: process.env.AUTH_CLIENT_ID, RedirectUri: callbackUrl, ResponseType: "code", Scope: "email openid", State: "" })

        res.redirect(url);
      })
  } else {
    const url = getAuthorizationUrl({ ClientId: process.env.AUTH_CLIENT_ID, RedirectUri: callbackUrl, ResponseType: "code", Scope: "email openid", State: "" })

    res.redirect(url);
  }
});

app.get('/callback', (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query;

  const protocol = req.protocol;
  const hostname = req.get('host');
  const callbackPath = '/authorize/callback';

  let callbackUrl = `${protocol}://${hostname}${callbackPath}`;

  if (process.env.IS_OFFLINE) {
    callbackUrl = `http://${hostname}/dev${callbackPath}`;
  }

  getAccessToken(code as string, callbackUrl, process.env.AUTH_CLIENT_ID, process.env.AUTH_CLIENT_SECRET, process.env.AUTH_TOKEN_URI)
    .then((result) => {
      res.cookie('credentials', JSON.stringify(result), { httpOnly: true, secure: true }); // 쿠키 저장
      res.redirect('/dev/app-user-cookie/profile');
      // res.json(result.data);
    })
    .catch((reason: any) => {
      next(reason);
    })
    ;
}
);

export default app;
