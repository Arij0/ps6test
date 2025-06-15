import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ThemeSelectionComponent } from './theme-selection/theme-selection.component';
import { ThemeBoxComponent } from './theme-box/theme-box.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { QuizComponent } from './quizzes/quiz/quiz.component';
import { QuizListComponent } from './quizzes/quiz-list/quiz-list.component';
import { QuizFormComponent } from './quizzes/quiz-form/quiz-form.component';
import { RouterModule } from '@angular/router';
import { EditQuizComponent } from './quizzes/edit-quiz/edit-quiz.component';
import { AppComponent } from './app.component';
import { GamePageComponent } from './game-page/game-page.component';
import { QuizEndComponent } from './quiz-end-page/quiz-end-page.component';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsService } from './services/settings.service';
import { QuestionService } from './services/question.service';
import { ScoreService } from './services/score.service';
import { CommonModule } from '@angular/common';
import { QuizService } from './services/quiz.service';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserComponent } from './users/user/user.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserPageComponent } from './users/user-page/user-page.component';


@NgModule({
  declarations: [
    UserComponent,
    UserFormComponent,
    UserListComponent,
    UserPageComponent,
    AppComponent,
    ThemeSelectionComponent,
    ThemeBoxComponent,
    GamePageComponent,
    QuizEndComponent,
    GameSettingsComponent,
    HomePageComponent,
    MenuBarComponent,
    AdminLoginComponent,
    EditQuizComponent,
    QuizFormComponent,
    QuizComponent,
    QuizListComponent,

  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule , 
    FormsModule,
    HttpClientModule,
    CommonModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
