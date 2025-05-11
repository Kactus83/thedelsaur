import morgan, { FormatFn, Options } from 'morgan';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware HTTP qui utilise Morgan pour formater
 * et Winston pour rendre/écrire les logs.
 */
export function morganMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
  // Choix du format selon l'environnement
  const format: string | FormatFn =
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : ':method :url :status :res[content-length] - :response-time ms';

  // On skippe les health checks et en prod on peut sauter d'autres routes
  const skip: Options<Request, Response>['skip'] = (_req, _res) =>
    process.env.SKIP_HTTP_LOG === 'true' ||  // flag pour override global
    _req.path === '/health';                 // ne pas polluer les pings Kubernetes

  // Le stream redirige chaque message Morgan vers Winston
  const stream: Options<Request, Response>['stream'] = {
    write: (message: string) => {
      // trim pour enlever le \n final
      logger.http(message.trim());
    },
  };

  return morgan(format, { stream, skip });
}
