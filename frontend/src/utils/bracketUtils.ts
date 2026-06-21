import {
  BracketData,
  BracketMatch,
  GroupResults,
  GroupsData,
  QualifiedTeam,
  RoundKey,
} from '../types';

// ─── Counting helpers ─────────────────────────────────────────────────────────

export function countQualified(groupResults: GroupResults): number {
  let n = 0;
  for (const r of Object.values(groupResults)) {
    if (r.winner) n++;
    if (r.runner_up) n++;
    if (r.third) n++;
  }
  return n;
}

export function countThirds(groupResults: GroupResults): number {
  return Object.values(groupResults).filter((r) => r.third).length;
}

// ─── Build 32 qualified teams from group picks ───────────────────────────────

export function buildQualifiedTeams(
  groupResults: GroupResults,
  groupsData: GroupsData
): QualifiedTeam[] {
  const teams: QualifiedTeam[] = [];
  const letters = Object.keys(groupsData).sort();

  const findFlag = (letter: string, name: string) =>
    groupsData[letter]?.teams.find((t) => t.name === name)?.flag || '🏳️';
  const findCode = (letter: string, name: string) =>
    groupsData[letter]?.teams.find((t) => t.name === name)?.code || '???';

  // 1st and 2nd place
  for (const letter of letters) {
    const r = groupResults[letter];
    if (!r) continue;
    if (r.winner) {
      teams.push({
        name: r.winner,
        code: `${letter}1`,
        flag: findFlag(letter, r.winner),
        teamCode: findCode(letter, r.winner),
      });
    }
    if (r.runner_up) {
      teams.push({
        name: r.runner_up,
        code: `${letter}2`,
        flag: findFlag(letter, r.runner_up),
        teamCode: findCode(letter, r.runner_up),
      });
    }
  }

  // Best 8 third-place teams
  for (const letter of letters) {
    const r = groupResults[letter];
    if (!r?.third) continue;
    teams.push({
      name: r.third,
      code: `${letter}3`,
      flag: findFlag(letter, r.third),
      teamCode: findCode(letter, r.third),
    });
  }

  return teams.slice(0, 32);
}

// ─── Build empty bracket structure from 32 qualified teams ──────────────────

export function buildInitialBracket(qualified: QualifiedTeam[]): BracketData {
  const teams = [...qualified];
  while (teams.length < 32) {
    teams.push({ name: '', code: 'TBD', flag: '', teamCode: '???' });
  }

  const r32: BracketMatch[] = Array.from({ length: 16 }, (_, i) => ({
    id: `r32-${i}`,
    home: {
      team: teams[i].name || null,
      code: teams[i].code || null,
      flag: teams[i].flag || null,
    },
    away: {
      team: teams[31 - i].name || null,
      code: teams[31 - i].code || null,
      flag: teams[31 - i].flag || null,
    },
    winner: null,
    round: 'r32',
    position: i,
  }));

  const makeRound = (round: RoundKey, count: number): BracketMatch[] =>
    Array.from({ length: count }, (_, i) => ({
      id: `${round}-${i}`,
      home: { team: null, code: null, flag: null },
      away: { team: null, code: null, flag: null },
      winner: null,
      round,
      position: i,
    }));

  return {
    r32,
    r16: makeRound('r16', 8),
    qf: makeRound('qf', 4),
    sf: makeRound('sf', 2),
    final: makeRound('final', 1),
    third_place: makeRound('third_place', 1),
  };
}

// ─── Advance winner through bracket ──────────────────────────────────────────

const NEXT_ROUND: Partial<Record<RoundKey, RoundKey>> = {
  r32: 'r16',
  r16: 'qf',
  qf: 'sf',
  sf: 'final',
};

export function advanceWinner(
  bracket: BracketData,
  matchId: string,
  winner: string,
  winnerFlag: string | null,
  winnerCode: string | null
): BracketData {
  const b: BracketData = JSON.parse(JSON.stringify(bracket));
  const rounds: RoundKey[] = ['r32', 'r16', 'qf', 'sf', 'final', 'third_place'];

  let match: BracketMatch | undefined;
  let round: RoundKey | undefined;

  for (const r of rounds) {
    const found = b[r].find((m) => m.id === matchId);
    if (found) {
      match = found;
      round = r;
      found.winner = winner;
      break;
    }
  }
  if (!match || !round) return b;

  const isEven = match.position % 2 === 0;
  const parentPos = Math.floor(match.position / 2);

  // SF losers go to third-place match
  if (round === 'sf') {
    const loser = match.home.team === winner ? match.away : match.home;
    const tp = b.third_place[0];
    if (!tp.home.team) {
      tp.home = { ...loser };
    } else if (!tp.away.team) {
      tp.away = { ...loser };
    }
  }

  const nextRound = NEXT_ROUND[round];
  if (!nextRound) return b;

  const nextMatch = b[nextRound].find((m) => m.position === parentPos);
  if (nextMatch) {
    const slot = isEven ? 'home' : 'away';
    nextMatch[slot] = { team: winner, flag: winnerFlag, code: winnerCode };
  }

  return b;
}

// ─── Round labels ─────────────────────────────────────────────────────────────

export const ROUND_LABELS: Record<RoundKey, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-Finals',
  sf: 'Semi-Finals',
  final: 'Final',
  third_place: '3rd Place',
};