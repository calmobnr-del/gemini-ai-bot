import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat-page').then((m) => m.ChatPage),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./pages/history/history-page').then((m) => m.HistoryPage),
  },
  {
    path: '**',
    redirectTo: '', // Redirect to the home path
    pathMatch: 'full',
  },
];
