import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Observable, tap, of, throwError, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'user';

  // Base de datos en memoria para reemplazar el backend. Se reinicia al recargar la página.
  private usersDB = [
    { id: 1, username: 'user', email: 'user@test.com', password: '123456789%' }
  ];

  constructor() {
    // Limpiamos el storage al iniciar el servicio (cuando recarga la página)
    // para que todo vuelva a su estado inicial y exija login de nuevo.
    this.logout();
  }

  //LOGIN
  login(credentials: { email: string; password: string }): Observable<any> {
    const user = this.usersDB.find(u => u.email === credentials.email && u.password === credentials.password);

    if (user) {
      const response = {
        token: 'local-jwt-token-' + new Date().getTime(),
        user: { id: user.id, username: user.username, email: user.email }
      };

      return of(response).pipe(
        delay(500), // Simulamos el retraso de una petición de red real
        tap(async (res: any) => {
          await Preferences.set({ key: this.TOKEN_KEY, value: res.token });
          console.log('💾 Guardando usuario en Storage:', res.user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        })
      );
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  //REGISTRO
  register(data: { username: string; email: string; password: string }): Observable<any> {
    const userExists = this.usersDB.find(u => u.email === data.email);

    if (userExists) {
      return throwError(() => new Error('El correo ya está registrado'));
    }

    const newUser = { id: this.usersDB.length + 1, ...data };
    this.usersDB.push(newUser);

    const response = {
      token: 'local-jwt-token-' + new Date().getTime(),
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    };

    return of(response).pipe(
      delay(500),
      tap(async (res: any) => {
        await Preferences.set({ key: this.TOKEN_KEY, value: res.token });
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
      })
    );
  }

  //LOGOUT
  async logout() {
    // Borramos Token
    await Preferences.remove({ key: this.TOKEN_KEY });
    localStorage.removeItem(this.USER_KEY);
    localStorage.clear();
  }

  //OBTENER TOKEN
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  //VERIFICAR ESTADO
  async checkAuthStatus(): Promise<boolean> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return !!value; 
  }
  
  //OBTENER USUARIO ACTUAL (Síncrono)
  getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}