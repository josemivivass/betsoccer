import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

import { 
  personCircleOutline, saveOutline, logOutOutline, pencil, 
  star, flash, planet, rocket, happy, skull 
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  user: any = { username: 'Usuario', email: '', avatar: 'star' };
  
  availableAvatars = [
    'star',
    'flash',
    'rocket',
    'planet',
    'happy',
    'skull'
  ];

  constructor() {
    addIcons({ 
      personCircleOutline, saveOutline, logOutOutline, pencil, 
      star, flash, planet, rocket, happy, skull 
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const currentUser = (this.authService as any).getCurrentUserValue ? 
                        (this.authService as any).getCurrentUserValue() : 
                        null;

    const localUser = localStorage.getItem('user');
    
    if (currentUser) {
      this.user = { ...currentUser };
    } else if (localUser) {
      this.user = JSON.parse(localUser);
    }

    if (!this.user.avatar || this.user.avatar.includes('http') || this.user.avatar === 'account_circle') {
      this.user.avatar = 'star';
    }
  }

  selectAvatar(iconName: string) {
    this.user.avatar = iconName;
  }

  async saveProfile() {
    if ((this.authService as any).updateLocalUser) {
        (this.authService as any).updateLocalUser(this.user);
    } else {
        localStorage.setItem('user', JSON.stringify(this.user));
    }
    
    const toast = await this.toastCtrl.create({
      message: '¡Icono actualizado correctamente!',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    toast.present();
  }

  async logout() {
    await this.authService.logout();
    window.location.href = '/login'; 
  }
}