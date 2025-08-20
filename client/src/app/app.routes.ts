import { Route } from '@angular/router';

export const appRoutes: Route[] = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: '**',
    redirectTo: '', // Redirect to the home path
    pathMatch: 'full',
  },
];
