
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
    title: '5 Fun Classroom Management Games',
    type: 'video',
    duration: '8 min',
    category: 'Management',
    thumbnail: 'https://img.youtube.com/vi/2iOLK5xOaYM/mqdefault.jpg',
    difficulty: 'Beginner',
    link: 'https://www.youtube.com/watch?v=2iOLK5xOaYM'
  },
  {
    id: '2',
    title: 'Fractions for Kids (Animated)',
    type: 'video',
    duration: '6 min',
    category: 'Pedagogy',
    thumbnail: 'https://img.youtube.com/vi/n0FZhQ_GkKw/mqdefault.jpg',
    difficulty: 'Beginner',
    link: 'https://www.youtube.com/watch?v=n0FZhQ_GkKw'
  },
  {
    id: '3',
    title: '10 Everyday Classroom Hacks',
    type: 'video',
    duration: '10 min',
    category: 'Strategies',
    thumbnail: 'https://img.youtube.com/vi/W3fr4tm_FRo/mqdefault.jpg',
    difficulty: 'Intermediate',
    link: 'https://www.youtube.com/watch?v=W3fr4tm_FRo'
  }
];

export const MOTIVATIONAL_QUOTES = [
  "Teaching is the one profession that creates all other professions.",
  "You are making a difference every single day.",
  "Small steps lead to big changes in the classroom."
];
