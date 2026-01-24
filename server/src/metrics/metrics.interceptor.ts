/* eslint-disable prettier/prettier */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    if (!req) {
      return next.handle();
    }

    const method = req.method || 'UNKNOWN';
    const baseUrl = req.baseUrl || '';
    const routePath = req.route?.path;
    const route = routePath
      ? `${baseUrl}${routePath}`
      : req.originalUrl || req.url || 'unknown';

    if (route === '/metrics') {
      return next.handle();
    }

    const endTimer = this.metricsService.httpRequestDuration.startTimer({
      method,
      route,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const status = String(res?.statusCode || 200);
          endTimer({ status });
          this.metricsService.httpRequestTotal.inc({ method, route, status });
        },
        error: () => {
          const status = String(res?.statusCode || 500);
          endTimer({ status });
          this.metricsService.httpRequestTotal.inc({ method, route, status });
        },
      }),
    );
  }
}
