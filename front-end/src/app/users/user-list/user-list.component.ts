import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/models/user.module';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  @Input() userList: User[] = [];
  @Output() deleteUser = new EventEmitter<User>();

  deleteUserHandler(user: User): void {
    this.deleteUser.emit(user);
  }
}
