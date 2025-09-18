import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  debug(message: string, ...args: any[]) {
    this.log('debug', message, args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, args);
  }

  trace(message: string, ...args: any[]) {
    this.log('trace', message, args);
  }

  private log(level: 'debug' | 'info' | 'error' | 'trace', message: string, args: any[]) {
    console[level](`[Sheep][${this.now()}] ${message}`, ...args);
  }

  private now(): string {
    return new Date().toISOString();
  }
}
