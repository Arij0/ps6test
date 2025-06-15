import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/models/user.module';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  userList: User[] = [];
  showForm: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.users$.subscribe(users => this.userList = users);
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user);
  }

  onUserAdded(user: User) { 
  this.showForm = false; 
}
addUserToList(newUser: User): void {
    this.userList.push(newUser);
    this.showForm = false; // Optionnel : referme le formulaire après ajout
  }


}

