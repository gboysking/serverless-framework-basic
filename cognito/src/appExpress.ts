import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { eventContext } from 'libs/express';
import { getUserInfo } from 'libs/cognito';

const app = express();

//API Gateway event parsing
app.use(eventContext());

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// 라우터와 기타 애플리케이션 로직은 여기에 추가합니다.

app.get('/hello', (req: Request, res: Response) => {
  console.log(req.query);

  res.send('Hello from Serverless TypeScript Express app!!!!!');
});

app.get('/profile', (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.query);


  if (req.cookies && req.cookies.credentials) {
    const credentials = JSON.parse(req.cookies.credentials);
    let accessToken = credentials.access_token;

    getUserInfo(process.env.COGNITO_USER_POOL_DOMAIN_NAME, accessToken)
      .then((result) => {

        res.json(result);
      })
      .catch((err) => {
        next(err);
      })
  } else {
    res.status(500).json({ "message": "Server Error" });
  }

});

export default app;
