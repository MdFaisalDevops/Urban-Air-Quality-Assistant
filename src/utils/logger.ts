/**
 * Production-safe structured logger for VayuMitra.
 * Prevents raw console leakage, masks sensitive strings, and disables debug output in production.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class AppLogger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = typeof process !== 'undefined' 
      ? process.env.NODE_ENV !== 'production'
      : true;
  }

  /**
   * Masks sensitive credentials or tokens in log arguments
   */
  private sanitizeArg(arg: unknown): unknown {
    if (typeof arg === 'string') {
      // Mask API keys starting with AIza
      return arg.replace(/AIza[0-9A-Za-z-_]{30,}/g, (match) => 
        `${match.slice(0, 6)}••••••••${match.slice(-4)}`
      );
    }
    if (arg instanceof Error) {
      return {
        name: arg.name,
        message: this.sanitizeArg(arg.message),
        stack: this.isDevelopment ? arg.stack : undefined,
      };
    }
    return arg;
  }

  private log(level: LogLevel, message: string, ...optionalParams: unknown[]): void {
    const sanitizedMsg = typeof message === 'string' ? (this.sanitizeArg(message) as string) : message;
    const sanitizedParams = optionalParams.map((p) => this.sanitizeArg(p));
    const timestamp = new Date().toISOString();
    const prefix = `[VayuMitra ${level.toUpperCase()}] ${timestamp}:`;

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(prefix, sanitizedMsg, ...sanitizedParams);
        }
        break;
      case 'info':
        console.info(prefix, sanitizedMsg, ...sanitizedParams);
        break;
      case 'warn':
        console.warn(prefix, sanitizedMsg, ...sanitizedParams);
        break;
      case 'error':
        console.error(prefix, sanitizedMsg, ...sanitizedParams);
        break;
    }
  }

  public debug(message: string, ...optionalParams: unknown[]): void {
    this.log('debug', message, ...optionalParams);
  }

  public info(message: string, ...optionalParams: unknown[]): void {
    this.log('info', message, ...optionalParams);
  }

  public warn(message: string, ...optionalParams: unknown[]): void {
    this.log('warn', message, ...optionalParams);
  }

  public error(message: string, ...optionalParams: unknown[]): void {
    this.log('error', message, ...optionalParams);
  }
}

export const logger = new AppLogger();
