export type StationId = 'video' | 'textbausteine' | 'quiz' | 'gruppenarbeit' | 'belohnungen';

export const CLASS_STUDENTS = [
  'Carla',
  'Matej',
  'Sofia',
  'Omar',
  'Angelica',
  'Ilian',
  'Shukrie',
  'Monika',
  'Annabelle',
  'Adam',
  'Brittany',
  'Amelia',
  'Melisa',
  'Sophia',
  'Viola',
  'Luca',
  'Louis',
  'Marin',
  'Derin',
  'Amira'
] as const;

export type StudentName = typeof CLASS_STUDENTS[number];

export interface VideoChapter {
  id: string;
  title: string;
  timeSeconds: number;
  timeFormatted: string;
  description: string;
  iconName: string;
}

export interface TextModuleQuestion {
  id: number;
  title: string;
  question: string;
  category: string;
  tip: string;
  suggestedBlocks: string[];
  sampleSolution: string;
}

export interface ClozeGap {
  id: string;
  correctWord: string;
}

export interface ClozeItem {
  id: string;
  title: string;
  intro: string;
  textTemplate: string;
  availableWords: string[];
  gaps: { [key: string]: string };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  woozleFact: string;
  hint: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  station: StationId;
  color: string;
  unlockedAtStep: string;
}

export interface StudentProgress {
  id: string;
  name: string;
  schoolClass: string;
  currentStation: StationId;
  videoWatched: boolean;
  videoNotes: string;
  clozeAnswers: { [gapId: string]: string };
  clozeCompleted: boolean;
  textAnswers: { [questionId: number]: string };
  textCompleted: boolean;
  quizAnswers: { [questionId: number]: 'A' | 'B' | 'C' | 'D' };
  quizAttempts: { [questionId: number]: number }; // 1 or 2
  quizFirstWrongAnswers?: { [questionId: number]: 'A' | 'B' | 'C' | 'D' };
  quizErrorsCount: number;
  quizCompleted: boolean;
  quizScore: number;
  quizRamsesUnlocked?: boolean;
  groupPartner1?: string;
  groupPartner2?: string;
  selectedGroupRole?: 'A' | 'B' | 'C' | 'D';
  groupTaskChoice?: 'theater_transport' | 'theater_grab' | 'erfindungen' | 'puzzle' | 'kreativ';
  groupNotes: {
    theaterTopic?: 'transport' | 'grab';
    theaterPartner1Role?: string;
    theaterPartner2Role?: string;
    theaterNotes?: string;
    theaterPhoto?: string;
    theaterPhotoTimestamp?: string;
    feedbackReceived?: {
      fromGroup: string;
      keywordsMentioned: string[];
      rating: number;
      praise: string;
      tip: string;
    };
    feedbackGiven?: {
      toGroup: string;
      keywordsMentioned: string[];
      rating: number;
      praise: string;
      tip: string;
    };
    erfindungenSelected?: string[];
    erfindungenFavorite?: string;
    erfindungenReason?: string;
    puzzleRoleNotes?: string;
    kreativType?: 'tagebuch' | 'grabkammer' | 'rollenspiel';
    kreativText?: string;
    zeitkapselItems?: string[];
  };
  groupCompleted: boolean;
  groupCheopsUnlocked?: boolean;
  assignedPresentationGroup?: {
    partner1: string;
    partner2: string;
  };
  usedSolutionBooklet?: boolean;
  submittedToTeacher?: boolean;
  submittedAt?: string;
  badges: string[];
  lastUpdated: string;
}

export interface TeacherSettings {
  allowStudentSolutionView: boolean;
  customYoutubeId: string;
  classGroup: string;
}

export interface ClassTheaterPhoto {
  id: string;
  groupNames: string;
  topicTitle: string;
  photoUrl: string;
  timestamp: string;
  applauseCount: number;
}
