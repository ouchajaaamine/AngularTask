import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source);
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      source
    };

    // Store log entry
    this.logs.push(entry);
    
    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (!environment.production) {
      this.outputToConsole(entry);
    }

    // Send to external service in production (if needed)
    if (environment.production && level >= LogLevel.ERROR) {
      this.sendToExternalService(entry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const source = entry.source ? `[${entry.source}]` : '';
    const logMessage = `${timestamp} ${source} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.data);
        break;
      case LogLevel.INFO:
        console.info(logMessage, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.data);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, entry.data);
        break;
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // In a real application, send to external logging service
    // For now, just store in localStorage for debugging
    try {
      const errorLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      errorLogs.push(entry);
      
      // Keep only last 100 error logs
      if (errorLogs.length > 100) {
        errorLogs.splice(0, errorLogs.length - 100);
      }
      
      localStorage.setItem('error_logs', JSON.stringify(errorLogs));
    } catch (error) {
      console.error('Failed to store error log:', error);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Security logging methods
  logSecurityEvent(event: string, details?: any): void {
    this.warn(`SECURITY: ${event}`, details, 'SecurityService');
  }

  logAuthEvent(event: string, username?: string, details?: any): void {
    this.info(`AUTH: ${event}`, { username, ...details }, 'AuthService');
  }

  logUserAction(action: string, userId?: string, details?: any): void {
    this.info(`USER_ACTION: ${action}`, { userId, ...details }, 'UserService');
  }
}
