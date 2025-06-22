import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { TransactionList } from './components/transaction-list/transaction-list';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { AuthGuard } from './guards/auth.guard';
import { UserProfile } from './components/user-profile/user-profile';
import { ChangePassword } from './components/change-password/change-password';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'transactions',
        component: TransactionList,
        canActivate: [AuthGuard]
    },
    {
        path: 'add',
        component: TransactionForm,
        canActivate: [AuthGuard]
    },
    {
        path: 'transactions/edit/:id',
        component: TransactionForm,
        canActivate: [AuthGuard]
    },
    {
        path: 'user-profile',
        component: UserProfile,
        canActivate: [AuthGuard]
    },
    {
        path: 'change-password',
        component: ChangePassword,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'transactions'
    }
];
