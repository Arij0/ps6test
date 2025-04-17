import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Correct import paths (adjust according to your actual file structure)
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameSettingsComponent } from './components/game-settings/game-settings.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { GameComponent } from './components/app-game/app-game.component'; // Ajout du nouveau composant

@NgModule({
  declarations: [
    AppComponent,
    GameSettingsComponent,
    UserFormComponent,
    GameComponent // Déclarer le nouveau composant
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }