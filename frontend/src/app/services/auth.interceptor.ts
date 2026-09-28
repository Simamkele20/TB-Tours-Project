import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    try {
      const token = this.authService.getToken();

      if (token) {
        console.log('[AUTH-INTERCEPTOR] Adding token to request for URL:', request.url);
        console.log('[AUTH-INTERCEPTOR] Token value:', token.substring(0, 20) + '...');
        // Clone the request and add Authorization header
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[AUTH-INTERCEPTOR] Token added, new headers:', request.headers.get('Authorization'));
      } else {
        console.log('[AUTH-INTERCEPTOR] No token found for URL:', request.url);
      }

      console.log('[AUTH-INTERCEPTOR] About to call next.handle with request:', request.url);
      const result = next.handle(request);
      console.log('[AUTH-INTERCEPTOR] next.handle returned observable');
      return result;
    } catch (error) {
      console.error('[AUTH-INTERCEPTOR] ERROR IN INTERCEPTOR:', error);
      throw error;
    }
  }
}
