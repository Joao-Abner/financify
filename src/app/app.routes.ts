import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth.guard';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { ExtractComponent } from './pages/extract/extract.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { CcardsComponent } from './pages/ccards/ccards.component';
import { GoalsComponent } from './pages/goals/goals.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'extract', component: ExtractComponent},
  { path: 'accounts', component: AccountsComponent},
  { path: 'ccards', component: CcardsComponent},
  { path: 'goals', component: GoalsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRountingModule {}