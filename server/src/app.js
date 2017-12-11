import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import { apiRoutes } from './routes';
import errorHandler from './middlewares/errorHandler';

// Set up the express app
const app = express();

const logger = morgan;

// Log requests to the console.
app.use(logger('dev'));

app.use(cors({
  credentials: true,
}));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  name: 'id',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1800000 // 30 mins
  }
}));

app.use((req, res, next) => {
  if (req.session.cookie && !req.session.user) {
    res.clearCookie('id');
  }
  next();
});

// Return client index.html
app.get('/', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../../client/', 'build', 'index.html'));
});

//  Connect all our routes to our application
app.use('/api/', apiRoutes);

// Documentation
app.use('/api/v1/docs', express.static('docs'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '../../client/', 'build')));

// Default catch-all route that sends back a not found warning for wrong api routes.
app.get('/api/*', (req, res) => res.status(409).send({
  message: 'Where Are You Going? Page Not Found'
}));

// Return client index.html file for unknown routes
app.get('*', (req, res) => {
  res.status(409).sendFile(path.resolve(__dirname, '../../client/', 'build', 'index.html'));
});

app.use(errorHandler);

export default app;
