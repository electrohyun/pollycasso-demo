import type { FriendProfile, FriendRelation } from './types';

export interface PortfolioFriend extends FriendProfile {
  relation: FriendRelation;
}

export const PORTFOLIO_FRIENDS: PortfolioFriend[] = [
  {
    userId: 101,
    nickname: '그림고수',
    tag: '1212',
    level: 11,
    isOnline: true,
    relation: 'FRIEND',
    outfit: {
      bird: 'bird_03',
      accessory: 'acc_17',
      hat: 'hat_12',
      top: 'top_16',
      bottom: null,
      shoes: 'shoes_11',
      effect: null,
    },
  },
  {
    userId: 102,
    nickname: '색칠장인',
    tag: '3434',
    level: 9,
    isOnline: false,
    relation: 'FRIEND',
    outfit: {
      bird: 'bird_04',
      accessory: null,
      hat: 'hat_10',
      top: 'top_19',
      bottom: null,
      shoes: 'shoes_09',
      effect: 'effect_02',
    },
  },
  {
    userId: 103,
    nickname: '초대받은손님',
    tag: '7777',
    level: 5,
    isOnline: true,
    relation: 'REQUEST_RECEIVED',
    outfit: {
      bird: 'bird_05',
      accessory: null,
      hat: null,
      top: 'top_13',
      bottom: null,
      shoes: null,
      effect: null,
    },
  },
  {
    userId: 104,
    nickname: '답장기다림',
    tag: '2222',
    level: 14,
    isOnline: false,
    relation: 'REQUEST_SENT',
    outfit: {
      bird: 'bird_08',
      accessory: 'acc_03',
      hat: null,
      top: null,
      bottom: null,
      shoes: 'shoes_04',
      effect: null,
    },
  },
  {
    userId: 105,
    nickname: '잠시차단중',
    tag: '9999',
    level: 21,
    isOnline: false,
    relation: 'BLOCKED',
    outfit: {
      bird: 'bird_09',
      accessory: null,
      hat: 'hat_02',
      top: 'top_05',
      bottom: null,
      shoes: null,
      effect: null,
    },
  },
];

export const PORTFOLIO_RECOMMENDED_FRIENDS: FriendProfile[] = [
  {
    userId: 201,
    nickname: '무대위의나',
    tag: '0002',
    level: 15,
    isOnline: true,
    outfit: {
      bird: 'bird_02',
      accessory: 'acc_12',
      hat: 'hat_06',
      top: 'top_22',
      bottom: null,
      shoes: 'shoes_12',
      effect: null,
    },
  },
  {
    userId: 202,
    nickname: '겨울코디왕',
    tag: '0003',
    level: 7,
    isOnline: false,
    outfit: {
      bird: 'bird_06',
      accessory: null,
      hat: 'hat_15',
      top: 'top_08',
      bottom: null,
      shoes: 'shoes_06',
      effect: null,
    },
  },
  {
    userId: 203,
    nickname: '포폴구경꾼',
    tag: '0004',
    level: 3,
    isOnline: true,
    outfit: {
      bird: 'bird_01',
      accessory: null,
      hat: null,
      top: 'top_01',
      bottom: null,
      shoes: null,
      effect: 'effect_01',
    },
  },
];

export const PORTFOLIO_SEARCH_USERS: FriendProfile[] = [
  ...PORTFOLIO_RECOMMENDED_FRIENDS,
  {
    userId: 204,
    nickname: '기획자친구',
    tag: '1357',
    level: 18,
    isOnline: true,
    outfit: {
      bird: 'bird_07',
      accessory: 'acc_21',
      hat: null,
      top: 'top_24',
      bottom: null,
      shoes: 'shoes_15',
      effect: null,
    },
  },
];
