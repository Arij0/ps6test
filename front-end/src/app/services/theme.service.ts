import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeIdSubject = new BehaviorSubject<string | null>(null);
  currentThemeId$ = this.currentThemeIdSubject.asObservable();

  setCurrentThemeId(themeId: string) {
    this.currentThemeIdSubject.next(themeId);
  }

  getCurrentThemeId(): string | null {
    return this.currentThemeIdSubject.value;
  }

  clearThemeId() {
    this.currentThemeIdSubject.next(null);
  }
}