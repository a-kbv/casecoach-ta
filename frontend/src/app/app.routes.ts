import { Routes } from '@angular/router';
import { TechnologyList } from './pages/technology-list/technology-list';
import { TechnologyForm } from './pages/technology-form/technology-form';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {path: '', component: TechnologyList},
  {path: 'technology/add', component: TechnologyForm},
  {path: 'technology/edit/:id', component: TechnologyForm},
  {path: '**', component: NotFound}
];
