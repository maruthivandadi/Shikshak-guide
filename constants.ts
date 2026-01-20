
import { LearningResource, UserProfile, UserStats } from './types';

export const APP_NAME = "Shiksha Sahayak";

// Initial state is "Guest" to encourage profile completion
export const DEFAULT_USER: UserProfile = {
  name: "",
  grade: "",
  subject: "",
  school: "",
  language: "English"
};

export const DEFAULT_STATS: UserStats = {
  totalQueries: 0,
  resourcesViewed: 0,
  currentStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  weeklyActivity: []
};

export const LANGUAGES = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"
];

export const SCHOOL_OPTIONS = [
  "Govt Primary School",
  "Zilla Parishad High School",
  "Mandal Parishad Primary School",
  "Govt Model Higher Secondary School",
  "Kasturba Gandhi Balika Vidyalaya",
  "Kendriya Vidyalaya",
  "Sarvodaya Vidyalaya",
  "Municipal Corporation School"
];

// Dynamic Plans based on Subject - Arrays for Rotation
export const SUBJECT_PLANS: Record<string, any[]> = {
  "Math": [
    {
      title: "Fraction Circles Activity",
      prep: "Cut 5 paper circles per group.",
      steps: [
        "Divide class into groups of 4.",
        "Ask them to fold circle to show 1/2, 1/4, 1/8.",
        "Color the 1/4th part.",
        "Compare 1/4 and 1/8 visually."
      ],
      duration: "20 Mins",
      groupSize: "Groups of 4"
    },
    {
      title: "Market Day Simulation",
      prep: "Fake currency notes using paper.",
      steps: [
        "Set up a small 'shop' with classroom items.",
        "Assign students as shopkeepers and buyers.",
        "Practice addition and subtraction with money.",
        "Rotate roles after 10 minutes."
      ],
      duration: "30 Mins",
      groupSize: "Whole Class"
    },
    {
      title: "Geometry Hunt",
      prep: "None.",
      steps: [
        "Ask students to find objects matching shapes (Circle, Square).",
        "Draw the objects in their notebook.",
        "Measure the sides using a ruler.",
        "Discuss which shape is strongest."
      ],
      duration: "25 Mins",
      groupSize: "Pairs"
    }
  ],
  "Science": [
    {
      title: "Leaf Classification Walk",
      prep: "Notebooks and pencils.",
      steps: [
        "Take students to the school garden/ground.",
        "Collect 5 different types of fallen leaves.",
        "Classify them by size (Small/Big) and edge (Smooth/Rough).",
        "Draw the veins in the notebook."
      ],
      duration: "30 Mins",
      groupSize: "Pairs"
    },
    {
      title: "Shadow Play",
      prep: "Sunlight or a Torch.",
      steps: [
        "Go out in the sun at different times.",
        "Trace a student's shadow with chalk.",
        "Measure the length.",
        "Discuss why shadow length changes."
      ],
      duration: "20 Mins",
      groupSize: "Groups of 3"
    },
    {
      title: "Water Cycle in a Bag",
      prep: "Clear plastic bag, water, tape.",
      steps: [
        "Fill bag with little water.",
        "Tape it to a sunny window.",
        "Observe condensation after 2 hours.",
        "Explain evaporation and rain."
      ],
      duration: "15 Mins",
      groupSize: "Groups of 5"
    }
  ],
  "English": [
    {
      title: "Story Building Circle",
      prep: "A ball or soft object.",
      steps: [
        "Sit in a circle.",
        "Teacher starts: 'Once there was a cat...'",
        "Throw ball to a student. They add one sentence.",
        "Continue until the story has an ending."
      ],
      duration: "15 Mins",
      groupSize: "Whole Class"
    },
    {
      title: "Vocabulary Charades",
      prep: "Chits with action words (Run, Jump, Eat).",
      steps: [
        "One student picks a chit and acts it out.",
        "Class guesses the word in English.",
        "Use the word in a sentence together.",
        "Write the sentence on the board."
      ],
      duration: "20 Mins",
      groupSize: "Whole Class"
    }
  ],
  "Social Studies": [
    {
      title: "Community Helpers Roleplay",
      prep: "Chalk to draw tools.",
      steps: [
        "Assign roles: Doctor, Farmer, Teacher.",
        "Ask students to act out one task they do.",
        "Others guess the profession.",
        "Discuss why each role is important."
      ],
      duration: "25 Mins",
      groupSize: "Groups of 5"
    },
    {
      title: "Draw Your Village Map",
      prep: "Paper and Colors.",
      steps: [
        "Ask students to draw their way from home to school.",
        "Mark important landmarks (Temple, Well, Shop).",
        "Share maps with a partner.",
        "Discuss directions (Left, Right, North)."
      ],
      duration: "30 Mins",
      groupSize: "Individual"
    }
  ],
  "Hindi": [
    {
      title: "Varnamala Matching",
      prep: "Flashcards of letters and objects.",
      steps: [
        "Place letter cards on one side, object cards on other.",
        "Ask students to match 'K' with 'Kamal'.",
        "Speak the word aloud together.",
      ],
      duration: "15 Mins",
      groupSize: "Pairs"
    },
    {
      title: "Kavita Recitation with Action",
      prep: "None.",
      steps: [
        "Pick a simple poem about nature.",
        "Create hand actions for key words.",
        "Recite line by line, students repeat with action.",
        "Group competition for best recitation."
      ],
      duration: "20 Mins",
      groupSize: "Whole Class"
    }
  ],
  "default": [
    {
      title: "Active Recall Session",
      prep: "Chalk and board.",
      steps: [
        "Ask students to close eyes.",
        "Recall 3 things learned yesterday.",
        "Share with a partner.",
        "Write best answers on the board."
      ],
      duration: "10 Mins",
      groupSize: "Pairs"
    }
  ]
};

export const MOCK_RESOURCES: LearningResource[] = [
  {
    id: '1',
    title: 'NIPUN Bharat: Understanding FLN',
    type: 'video',
    duration: '5 min',
    category: 'Pedagogy',
    thumbnail: 'https://img.youtube.com/vi/LCJc-gqXWzE/mqdefault.jpg',
    difficulty: 'Beginner',
    link: 'https://www.youtube.com/watch?v=LCJc-gqXWzE'
  },
  {
    id: '2',
    title: 'Teaching Fractions concretely',
    type: 'video',
    duration: '8 min',
    category: 'Math',
    thumbnail: 'https://img.youtube.com/vi/yT1pTe8lMW4/mqdefault.jpg',
    difficulty: 'Beginner',
    link: 'https://www.youtube.com/watch?v=yT1pTe8lMW4'
  },
  {
    id: '3',
    title: 'Classroom Management Strategies',
    type: 'video',
    duration: '10 min',
    category: 'Management',
    thumbnail: 'https://img.youtube.com/vi/W3UDCMx6U7k/mqdefault.jpg',
    difficulty: 'Intermediate',
    link: 'https://www.youtube.com/watch?v=W3UDCMx6U7k'
  },
  {
    id: '4',
    title: 'ESL Games for English Teachers',
    type: 'video',
    duration: '6 min',
    category: 'English',
    thumbnail: 'https://img.youtube.com/vi/7X0o8o3F8C0/mqdefault.jpg',
    difficulty: 'Beginner',
    link: 'https://www.youtube.com/watch?v=7X0o8o3F8C0'
  },
  {
    id: '5',
    title: 'Science Experiments with Water',
    type: 'video',
    duration: '12 min',
    category: 'Science',
    thumbnail: 'https://img.youtube.com/vi/eQuW8G2QV_Q/mqdefault.jpg',
    difficulty: 'Intermediate',
    link: 'https://www.youtube.com/watch?v=eQuW8G2QV_Q'
  }
];

export const MOTIVATIONAL_QUOTES = [
  "The art of teaching is the art of assisting discovery.",
  "Education is the most powerful weapon which you can use to change the world.",
  "Teachers plant seeds of knowledge that grow forever.",
  "A good teacher is like a candle - it consumes itself to light the way for others."
];
