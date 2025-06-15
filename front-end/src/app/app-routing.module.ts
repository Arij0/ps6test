import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { GamePageComponent } from './game-page/game-page.component';
import { QuizEndComponent } from './quiz-end-page/quiz-end-page.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';

import { UserPageComponent } from './users/user-page/user-page.component';
import { QuizFormComponent } from './quizzes/quiz-form/quiz-form.component';


const routes: Routes = [
  { path: 'themes', component: ThemeSelectionComponent },
  { path: 'game/:quizId/:themeId', component: GamePageComponent },
  { path: 'create-quiz', component: QuizFormComponent },
  { path: 'quiz-end', component: QuizEndComponent },
  { path: 'user-settings/:id', component: GameSettingsComponent },
  { path: 'settings', component: GameSettingsComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'quiz-list/:themeId', component: QuizListComponent },
  { path: 'users', component: UserPageComponent },
   { path: '', component: HomePageComponent },
  

];
  //{ path: '', redirectTo: '/game', pathMatch: 'full' }


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }