import { WorldCupWinner } from '../types';

export const WORLD_CUP_WINNERS: WorldCupWinner[] = [
  { year: 1930, champion: 'Uruguay', runner_up: 'Argentina', host: 'Uruguay' },
  { year: 1934, champion: 'Italy', runner_up: 'Czechoslovakia', host: 'Italy' },
  { year: 1938, champion: 'Italy', runner_up: 'Hungary', host: 'France' },
  { year: 1950, champion: 'Uruguay', runner_up: 'Brazil', host: 'Brazil' },
  { year: 1954, champion: 'West Germany', runner_up: 'Hungary', host: 'Switzerland' },
  { year: 1958, champion: 'Brazil', runner_up: 'Sweden', host: 'Sweden' },
  { year: 1962, champion: 'Brazil', runner_up: 'Czechoslovakia', host: 'Chile' },
  { year: 1966, champion: 'England', runner_up: 'West Germany', host: 'England' },
  { year: 1970, champion: 'Brazil', runner_up: 'Italy', host: 'Mexico' },
  { year: 1974, champion: 'West Germany', runner_up: 'Netherlands', host: 'West Germany' },
  { year: 1978, champion: 'Argentina', runner_up: 'Netherlands', host: 'Argentina' },
  { year: 1982, champion: 'Italy', runner_up: 'West Germany', host: 'Spain' },
  { year: 1986, champion: 'Argentina', runner_up: 'West Germany', host: 'Mexico' },
  { year: 1990, champion: 'West Germany', runner_up: 'Argentina', host: 'Italy' },
  { year: 1994, champion: 'Brazil', runner_up: 'Italy', host: 'USA' },
  { year: 1998, champion: 'France', runner_up: 'Brazil', host: 'France' },
  { year: 2002, champion: 'Brazil', runner_up: 'Germany', host: 'Japan/South Korea' },
  { year: 2006, champion: 'Italy', runner_up: 'France', host: 'Germany' },
  { year: 2010, champion: 'Spain', runner_up: 'Netherlands', host: 'South Africa' },
  { year: 2014, champion: 'Germany', runner_up: 'Argentina', host: 'Brazil' },
  { year: 2018, champion: 'France', runner_up: 'Croatia', host: 'Russia' },
  { year: 2022, champion: 'Argentina', runner_up: 'France', host: 'Qatar' },
];

export const CHAMPION_COUNTS: Record<string, number> = WORLD_CUP_WINNERS.reduce(
  (acc, w) => {
    acc[w.champion] = (acc[w.champion] || 0) + 1;
    return acc;
  },
  {} as Record<string, number>
);

export const BLOG_ARTICLES = [
  {
    id: 1,
    title: 'Origins of Football',
    date: 'Ancient History',
    excerpt:
      'Football traces its roots back thousands of years. Ancient civilisations in China, Greece, and Rome all played ball games with their feet. The modern game crystallised in 19th-century England, where Cambridge University codified the first set of rules in 1848, separating football from rugby and establishing the foundation for the sport the world loves today.',
    icon: '⚽',
  },
  {
    id: 2,
    title: 'FIFA Formation',
    date: '1904',
    excerpt:
      "The Fédération Internationale de Football Association was founded in Paris on 21 May 1904 by representatives from Belgium, Denmark, France, the Netherlands, Spain, Sweden, and Switzerland. Robert Guérin of France became the first president. FIFA's mission was to oversee international competition and unify the game's rules globally.",
    icon: '🏛️',
  },
  {
    id: 3,
    title: 'Birth of the World Cup',
    date: '1930',
    excerpt:
      "Jules Rimet, FIFA president, championed the creation of a global tournament. Uruguay was chosen as the first host nation, having won gold at the 1924 and 1928 Olympics. In July 1930, 13 nations competed in Montevideo. Uruguay defeated Argentina 4–2 in the final before 68,000 spectators in the Estadio Centenario — football's grandest stage was born.",
    icon: '🏆',
  },
  {
    id: 4,
    title: 'Evolution of the Game',
    date: '1950s – 2000s',
    excerpt:
      "Brazil's 1958 squad, featuring a 17-year-old Pelé, introduced the beautiful game to a global television audience. The tournament grew from 16 to 24 teams in 1982, then to 32 in 1998. Tactical innovations — Total Football in the 1970s, the sweeper system, high pressing in the 2010s — transformed what the sport demanded of every player.",
    icon: '📈',
  },
  {
    id: 5,
    title: 'VAR and Technology',
    date: '2018 – Present',
    excerpt:
      'Video Assistant Referee technology debuted at Russia 2018 after years of trials. VAR reviews goals, penalties, red cards, and mistaken identity. While controversial — fans debate the interruptions to flow — it has overturned critical errors. Goal-line technology, introduced in 2014, ensures that every ball that crosses the line is counted.',
    icon: '📺',
  },
  {
    id: 6,
    title: 'The 2026 Expansion',
    date: '2026',
    excerpt:
      "The 2026 tournament co-hosted by the United States, Canada, and Mexico marks the boldest structural change since 1998: expansion from 32 to 48 teams. Twelve groups of four replace eight groups of four. Every confederation gains additional spots, bringing football's biggest stage to nations that have never qualified before. 104 matches will be played across 16 cities.",
    icon: '🌍',
  },
];