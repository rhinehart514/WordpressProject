import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const customFormat = printf(({ level, message, timestamp, context, trace, ...metadata }) => {
  let msg = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;

  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  // Add stack trace for errors
  if (trace) {
    msg += `\n${trace}`;
  }

  return msg;
});

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // Console transport for development
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        customFormat,
      ),
    }),

    // File transport for errors (always enabled)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport for all logs (production)
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],

  // Exception handling
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  ],

  // Rejection handling
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  ],

  // Don't exit on error
  exitOnError: false,
};

// Environment-specific configuration
if (process.env.NODE_ENV === 'production') {
  // In production, add syslog or cloud logging
  // Example: CloudWatch, LogDNA, Datadog, etc.
}

if (process.env.NODE_ENV === 'test') {
  // Suppress logging in tests
  winstonConfig.transports = [
    new winston.transports.File({
      filename: 'logs/test.log',
      level: 'error',
    }),
  ];
}
