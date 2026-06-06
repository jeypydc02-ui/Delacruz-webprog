require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const connectDB     = require('./config/db');
const userRoutes    = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

const app = express();

connectDB();

app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/users',    userRoutes);
app.use('/api/articles', articleRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// For local dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Vercel serverless
module.exports = app;
