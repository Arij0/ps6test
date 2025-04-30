import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeBoxComponent } from './theme-box.component';

describe('ThemeBoxComponent', () => {
  let component: ThemeBoxComponent;
  let fixture: ComponentFixture<ThemeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThemeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
