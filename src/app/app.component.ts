import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { 
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, 
  IonItem, IonIcon, IonLabel, IonMenuToggle, IonAvatar, IonFooter 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  gridOutline, footballOutline, podiumOutline, personOutline, 
  timeOutline, logOutOutline, chevronForwardOutline, notificationsOutline 
} from 'ionicons/icons';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonApp, IonRouterOutlet, IonSplitPane, IonMenu, 
    IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle,
    IonAvatar, IonFooter, RouterLink, RouterLinkActive
  ],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  showMenu: boolean = false; 

  public appPages = [
    { title: 'Panel', url: '/dashboard', icon: 'grid-outline' },
    { title: 'Liga', url: '/liga', icon: 'football-outline' },
    { title: 'Ranking', url: '/ranking', icon: 'podium-outline' },
    { title: 'Mi Perfil', url: '/profile', icon: 'person-outline' },
  ];

  username: string = 'Usuario';

  constructor() {
    addIcons({ 
      gridOutline, footballOutline, podiumOutline, personOutline, 
      timeOutline, logOutOutline, chevronForwardOutline, notificationsOutline 
    });
  }

  ngOnInit() {
    this.updateUserSession();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateUserSession();
      const url = event.urlAfterRedirects;
      const shouldShow = !url.includes('/login') && !url.includes('/register');
      
      if (this.showMenu !== shouldShow) {
        this.showMenu = shouldShow;
        this.cdr.detectChanges(); 
      }
    });
  }

  private updateUserSession() {
    const userData = localStorage.getItem('user'); 
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.username = user.username || user.name || user.nombre || user.email || 'Usuario';
      } catch (e) {
        this.username = 'Usuario';
      }
    } else {
        this.username = 'Usuario';
    }
    this.cdr.detectChanges();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}