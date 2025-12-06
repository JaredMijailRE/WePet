import { ImageSourcePropType } from 'react-native';

export type MoodId =
  | 1 | 2 | 3 | 4
  | 5 | 6 | 7 | 8
  | 9 | 10 | 11 | 12
  | 13 | 14 | 15 | 16;

export type MoodName =
  | 'happy'
  | 'excited'
  | 'calm'
  | 'tired'
  | 'proud'
  | 'jealous'
  | 'worried'
  | 'sad'
  | 'surprised'
  | 'scared'
  | 'shy'
  | 'angry'
  | 'silly'
  | 'bored'
  | 'loved'
  | 'confused';

export interface Mood {
  id: MoodId;
  name: MoodName;
}

type MoodConfig = {
  image: ImageSourcePropType;
  color: string;
};

export const moodConfig: Record<MoodName, MoodConfig> = {
  happy: { image: require('./emojis/happy.png'), color: '#FFB347' },
  excited: { image: require('./emojis/excited.png'), color: '#FF7F7F' },
  proud: { image: require('./emojis/proud.png'), color: '#FFB347' },
  loved: { image: require('./emojis/loved.png'), color: '#FF9EC4' },
  silly: { image: require('./emojis/silly.png'), color: '#FF9EC4' },
  sad: { image: require('./emojis/sad.png'), color: '#6FA8DC' },
  tired: { image: require('./emojis/tired.png'), color: '#6FA8DC' },
  bored: { image: require('./emojis/bored.png'), color: '#6FA8DC' },
  confused: { image: require('./emojis/confused.png'), color: '#6FA8DC' },
  angry: { image: require('./emojis/angry.png'), color: '#FF6F61' },
  jealous: { image: require('./emojis/jealous.png'), color: '#8BC34A' },
  shy: { image: require('./emojis/shy.png'), color: '#BA68C8' },
  scared: { image: require('./emojis/scared.png'), color: '#9575CD' },
  worried: { image: require('./emojis/worried.png'), color: '#9575CD' },
  calm: { image: require('./emojis/calm.png'), color: '#80DEEA' },
  surprised: { image: require('./emojis/surprised.png'), color: '#FFCC80' },
};
