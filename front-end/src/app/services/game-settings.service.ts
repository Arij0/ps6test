import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GameSettingsService {

  private hintsToShowSubject = new BehaviorSubject<number>(1); // Valeur par défaut
  hintsToShow$ = this.hintsToShowSubject.asObservable();

  setHintsToShow(numberOfHints: number) {
    this.hintsToShowSubject.next(numberOfHints);
  }

  getHintsToShow(): number {
    return this.hintsToShowSubject.value;
  }

  constructor() { }
}
