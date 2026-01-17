import { LearningResource, UserProfile } from './types';

export const APP_NAME = "Shiksha Sahayak";

export const DEFAULT_USER: UserProfile = {
  name: "Sunita Sharma",
  grade: "Grade 4",
  subject: "Mathematics",
  school: "Govt Primary School, Rampur",
  language: "Hindi"
};

export const LANGUAGES = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"
];

export const MOCK_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'Managing Large Classes effectively',
    type: 'video',
    duration: '3 min',
    category: 'Classroom Management',
    thumbnail: 'https://picsum.photos/300/200?random=1',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Fun Fraction Activities',
    type: 'pdf',
    duration: '5 min',
    category: 'Pedagogy',
    thumbnail: 'https://picsum.photos/300/200?random=2',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    title: 'Calm Down Corner Setup',
    type: 'article',
    duration: '2 min',
    category: 'Environment',
    thumbnail: 'https://picsum.photos/300/200?random=3',
    difficulty: 'Beginner'
  }
];

export const MOTIVATIONAL_QUOTES = [
  "Teaching is the one profession that creates all other professions.",
  "You are making a difference every single day.",
  "Small steps lead to big changes in the classroom."
];