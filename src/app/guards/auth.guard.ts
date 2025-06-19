import { inject } from "@angular/core"
import { AuthService } from "../services/auth"
import { Router } from "@angular/router";

export const AuthGuard = () =>
{
    const authService = inject(AuthService);
    const router = inject(Router);
    if(authService.isAuthenticated())
    {
        return true;
    }
    router.navigate(['/login']);
    return false;
}