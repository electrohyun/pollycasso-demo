import type {
  FinishContext,
  Outfit,
  Player,
  RoomSettings,
  RoomState,
} from '@/shared/model';

const createOutfit = (overrides?: Partial<Outfit>): Outfit => ({
  bird: 'bird_07',
  accessory: null,
  hat: null,
  top: null,
  bottom: null,
  shoes: null,
  effect: null,
  ...overrides,
});

export const MOCK_PLAYERS: Player[] = [
  {
    userId: 'user_1',
    nickname: '기현',
    level: 7,
    exp: 80,
    coins: 99,
    status: 'IDLE',
    teamId: null,
    isConnected: true,
    isReady: true,
    totalScore: 290,
    inventory: [],
    outfit: createOutfit({
      bird: 'bird_07',
      hat: 'hat_12',
      top: 'top_16',
      shoes: 'shoes_11',
      effect: 'effect_02',
    }),
  },
  {
    userId: 'user_2',
    nickname: '그림고수',
    level: 12,
    exp: 45,
    coins: 800,
    status: 'IDLE',
    teamId: null,
    isConnected: true,
    isReady: true,
    totalScore: 280,
    inventory: [],
    outfit: createOutfit({
      bird: 'bird_03',
      accessory: 'acc_17',
      hat: 'hat_10',
      top: 'top_19',
      shoes: 'shoes_09',
    }),
  },
  {
    userId: 'user_3',
    nickname: '색칠장인',
    level: 9,
    exp: 20,
    coins: 300,
    status: 'IDLE',
    teamId: null,
    isConnected: true,
    isReady: true,
    totalScore: 270,
    inventory: [],
    outfit: createOutfit({
      bird: 'bird_04',
      accessory: 'acc_03',
      hat: 'hat_06',
      top: 'top_13',
    }),
  },
  {
    userId: 'user_4',
    nickname: '무대위의나',
    level: 10,
    exp: 100,
    coins: 1200,
    status: 'IDLE',
    teamId: null,
    isConnected: true,
    isReady: true,
    totalScore: 260,
    inventory: [],
    outfit: createOutfit({
      bird: 'bird_02',
      hat: 'hat_15',
      top: 'top_22',
      shoes: 'shoes_12',
    }),
  },
  {
    userId: 'user_5',
    nickname: '겨울코디왕',
    level: 20,
    exp: 200,
    coins: 5000,
    status: 'IDLE',
    teamId: null,
    isConnected: true,
    isReady: true,
    totalScore: 250,
    inventory: [],
    outfit: createOutfit({
      bird: 'bird_06',
      accessory: 'acc_21',
      top: 'top_08',
      shoes: 'shoes_06',
    }),
  },
  {
    userId: 'user_6',
    nickname: '포폴구경꾼',
    level: 3,
    exp: 10,
    coins: 50,
    status: 'IDLE',
    teamId: null,
    isConnected: true,
    isReady: true,
    totalScore: 240,
    inventory: [],
    outfit: createOutfit({
      bird: 'bird_01',
      top: 'top_01',
      effect: 'effect_01',
    }),
  },
];

export const MOCK_FINISH_CONTEXT: FinishContext = {
  results: [
    {
      userId: 'user_1',
      rank: 1,
      expGained: 30,
      coinsGained: 20,
      didLevelUp: true,
    },
    {
      userId: 'user_2',
      rank: 2,
      expGained: 30,
      coinsGained: 20,
      didLevelUp: false,
    },
    {
      userId: 'user_3',
      rank: 3,
      expGained: 30,
      coinsGained: 20,
      didLevelUp: false,
    },
    {
      userId: 'user_4',
      rank: 4,
      expGained: 30,
      coinsGained: 20,
      didLevelUp: false,
    },
    {
      userId: 'user_5',
      rank: 5,
      expGained: 30,
      coinsGained: 20,
      didLevelUp: false,
    },
    {
      userId: 'user_6',
      rank: 6,
      expGained: 30,
      coinsGained: 20,
      didLevelUp: false,
    },
  ],
};

const MOCK_ROOM_SETTINGS: RoomSettings = {
  roomTitle: '포트폴리오 데모방',
  maxPlayers: 6,
  gameMode: 'SOLO',
  isPrivate: false,
};

const MOCK_TEAM_PLAYERS = MOCK_PLAYERS.map((player, index) => ({
  ...player,
  teamId: index % 2 === 0 ? 'RED' : 'BLUE',
}));

export const MOCK_FINISHED_ROOM_STATE: RoomState = {
  status: 'FINISHED',
  hostId: MOCK_PLAYERS[0].userId,
  endsAt: Date.now() + 1000 * 10,
  settings: MOCK_ROOM_SETTINGS,
  players: MOCK_PLAYERS,
  currentRound: 3,
  totalRounds: 3,
  phaseContext: MOCK_FINISH_CONTEXT,
  teamScore: null,
};

export const MOCK_TEAM_FINISHED_ROOM_STATE: RoomState = {
  ...MOCK_FINISHED_ROOM_STATE,
  settings: {
    ...MOCK_ROOM_SETTINGS,
    gameMode: 'TEAM',
  },
  players: MOCK_TEAM_PLAYERS,
  teamScore: {
    blue: 120,
    red: 150,
  },
};
