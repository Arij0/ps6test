import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from 'src/models/user.module';
import { serverUrl, httpOptionsBase } from 'src/configs/server.config';
import { tap } from 'rxjs/operators'; // CORRECTION: importer depuis rxjs/operators

@Injectable({
  providedIn: 'root'
})
export class UserService {
   
  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public userSelected$: Subject<User> = new Subject();
  private userUrl = serverUrl + '/users';
  
  private httpOptions = httpOptionsBase;
  
  constructor(private http: HttpClient) {
    this.retrieveUsers();
  }
  
  retrieveUsers(): void {
    console.log('Récupération des utilisateurs...');
    this.http.get<User[]>(this.userUrl).subscribe({
      next: (userList) => {
        console.log('Utilisateurs récupérés:', userList);
        this.users$.next(userList);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    });
  }
  
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${userId}`);
  }
  
  addUser(user: User): Observable<User> {
    console.log('UserService.addUser appelé avec:', user);
    console.log('URL utilisée:', this.userUrl);
    
    return this.http.post<User>(this.userUrl, user, this.httpOptions).pipe(
      tap({
        next: (createdUser: User) => {
          console.log('Utilisateur créé avec succès:', createdUser);
          this.users$.next([...this.users$.value, createdUser]);
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur:', error);
        }
      })
    );
  }
  
  setSelectedUser(userId: string): void {
    this.http.get<User>(`${this.userUrl}/${userId}`).subscribe(u => this.userSelected$.next(u));
  }
     
  deleteUser(user: User): void {
    console.log('Suppression de l\'utilisateur:', user);
    this.http.delete(`${this.userUrl}/${user.id}`, this.httpOptions).subscribe({
      next: () => {
        console.log('Utilisateur supprimé avec succès');
        this.retrieveUsers();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }
  
  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${userId}`, userData, this.httpOptions).pipe(
      tap((updatedUser: User) => {
        const currentUsers = this.users$.value;
        const userIndex = currentUsers.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          currentUsers[userIndex] = updatedUser;
          this.users$.next([...currentUsers]);
        }
      })
    );
  }
}