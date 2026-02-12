
export enum FunnelStep {
  INDEX = 'INDEX',
  START_SCREEN = 'START_SCREEN',
  BIOMETRIC_ANALYSIS = 'BIOMETRIC_ANALYSIS',
  ERROR_SCREEN = 'ERROR_SCREEN',
  BREATHING = 'BREATHING',
  BLUE_SCREEN = 'BLUE_SCREEN',
  INSTAGRAM_SCROLL = 'INSTAGRAM_SCROLL',
  WHATSAPP = 'WHATSAPP',
  PHONE_CALL = 'PHONE_CALL',
  SECRET_LOGIN = 'SECRET_LOGIN',
  AUTODESTRUCT = 'AUTODESTRUCT',
  OFFER = 'OFFER',
  STRESS_QUIZ = 'STRESS_QUIZ'
}

export interface Message {
  id: number;
  text: string;
  sender: 'mentor' | 'user';
  timestamp: string;
  isAudio?: boolean;
}

export interface UserProfile {
  name: string;
}
