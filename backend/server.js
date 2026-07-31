const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

connectDB();

app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);

const limiter = rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.maxRequests, message: { success: false, message: 'Too many requests, please try again later' } });
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/verification', require('./routes/verification'));
app.use('/api/audits', require('./routes/audits'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/financial', require('./routes/financial'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Saarthi Bank API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Saarthi Bank server running on port ${PORT} in ${config.nodeEnv} mode`);
});

module.exports = app;
