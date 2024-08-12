import winston, { format } from 'winston';

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export function createLogger() {
  return winston.createLogger({
    level: process.env?.LOG_LEVEL ?? 'info',
    format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      myFormat
    ),
    transports: [new winston.transports.Console()],
  });
}

export default createLogger();
