import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserService } from '../../core/services/user.service';
import { personCircleOutline, trophy } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RankingPage implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  topThree: any[] = [];
  restList: any[] = [];
  loading = true;

  constructor() {
    addIcons({ personCircleOutline, trophy });
  }

  ngOnInit() {
    this.loadRanking();
  }

  loadRanking(event?: any) {
    this.loading = true;
    this.userService.getLeaderboard().subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          const sortedData = data.sort((a, b) => b.points - a.points);

          sortedData.forEach((user, index) => {
            user.position = index + 1;
            user.username = user.username || user.name || 'Usuario';
            user.points = user.points || 0;
          });

          this.topThree = sortedData.slice(0, 3);
          this.restList = sortedData.slice(3);

          if (this.topThree.length === 3) {
             this.topThree = [this.topThree[1], this.topThree[0], this.topThree[2]];
          } else if (this.topThree.length === 2) {
             this.topThree = [this.topThree[1], this.topThree[0]];
          }
        } else {
           this.topThree = [];
           this.restList = [];
        }

        this.loading = false;
        if (event) event.target.complete();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando ranking:', err);
        this.loading = false;
        if (event) event.target.complete();
        this.cdr.detectChanges();
      }
    });
  }
}