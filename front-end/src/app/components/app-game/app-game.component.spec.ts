import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGameComponent } from './app-game.component';

describe('AppGameComponent', () => {
  let component: AppGameComponent;
  let fixture: ComponentFixture<AppGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
