import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors, colorize } = format;

const logFormat = printf(({ timestamp, level, message, stack }) => {
  // Si c'est une erreur Winston, on affiche la stack
  return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),   // capture la stack des Error
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // En dev, on colore pour la console
    ...(process.env.NODE_ENV !== 'production' ? [colorize()] : []),
    logFormat
  ),
  transports: [
    // Console toujours
    new transports.Console(),
    // Plus tard, on peut ajouter un fichier ou un transport CloudWatch/Sentry...
  ],
});
