import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilmsResolver } from './films/resolvers/film.resolver';
import { AuthGuard } from './shared/guards/auth-guard.service';

import { LoginComponent } from './shared/components/login/login.component';
import { RegistrationComponent } from './shared/components/registration/registration.component';

import { FilmsListComponent } from './films/components/films-list/films-list.component';
import { ActorsListComponent } from './actors/components/actors-list/actors-list.component';
import { WelcomeComponent } from './welcome/components/welcome/welcome.component';
import { FilmDetailComponent } from './films/components/films-list/film-item/film-detail/film-detail.component';
import { FavoriteFilmsComponent } from './films/components/favorite-films/favorite-films.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  { path: 'main', component: WelcomeComponent },
  {
    path: 'films',
    component: FilmsListComponent,
    resolve: { data: FilmsResolver }
  },
  { path: 'films/:id', component: FilmDetailComponent},
  { path: 'actors', component: ActorsListComponent, canActivate: [AuthGuard] },
  { path: 'favorite-films', component: FavoriteFilmsComponent, resolve: { data: FilmsResolver } },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
