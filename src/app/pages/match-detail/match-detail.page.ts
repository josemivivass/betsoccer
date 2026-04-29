import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../core/services/match.service';
import { arrowBackOutline, timeOutline, footballOutline, paperPlaneOutline, chatbubbleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';

const TEAM_LOGOS: { [key: string]: string } = {
  'Real Madrid': 'real_madrid.png',
  'FC Barcelona': 'fc_barcelona.png',
  'Atletico Madrid': 'atletico.png',
  'Sevilla': 'sevilla.png',
  'Real Betis': 'betis.png',
  'Real Sociedad': 'real_sociedad.png',
  'Villarreal': 'villarreal.png',
  'Athletic Club': 'athletic.png',
  'Valencia': 'valencia.png',
  'Osasuna': 'osasuna.png',
  'Girona': 'girona.png',
  'Rayo Vallecano': 'rayo.png',
  'Mallorca': 'mallorca.png',
  'Celta de Vigo': 'celta.png',
  'Cadiz': 'cadiz.png',
  'Getafe': 'getafe.png',
  'Almeria': 'almeria.png',
  'Granada': 'granada.png',
  'Alaves': 'alaves.png',
  'Las Palmas': 'las_palmas.png'
};

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.page.html',
  styleUrls: ['./match-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MatchDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private matchService = inject(MatchService);
  private cdr = inject(ChangeDetectorRef);

  match: any = null;
  loading = true;
  
  matchEvents: any[] = [];

  newMessage: string = '';
  chatMessages = [
    { user: 'Juan', text: '¡Vaya golazo!', time: '10:05' },
    { user: 'Ana', text: 'El árbitro está ciego...', time: '10:07' }
  ];

  constructor() {
    addIcons({ arrowBackOutline, timeOutline, footballOutline, paperPlaneOutline, chatbubbleOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatchDetails(id);
    } else {
      this.loading = false;
    }
  }

  loadMatchDetails(id: string) {
    this.matchService.getMatchById(id).subscribe({
      next: (data) => {
        this.match = data;
        
        if(this.match) {
             this.match.homeTeam = this.match.homeTeam || this.match.home;
             this.match.awayTeam = this.match.awayTeam || this.match.away;
             this.match.homeScore = this.match.homeScore ?? 0;
             this.match.awayScore = this.match.awayScore ?? 0;
             this.match.status = (this.match.status || 'PENDING').toUpperCase();

             if (this.match.events && Array.isArray(this.match.events)) {
               this.matchEvents = this.match.events
                 .filter((e: any) => e.type === 'goal')
                 .map((e: any) => ({
                    minute: e.minute,
                    teamName: e.team,
                    player: e.player,
                    runningScore: e.score
                 }))
                 .sort((a: any, b: any) => a.minute - b.minute);
             } else {
               this.matchEvents = [];
             }
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando partido:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getLogo(teamName: string): string {
    const cleanName = (teamName || '').trim();
    const file = TEAM_LOGOS[cleanName];
    return file ? `assets/escudos/${file}` : ''; 
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatMessages.push({
        user: 'Yo',
        text: this.newMessage,
        time: new Date().toLocaleTimeString().slice(0,5)
      });
      this.newMessage = '';
    }
  }
}