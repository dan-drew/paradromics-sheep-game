import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() { }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, args);
  }

  private log(level: 'debug' | 'info' | 'error', message: string, args: any[]) {
    console[level](`[Sheep][${this.now()}] ${message}`, ...args);
  }

  private now(): string {
    return new Date().toISOString();
  }
}
