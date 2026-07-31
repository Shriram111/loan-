require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/saarthi-bank',
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
  jwtExpire: process.env.JWT_EXPIRE || '15m',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  digilocker: {
    clientId: process.env.DIGILOCKER_CLIENT_ID,
    clientSecret: process.env.DIGILOCKER_CLIENT_SECRET,
    redirectUrl: process.env.DIGILOCKER_REDIRECT_URL,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
    dir: process.env.UPLOAD_DIR || './uploads',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};
