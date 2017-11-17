import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import session from 'express-session';
import routes from './routes';
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

//  Connect all our routes to our application
app.use('/', routes);

app.use('/api/v1/docs', express.static('docs'));

// Default catch-all route that sends back a welcome message in JSON format.
app.get('*', (req, res) => res.status(409).send({
  message: 'Where Are You Going? Page Not Found',
}));

app.use(errorHandler);

export default app;
