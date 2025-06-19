import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css']
})
export class TransactionForm implements OnInit {
  transactionForm: FormGroup;

  incomeCategories = ['Salary', 'Freelance', 'Investment'];
  expenseCategories = ['Food', 'Transportation', 'Entertainment'];
  availableCategories: string[] = [];

  editMode = false;
  transactionId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.formBuilder.group({
      type: ['Expense', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      createdAt: [this.formatDate(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {
    this.transactionForm.get('type')?.valueChanges.subscribe(() => {
      this.updateAvailableCategories();
    });

    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.editMode = true;
      this.transactionId = +id;
      this.loadTransaction(this.transactionId);
    } else {
      this.updateAvailableCategories(); // for default type
    }
  }

  cancel(): void {
    this.router.navigate(['/transactions']);
  }

  updateAvailableCategories(reset: boolean = true): void {
    const type = this.transactionForm.get('type')?.value;
    this.availableCategories = type === 'Expense' ? this.expenseCategories : this.incomeCategories;

    if (reset) {
      this.transactionForm.patchValue({ category: '' });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transaction = this.transactionForm.value as Transaction;

      if (this.editMode && this.transactionId) {
        this.transactionService.UpdateTransaction(this.transactionId, transaction).subscribe({
          next: () => this.router.navigate(['/transactions']),
          error: (error) => console.error('Update Error:', error)
        });
      } else {
        this.transactionService.CreateTransaction(transaction).subscribe({
          next: () => this.cancel(),
          error: (error) => console.error('Create Error:', error)
        });
      }
    }
  }

  loadTransaction(id: number): void {
    this.transactionService.GetTransaction(id).subscribe({
      next: (transaction) => {
        this.transactionForm.patchValue({
          type: transaction.type,
          amount: transaction.amount,
          createdAt: this.formatDate(new Date(transaction.createdAt))
        });

        this.updateAvailableCategories(false);
        this.transactionForm.patchValue({
          category: transaction.category
        });
      },
      error: (error) => {
        console.error('Load Error:', error);
      }
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
}
