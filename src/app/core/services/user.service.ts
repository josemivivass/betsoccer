import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockLeaderboard = [
    { id: 1, username: 'admin', points: 1500, avatar: 'account_circle' },
    { id: 2, username: 'campeon99', points: 1420, avatar: 'account_circle' },
    { id: 3, username: 'user', points: 1200, avatar: 'account_circle' },
    { id: 4, username: 'bet_master', points: 1150, avatar: 'account_circle' },
    { id: 5, username: 'futbolero', points: 900, avatar: 'account_circle' },
    { id: 6, username: 'guest', points: 500, avatar: 'account_circle' },
    { id: 7, username: 'jugador_nuevo', points: 120, avatar: 'account_circle' },
    { id: 8, username: 'novato', points: 50, avatar: 'account_circle' }
  ];

  constructor() {}

  getLeaderboard(): Observable<any[]> {
    return of(this.mockLeaderboard).pipe(delay(500));
  }
}