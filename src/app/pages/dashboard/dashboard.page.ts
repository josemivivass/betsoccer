import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule], 
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private matchService = inject(MatchService);
  
  matches: any[] = [];
  filteredMatches: any[] = [];
  searchTerm: string = '';
  filterStatus: string = 'ALL'; 

  ngOnInit() {
    this.loadMatches();
  }

  private getLogoUrl(teamName: string): string {
    const filename = TEAM_LOGOS[teamName];
    if (filename) {
      return `assets/escudos/${filename}`;
    }
    return ''; 
  }

  loadMatches(event?: any) {
    this.matchService.getMatches().subscribe({
      next: (data) => {
        if (!Array.isArray(data)) return;

        this.matches = data.map((m: any) => {
          const homeTeamName = m.home || 'Equipo Local';
          const awayTeamName = m.away || 'Equipo Visitante';

          return {
            id: m.id,
            homeTeam: homeTeamName,
            awayTeam: awayTeamName,
            homeTeamLogo: this.getLogoUrl(homeTeamName),
            awayTeamLogo: this.getLogoUrl(awayTeamName),
            homeScore: m.homeScore ?? 0,
            awayScore: m.awayScore ?? 0,
            status: (m.status || 'PENDING').toUpperCase(),
            time: String(m.status).toLowerCase() === 'live' ? `${m.minute}'` : m.time
          };
        });

        this.applyFilters();
        if (event) event.target.complete();
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error:', err);
        if (event) event.target.complete();
      }
    });
  }

  applyFilters() {
    let tempMatches = [...this.matches]; 
    
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      tempMatches = tempMatches.filter(m => 
        m.homeTeam.toLowerCase().includes(term) || 
        m.awayTeam.toLowerCase().includes(term)
      );
    }

    if (this.filterStatus !== 'ALL') {
      tempMatches = tempMatches.filter(m => m.status === this.filterStatus);
    }

    this.filteredMatches = tempMatches;
    this.cdr.detectChanges();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilters();
  }

  setFilter(status: string) {
    this.filterStatus = status;
    this.applyFilters();
  }

  goToMatchDetail(matchId: any) {
    this.router.navigate(['/matches', matchId]);
  }
}