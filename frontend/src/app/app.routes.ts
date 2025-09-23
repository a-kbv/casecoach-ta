import { Routes } from '@angular/router';

export const routes: Routes = [
  //lazy loading
  {path: '', loadComponent: () => import('./pages/technology-list/technology-list').then(m => m.TechnologyList)},
  {path: 'technology/add', loadComponent: () => import('./pages/technology-form/technology-form').then(m => m.TechnologyForm)},
  {path: 'technology/edit/:id', loadComponent: () => import('./pages/technology-form/technology-form').then(m => m.TechnologyForm)},
  {path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)}
];
