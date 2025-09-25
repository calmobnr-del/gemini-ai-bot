import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map-page').then((m) => m.MapPage),
    title: 'Map View'
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
    path: 'history/:id', // <-- New dynamic route
    loadComponent: () =>
      import('./pages/session-detail-page/session-detail-page').then((m) => m.SessionDetail),
  },
  {
    path: 'games',
    loadComponent: () => import('./pages/games/games-page').then((m) => m.GamesPage),
  },
  {
    path: 'study',
    loadComponent: () => import('./pages/study-english/study-english-page').then((m) => m.StudyEnglishPage),
  },
  {
    path: '**',
    redirectTo: '', // Redirect to the home path
    pathMatch: 'full',
  },
];
