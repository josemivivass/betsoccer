import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { MatchService } from '../../core/services/match.service';

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
  selector: 'app-league',
  templateUrl: './league.page.html',
  styleUrls: ['./league.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class LeaguePage implements OnInit {
  private matchService = inject(MatchService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  standings: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadStandings();
  }

  loadStandings(event?: any) {
    this.matchService.getStandings().subscribe({
      next: (data) => {
        if (!Array.isArray(data)) {
          this.loading = false;
          return;
        }

        this.standings = data.map((team: any) => {
          return {
            name: team.name || 'Equipo',
            played: team.pj ?? 0,
            won:    team.pg ?? 0,
            drawn:  team.pe ?? 0,
            lost:   team.pp ?? 0,
            goalsFor:     team.gf ?? 0,
            goalsAgainst: team.gc ?? 0,
            points: team.pts ?? 0
          };
        });

        this.standings.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const dgA = a.goalsFor - a.goalsAgainst;
          const dgB = b.goalsFor - b.goalsAgainst;
          return dgB - dgA;
        });
        
        this.loading = false;
        if (event) event.target.complete();
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error cargando clasificación', err);
        this.loading = false;
        if (event) event.target.complete();
        this.cdr.detectChanges(); 
      }
    });
  }

  getLogo(teamName: string): string {
    const cleanName = (teamName || '').trim();
    const file = TEAM_LOGOS[cleanName];
    return file ? `assets/escudos/${file}` : ''; 
  }

  goToTeamDetail(teamName: string) {
    this.router.navigate(['/team', teamName]);
  }
}