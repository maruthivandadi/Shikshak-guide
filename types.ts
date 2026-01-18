
export interface UserProfile {
  name: string;
  grade: string;
  subject: string;
  school: string;
  language: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'pdf';
  duration: string;
  category: string;
  thumbnail: string;
  difficulty: 'Beginner' | 'Intermediate';
  link?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string; // Base64 string
  isTyping?: boolean;
  isGeneratingImage?: boolean; // New flag for loading state
}

export enum AppView {
  HOME = 'HOME',
  LEARN = 'LEARN',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  QUERY = 'QUERY', // The overlay/modal for asking questions
}

export interface StatMetric {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}