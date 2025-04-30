import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { GamePageComponent } from './game-page/game-page.component';
import { QuizEndComponent } from './quiz-end-page/quiz-end-page.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
  { path: 'themes', component: ThemeSelectionComponent },
  { path: 'game/:themeId', component: GamePageComponent }, 
  { path: 'quiz-end', component: QuizEndComponent }, // AJOUTE CETTE LIGNE
  { path: '', component: HomePageComponent },
  { path: 'settings', component: GameSettingsComponent},
  { path: 'admin-login', component: AdminLoginComponent},
  { path: '', redirectTo: '/game', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }