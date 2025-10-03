import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth";
import { catchError, throwError } from "rxjs";

export const AuthInterceptor: HttpInterceptorFn = (request, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    if(token)
    {
        request = request.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }
    return next(request).pipe(
        catchError((error: any) => {
            if(error.status === 401){
                authService.logout();
            }
            return throwError(() => error);
        })
    );
}
