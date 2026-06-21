// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

// ─── Groups ───────────────────────────────────────────────────────────────────

export interface Team {
  name: string;
  code: string;
  flag: string;
  confederation: string;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface GroupsData {
  [groupLetter: string]: Group;
}

export interface GroupResult {
  winner: string | null;
  runner_up: string | null;
  third: string | null;
}

export interface GroupResults {
  [groupLetter: string]: GroupResult;
}

// ─── Bracket ──────────────────────────────────────────────────────────────────

export interface MatchSlot {
  team: string | null;
  code: string | null;
  flag: string | null;
}

export interface BracketMatch {
  id: string;
  home: MatchSlot;
  away: MatchSlot;
  winner: string | null;
  round: RoundKey;
  position: number;
}

export type RoundKey = 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'third_place';

export interface BracketData {
  r32: BracketMatch[];
  r16: BracketMatch[];
  qf: BracketMatch[];
  sf: BracketMatch[];
  final: BracketMatch[];
  third_place: BracketMatch[];
}

// ─── Predictions ──────────────────────────────────────────────────────────────

export interface Prediction {
  id: string;
  user_id: string;
  name: string;
  group_results: GroupResults | null;
  bracket: BracketData | null;
  champion: string | null;
  runner_up: string | null;
  third_place: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface PredictionCreate {
  name?: string;
  group_results?: GroupResults;
  bracket?: BracketData;
  champion?: string | null;
  runner_up?: string | null;
  third_place?: string | null;
  is_complete?: boolean;
}

export interface PredictionUpdate extends Partial<PredictionCreate> {}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser extends User {
  prediction_count: number;
}

export interface AdminStats {
  total_users: number;
  total_predictions: number;
  complete_predictions: number;
  most_predicted_champion: string | null;
}

// ─── World Cup History ────────────────────────────────────────────────────────

export interface WorldCupWinner {
  year: number;
  champion: string;
  runner_up: string;
  host: string;
}

// ─── Qualified team (for bracket seeding) ────────────────────────────────────

export interface QualifiedTeam {
  name: string;
  code: string;
  flag: string;
  teamCode: string;
}