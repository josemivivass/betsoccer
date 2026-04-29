import { Injectable } from '@angular/core';
import { Match } from '../interfaces/match.interface';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  // Bases de datos locales simuladas (Mock)
  private mockTeams: any[] = [
    { id: 1, name: 'Real Madrid', strength: 90 },
    { id: 2, name: 'FC Barcelona', strength: 88 },
    { id: 3, name: 'Atletico Madrid', strength: 85 },
    { id: 4, name: 'Girona', strength: 84 },
    { id: 5, name: 'Athletic Club', strength: 83 },
    { id: 6, name: 'Real Sociedad', strength: 82 },
    { id: 7, name: 'Villarreal', strength: 81 },
    { id: 8, name: 'Sevilla', strength: 80 },
    { id: 9, name: 'Real Betis', strength: 79 },
    { id: 10, name: 'Valencia', strength: 78 },
    { id: 11, name: 'Celta de Vigo', strength: 76 },
    { id: 12, name: 'Osasuna', strength: 75 },
    { id: 13, name: 'Getafe', strength: 74 },
    { id: 14, name: 'Rayo Vallecano', strength: 74 },
    { id: 15, name: 'Las Palmas', strength: 73 },
    { id: 16, name: 'Mallorca', strength: 73 },
    { id: 17, name: 'Alaves', strength: 72 },
    { id: 18, name: 'Granada', strength: 71 },
    { id: 19, name: 'Cadiz', strength: 70 },
    { id: 20, name: 'Almeria', strength: 69 }
  ];

  private mockMatches: any[] = [
    { id: 371, jornada: 38, home: 'Real Madrid', away: 'Real Betis', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 372, jornada: 38, home: 'Sevilla', away: 'FC Barcelona', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 373, jornada: 38, home: 'Real Sociedad', away: 'Atletico Madrid', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 374, jornada: 38, home: 'Girona', away: 'Granada', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 375, jornada: 38, home: 'Osasuna', away: 'Villarreal', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 376, jornada: 38, home: 'Celta de Vigo', away: 'Valencia', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 377, jornada: 38, home: 'Las Palmas', away: 'Alaves', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 378, jornada: 38, home: 'Rayo Vallecano', away: 'Athletic Club', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 379, jornada: 38, home: 'Almeria', away: 'Cadiz', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] },
    { id: 380, jornada: 38, home: 'Getafe', away: 'Mallorca', homeScore: 0, awayScore: 0, status: 'pending', time: new Date().toISOString(), league: 'La Liga', events: [] }
  ];

  private mockStandings: any[] = [
    { name: 'Real Madrid', strength: 90, pj: 37, pg: 28, pe: 6, pp: 3, gf: 80, gc: 25, pts: 90 },
    { name: 'FC Barcelona', strength: 88, pj: 37, pg: 26, pe: 7, pp: 4, gf: 75, gc: 30, pts: 85 },
    { name: 'Atletico Madrid', strength: 85, pj: 37, pg: 24, pe: 8, pp: 5, gf: 65, gc: 35, pts: 80 },
    { name: 'Girona', strength: 84, pj: 37, pg: 23, pe: 6, pp: 8, gf: 70, gc: 40, pts: 75 },
    { name: 'Athletic Club', strength: 83, pj: 37, pg: 18, pe: 10, pp: 9, gf: 55, gc: 40, pts: 64 },
    { name: 'Real Sociedad', strength: 82, pj: 37, pg: 16, pe: 12, pp: 9, gf: 50, gc: 38, pts: 60 },
    { name: 'Real Betis', strength: 79, pj: 37, pg: 13, pe: 14, pp: 10, gf: 45, gc: 42, pts: 53 },
    { name: 'Villarreal', strength: 81, pj: 37, pg: 14, pe: 10, pp: 13, gf: 55, gc: 55, pts: 52 },
    { name: 'Valencia', strength: 78, pj: 37, pg: 13, pe: 10, pp: 14, gf: 40, gc: 45, pts: 49 },
    { name: 'Osasuna', strength: 75, pj: 37, pg: 11, pe: 9, pp: 17, gf: 38, gc: 50, pts: 42 },
    { name: 'Sevilla', strength: 80, pj: 37, pg: 10, pe: 11, pp: 16, gf: 45, gc: 52, pts: 41 },
    { name: 'Celta de Vigo', strength: 76, pj: 37, pg: 10, pe: 10, pp: 17, gf: 42, gc: 54, pts: 40 },
    { name: 'Alaves', strength: 72, pj: 37, pg: 10, pe: 9, pp: 18, gf: 35, gc: 48, pts: 39 },
    { name: 'Getafe', strength: 74, pj: 37, pg: 9, pe: 12, pp: 16, gf: 38, gc: 52, pts: 39 },
    { name: 'Rayo Vallecano', strength: 74, pj: 37, pg: 8, pe: 14, pp: 15, gf: 32, gc: 45, pts: 38 },
    { name: 'Mallorca', strength: 73, pj: 37, pg: 7, pe: 16, pp: 14, gf: 30, gc: 42, pts: 37 },
    { name: 'Las Palmas', strength: 73, pj: 37, pg: 9, pe: 10, pp: 18, gf: 32, gc: 46, pts: 37 },
    { name: 'Cadiz', strength: 70, pj: 37, pg: 6, pe: 15, pp: 16, gf: 25, gc: 48, pts: 33 },
    { name: 'Granada', strength: 71, pj: 37, pg: 4, pe: 9, pp: 24, gf: 35, gc: 70, pts: 21 },
    { name: 'Almeria', strength: 69, pj: 37, pg: 2, pe: 11, pp: 24, gf: 30, gc: 75, pts: 17 }
  ];

  private mockPlayers: any[] = [
    { id: 1, name: 'Vinícius Jr', team_name: 'Real Madrid', goals: 21 },
    { id: 2, name: 'Jude Bellingham', team_name: 'Real Madrid', goals: 19 },
    { id: 3, name: 'Rodrygo', team_name: 'Real Madrid', goals: 10 },
    { id: 4, name: 'Robert Lewandowski', team_name: 'FC Barcelona', goals: 18 },
    { id: 5, name: 'Lamine Yamal', team_name: 'FC Barcelona', goals: 7 },
    { id: 6, name: 'Raphinha', team_name: 'FC Barcelona', goals: 8 },
    { id: 7, name: 'Antoine Griezmann', team_name: 'Atletico Madrid', goals: 16 },
    { id: 8, name: 'Álvaro Morata', team_name: 'Atletico Madrid', goals: 14 },
    { id: 9, name: 'Artem Dovbyk', team_name: 'Girona', goals: 24 },
    { id: 10, name: 'Savinho', team_name: 'Girona', goals: 9 },
    { id: 11, name: 'Gorka Guruzeta', team_name: 'Athletic Club', goals: 14 },
    { id: 12, name: 'Iñaki Williams', team_name: 'Athletic Club', goals: 11 },
    { id: 13, name: 'Mikel Oyarzabal', team_name: 'Real Sociedad', goals: 9 },
    { id: 14, name: 'Takefusa Kubo', team_name: 'Real Sociedad', goals: 7 },
    { id: 15, name: 'Gerard Moreno', team_name: 'Villarreal', goals: 11 },
    { id: 16, name: 'Alexander Sørloth', team_name: 'Villarreal', goals: 23 },
    { id: 17, name: 'Youssef En-Nesyri', team_name: 'Sevilla', goals: 15 },
    { id: 18, name: 'Isaac Romero', team_name: 'Sevilla', goals: 5 },
    { id: 19, name: 'Isco', team_name: 'Real Betis', goals: 8 },
    { id: 20, name: 'Willian José', team_name: 'Real Betis', goals: 10 },
    { id: 21, name: 'Hugo Duro', team_name: 'Valencia', goals: 13 },
    { id: 22, name: 'Pepelu', team_name: 'Valencia', goals: 6 },
    { id: 23, name: 'Iago Aspas', team_name: 'Celta de Vigo', goals: 9 },
    { id: 24, name: 'Jørgen Strand Larsen', team_name: 'Celta de Vigo', goals: 13 },
    { id: 25, name: 'Ante Budimir', team_name: 'Osasuna', goals: 16 },
    { id: 26, name: 'Borja Mayoral', team_name: 'Getafe', goals: 15 },
    { id: 27, name: 'Mason Greenwood', team_name: 'Getafe', goals: 8 },
    { id: 28, name: 'Sergio Camello', team_name: 'Rayo Vallecano', goals: 6 },
    { id: 29, name: 'Vedat Muriqi', team_name: 'Mallorca', goals: 7 },
    { id: 30, name: 'Kirian Rodríguez', team_name: 'Las Palmas', goals: 6 },
    { id: 31, name: 'Chris Ramos', team_name: 'Cadiz', goals: 5 },
    { id: 32, name: 'Myrto Uzuni', team_name: 'Granada', goals: 11 },
    { id: 33, name: 'Sergio Arribas', team_name: 'Almeria', goals: 9 },
    { id: 34, name: 'Samu Omorodion', team_name: 'Alaves', goals: 8 }
  ];

  constructor() {
    // Simulamos la jornada automáticamente al iniciar la app para poblar los datos
    this.simulateJornada(); 
  }

  simulateJornada() {
    this.mockMatches.forEach(m => {
      if (m.status === 'pending' || m.status === 'PENDING') {
        const homeTeam = this.mockTeams.find(t => t.name === m.home);
        const awayTeam = this.mockTeams.find(t => t.name === m.away);
        
        const homeStr = homeTeam ? homeTeam.strength : 80;
        const awayStr = awayTeam ? awayTeam.strength : 80;
        
        // 1. Generar marcador aleatorio
        m.homeScore = Math.floor(Math.random() * 4 * (homeStr / 80));
        m.awayScore = Math.floor(Math.random() * 4 * (awayStr / 80));
        m.status = 'FINISHED';
        m.time = "90'";
        m.events = [];

        // 2. Generar eventos de goles para mostrar en "Detalles del Partido"
        const homePlayers = this.mockPlayers.filter(p => p.team_name === m.home);
        const awayPlayers = this.mockPlayers.filter(p => p.team_name === m.away);
        const goals = [];
        
        for (let i = 0; i < m.homeScore; i++) goals.push({ team: m.home, isHome: true, minute: Math.floor(Math.random() * 89) + 1 });
        for (let i = 0; i < m.awayScore; i++) goals.push({ team: m.away, isHome: false, minute: Math.floor(Math.random() * 89) + 1 });
        
        goals.sort((a, b) => a.minute - b.minute);
        let currentHome = 0;
        let currentAway = 0;

        goals.forEach(g => {
          if (g.isHome) currentHome++; else currentAway++;
          const teamPlayers = g.isHome ? homePlayers : awayPlayers;
          const player = teamPlayers.length > 0 ? teamPlayers[Math.floor(Math.random() * teamPlayers.length)] : { name: 'Jugador', goals: 0 };
          if (player.goals !== undefined) player.goals++;

          m.events.push({ type: 'goal', team: g.team, player: player.name, minute: g.minute, score: `${currentHome}-${currentAway}` });
        });

        // 3. Actualizar Puntos y Estadísticas en la Clasificación (Liga)
        const homeStd = this.mockStandings.find(s => s.name === m.home);
        const awayStd = this.mockStandings.find(s => s.name === m.away);
        if (homeStd && awayStd) {
          homeStd.pj++; awayStd.pj++;
          homeStd.gf += m.homeScore; homeStd.gc += m.awayScore;
          awayStd.gf += m.awayScore; awayStd.gc += m.homeScore;

          if (m.homeScore > m.awayScore) { homeStd.pg++; homeStd.pts += 3; awayStd.pp++; } 
          else if (m.homeScore < m.awayScore) { awayStd.pg++; awayStd.pts += 3; homeStd.pp++; } 
          else { homeStd.pe++; awayStd.pe++; homeStd.pts += 1; awayStd.pts += 1; }
        }
      }
    });
  }

  getMatches(): Observable<any[]> {
    return of(this.mockMatches).pipe(delay(500)); // Delay simula red
  }

  getStandings(): Observable<any[]> {
    return of(this.mockStandings).pipe(delay(500));
  }

  getMatchById(id: string | number): Observable<any> {
    return of(this.mockMatches).pipe(
      delay(500),
      map(matches => {
        const match = matches.find(m => m.id == id);
        return match || null;
      })
    );
  }

  getPlayers(teamName: string): Observable<any[]> {
    return of(this.mockPlayers.filter(p => p.team_name === teamName)).pipe(delay(500));
  }

  getAllTeams(): Observable<any[]> {
    return of(this.mockTeams).pipe(delay(500));
  }

  // Mock para simular el endpoint /api/simulation/state
  getSimulationState(): Observable<any> {
    return of({
      currentJornada: 38,
      leagueStarted: true,
      lastJornadaStart: new Date().getTime(),
      jornadas: []
    }).pipe(delay(500));
  }

  // Mock para obtener top scorers (/api/players/top-scorers)
  getTopScorers(): Observable<any[]> {
    const topScorers = [...this.mockPlayers]
      .filter(p => p.goals >= 0)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);
    return of(topScorers).pipe(delay(500));
  }
}