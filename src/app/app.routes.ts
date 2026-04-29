import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'matches/:id',
    loadComponent: () => import('./pages/match-detail/match-detail.page').then(m => m.MatchDetailPage)
  },
  {
    path: 'liga',
    loadComponent: () => import('./pages/league/league.page').then(m => m.LeaguePage),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/ranking/ranking.page').then(m => m.RankingPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'team/:id',
    loadComponent: () => import('./pages/team-detail/team-detail.page').then(m => m.TeamDetailPage)
  },
];