import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css']
})
export class TransactionList implements OnInit {
  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.GetTransactions().subscribe({
      next: (data) => (this.transactions = data),
      error: (error) => console.error('Load Error:', error)
    });
  }

  getTotalIncome(): number {
    return this.transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getNetBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  editTransaction(transaction: Transaction): void {
    if (transaction.id) {
      this.router.navigate(['/transactions/edit', transaction.id]);
    }
  }

  deleteTransaction(transaction: Transaction): void {
    if (transaction.id && confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.DeleteTransaction(transaction.id).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(t => t.id !== transaction.id);
        },
        error: (error) => {
          console.error('Delete Error:', error);
        }
      });
    }
  }
}
