import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth";

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
        catchError(error => {
            if(error.status === 401){
                authService.logout();
            }
            return throwError(() => error);
        })
    );
}
