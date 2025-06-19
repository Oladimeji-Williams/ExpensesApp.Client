import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { TransactionList } from './components/transaction-list/transaction-list';
import { TransactionForm } from './components/transaction-form/transaction-form';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "signup",
        component: Signup
    },
    {
        path: "transactions",
        component: TransactionList,
        canActivate: [AuthGuard]
    },
    {
        path: "add",
        component: TransactionForm,
        canActivate: [AuthGuard]
    },
    {
        path: "transactions/edit/:id",
        component: TransactionForm,
        canActivate: [AuthGuard]
    },
    // {
    //     path: "",
    //     redirectTo: "/transactions",
    //     pathMatch: "full",
    //     canActivate: [AuthGuard]
    // },
    {
        path: "**",
        redirectTo: "/transactions"
    }
    
];
