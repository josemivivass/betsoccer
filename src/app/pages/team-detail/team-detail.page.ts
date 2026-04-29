import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MatchService } from '../../core/services/match.service';
import { arrowBackOutline, personCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { catchError, of } from 'rxjs';

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
  selector: 'app-team-detail',
  templateUrl: './team-detail.page.html',
  styleUrls: ['./team-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TeamDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private matchService = inject(MatchService);
  private cdr = inject(ChangeDetectorRef);

  teamName: string = '';
  teamStats: any = null;
  players: any[] = [];
  loading = true;

  constructor() {
    addIcons({ arrowBackOutline, personCircleOutline });
  }

  ngOnInit() {
    this.teamName = this.route.snapshot.paramMap.get('id') || '';
    console.log('Buscando equipo:', this.teamName);
    
    if (this.teamName) {
      this.loadTeamData();
    } else {
      this.loading = false;
    }
  }

  loadTeamData() {
    this.loading = true;

    this.matchService.getStandings().subscribe({
      next: (standings) => {
        console.log('Clasificación recibida:', standings);
        
        const sorted = standings.sort((a, b) => (b.points || b.pts) - (a.points || a.pts));
        
        const foundTeam = sorted.find((t: any) => 
          (t.teamName || t.name || '').toLowerCase() === this.teamName.toLowerCase()
        );

        if (foundTeam) {
          console.log('Equipo encontrado:', foundTeam);
          const rank = sorted.indexOf(foundTeam) + 1;
          
          this.teamStats = {
            ...foundTeam,
            rank: rank,
            name: foundTeam.teamName || foundTeam.name,
            played: foundTeam.matches_played ?? foundTeam.pj ?? foundTeam.played ?? 0,
            won: foundTeam.won ?? foundTeam.pg ?? 0,
            drawn: foundTeam.drawn ?? foundTeam.pe ?? 0,
            lost: foundTeam.lost ?? foundTeam.pp ?? 0,
            goalsFor: foundTeam.goalsFor ?? foundTeam.gf ?? 0,
            points: foundTeam.points ?? foundTeam.pts ?? 0
          };
        } else {
          console.warn('Equipo NO encontrado en clasificación');
          this.teamStats = { name: this.teamName, rank: '-', points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0 };
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error standings:', err);
        this.teamStats = { name: this.teamName, rank: '-', points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0 };
        this.cdr.detectChanges();
      }
    });

    this.matchService.getPlayers(this.teamName).pipe(
      catchError(err => {
        console.error('Error cargando jugadores (ruta específica):', err);
        return of([]); 
      })
    ).subscribe({
      next: (data) => {
        console.log('Jugadores recibidos:', data);
        
        if (Array.isArray(data)) {
          this.players = data;
        } 
        else if (data && (data as any).players) {
          this.players = (data as any).players;
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getLogo(name: string): string {
    const cleanName = (name || '').trim();
    const file = TEAM_LOGOS[cleanName];
    return file ? `assets/escudos/${file}` : 'assets/icon/favicon.png';
  }
}