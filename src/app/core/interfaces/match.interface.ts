export interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

export interface Match {
  id: number;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  matchDate: string;
  league: string;
}