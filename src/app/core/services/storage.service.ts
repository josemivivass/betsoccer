import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';

  async setToken(token: string): Promise<void> {
    await Preferences.set({
      key: this.TOKEN_KEY,
      value: token
    });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async removeToken(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
  }
}