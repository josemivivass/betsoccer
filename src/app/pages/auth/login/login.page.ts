import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['user@test.com', [Validators.required, Validators.email]],
    password: ['123456789%', [Validators.required]]
  });

  async onLogin() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value as any).subscribe({
      next: () => {
        this.presentToast('¡Bienvenido de nuevo!', 'success');

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.presentToast('Error: Credenciales incorrectas', 'danger');
        console.error(err);
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}