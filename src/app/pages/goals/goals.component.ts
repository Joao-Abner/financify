import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Goal, GoalService } from './goal.service';
import { TransactionService } from '../transactions/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  userId: number | null;
  saldoAtual: number = 0;
  goalForm: FormGroup;
  currentEditGoalId: number | null = null;

  constructor(
    private authService: AuthService,
    private goalService: GoalService,
    private transactionService: TransactionService,
    private fb: FormBuilder,
  ) {
    this.userId = this.authService.getCurrentUserId();
    this.goalForm = this.fb.group({
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadGoals();
    this.loadSaldo();
  }

  onSubmit(): void {
    if (this.goalForm.valid && this.userId) {
      const formValue = this.goalForm.value;
      const goal: Goal = {
        description: formValue.description,
        amount: formValue.amount
      };

      this.goalService.addGoal(this.userId, goal).subscribe(
        (addedGoal: Goal) => {
          this.goals.push(addedGoal);
          this.goalForm.reset(); // Limpar formulário após adicionar
        },
        (error) => {
          console.error('Erro ao adicionar objetivo:', error);
        }
      );
    } else {
      Object.keys(this.goalForm.controls).forEach(key => {
        this.goalForm.controls[key].markAsDirty();
      });
    }
  }

  deleteGoal(goalId: number): void {
    if (this.userId) {
      this.goalService.deleteGoal(this.userId, goalId).subscribe(
        () => {
          const index = this.goals.findIndex(goal => goal.id === goalId);
          if (index !== -1) {
            this.goals.splice(index, 1);
          }
        },
        (error) => {
          console.error('Erro ao excluir objetivo:', error);
        }
      );
    }
  }

  loadGoals(): void {
    if (this.userId) {
      this.goalService.getGoals(this.userId).subscribe(
        (goals: Goal[]) => {
          this.goals = goals;
        },
        (error) => {
          console.error('Erro ao obter objetivos:', error);
        }
      );
    }
  }

  loadSaldo(): void {
    if (this.userId) {
      this.transactionService.getBalance(this.userId).subscribe(
        (saldo: number) => {
          this.saldoAtual = saldo;
        },
        (error) => {
          console.error('Erro ao obter saldo:', error);
        }
      );
    }
  }
}
