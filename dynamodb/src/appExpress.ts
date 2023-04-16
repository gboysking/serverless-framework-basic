import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { eventContext } from 'libs/express';
import { DeviceDataTable } from 'libs/DeviceDataTable';

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

const deviceDataTable = new DeviceDataTable({ table: 'DeviceData' });

// 라우터와 기타 애플리케이션 로직은 여기에 추가합니다.
app.post('/devices/:device_id/:type', async (req, res) => {
  const { device_id, type } = req.params;
  const { timestamp, data } = req.body;

  const timestampNumber = timestamp ? new Date(timestamp as string).getTime() : new Date().getTime();

  try {
      await deviceDataTable.putItem(device_id, type, timestampNumber, data);
      res.status(200).send({ message: 'Item saved successfully' });
  } catch (error) {
      res.status(500).send({ error: 'Error saving item', details: error });
  }
});

app.get('/devices/:device_id/:type', async (req, res) => {
  const { device_id, type } = req.params;
  const { start_time, end_time } = req.query;

  const now = new Date().getTime();
  const startTimeNumber = start_time ? new Date(start_time as string).getTime() : now - 24 * 60 * 60 * 1000;
  const endTimeNumber = end_time ? new Date(end_time as string).getTime() : now;


  try {
      const items = await deviceDataTable.getItems(device_id, type, startTimeNumber, endTimeNumber);
      res.status(200).send(items);
  } catch (error) {
      res.status(500).send({ error: 'Error fetching items', details: error });
  }
});

app.delete('/devices/:device_id/:type/:timestamp', async (req, res) => {
  const { device_id, type, timestamp } = req.params;
  const timestampNumber = Number(timestamp);

  try {
      await deviceDataTable.deleteItem(device_id, type, timestampNumber);
      res.status(200).send({ message: 'Item deleted successfully' });
  } catch (error) {
      res.status(500).send({ error: 'Error deleting item', details: error });
  }
});

export default app;
