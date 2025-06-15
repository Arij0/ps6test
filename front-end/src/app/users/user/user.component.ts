import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user.module';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  @Input() user!: User;
  @Output() deleteUser = new EventEmitter<User>();

  constructor(private router: Router) {}
  
  // Method called by template (click)="startGame()"
  startGame(): void {
  this.router.navigate(['/themes'], { queryParams: { userId: this.user.id } });
}

  // Method called by template (click)="openSettings()"
  openSettings(): void {
    this.router.navigate(['/settings'], { 
      queryParams: { userId: this.user.id } 
    });
  }
  // Method called by template (click)="onDeleteUser()"
  onDeleteUser(): void {
    this.deleteUserHandler();
  }

  // Your existing methods
  deleteUserHandler(): void {
    this.deleteUser.emit(this.user);
  }

  goToSettings(): void {
    this.router.navigate(['/user-settings', this.user.id]);
  }

  playGame(): void {
  this.router.navigate(['/quiz-list'], { queryParams: { userId: this.user.id } });
}

}