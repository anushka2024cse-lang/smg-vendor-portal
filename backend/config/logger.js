const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}] ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'smg-backend' },
    transports: [
        // Error logs - separate file for errors only
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Combined logs - all logs
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Warn logs
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/warn.log'),
            level: 'warn',
            maxsize: 5242880,
            maxFiles: 3,
        })
    ],
    // Don't exit on uncaught errors
    exitOnError: false
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Create a stream for Morgan HTTP logging
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

// Helper methods for structured logging
logger.logRequest = (req, message) => {
    logger.info(message, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?.id
    });
};

logger.logError = (error, req) => {
    logger.error(error.message, {
        stack: error.stack,
        method: req?.method,
        url: req?.originalUrl,
        ip: req?.ip,
        userId: req?.user?.id
    });
};

logger.logAuth = (message, userId, success = true) => {
    logger.info(message, {
        userId,
        success,
        category: 'auth'
    });
};

logger.logNotification = (type, recipientId, message) => {
    logger.info('Notification sent', {
        type,
        recipientId,
        message,
        category: 'notification'
    });
};

logger.logSOR = (action, sorId, userId) => {
    logger.info(`SOR ${action}`, {
        sorId,
        userId,
        action,
        category: 'sor'
    });
};

logger.logWarranty = (action, claimId, userId) => {
    logger.info(`Warranty ${action}`, {
        claimId,
        userId,
        action,
        category: 'warranty'
    });
};

module.exports = logger;
