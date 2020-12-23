import express from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';

import routes from './routes/routes';

import errorHandler from './errors/handler';
import helmet from 'helmet'

import './database/connection';
import bodyParser from 'body-parser';


const app = express();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

app.use(routes);
app.use(errorHandler);
app.use(helmet())

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(3333, () => {
  console.log('Server started!');
});