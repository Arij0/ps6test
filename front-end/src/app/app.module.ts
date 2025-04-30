import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { ThemeBoxComponent } from './theme-box/theme-box.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GamePageComponent } from './game-page/game-page.component';
import { QuizEndComponent } from './quiz-end-page/quiz-end-page.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { SettingsService } from './services/settings.service';
import { QuestionService } from './services/question.service';
import { ScoreService } from './services/score.service';
@NgModule({
  declarations: [
    AppComponent,
    ThemeSelectionComponent,
    ThemeBoxComponent,
    GamePageComponent,
    QuizEndComponent,
    GameSettingsComponent,
    HomePageComponent,
    MenuBarComponent,
    AdminLoginComponent
 
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule , // Ajoutez-le à la liste des imports
    FormsModule
   
  ],
  providers: [SettingsService, QuestionService, ScoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
