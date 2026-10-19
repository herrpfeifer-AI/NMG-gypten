import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StudentProgress, StationId, TeacherSettings } from '../types';
import { DEMO_STUDENTS, QUIZ_QUESTIONS, CLOZE_STORIES, CLASS_5B_NAME, createFreshClassStudents } from '../data/learningData';
import { sounds } from '../utils/soundEffects';

interface ProgressContextType {
  student: StudentProgress;
  studentsList: StudentProgress[];
  currentStation: StationId;
  setCurrentStation: (station: StationId) => void;
  isTeacherMode: boolean;
  setIsTeacherMode: (val: boolean) => void;
  teacherSettings: TeacherSettings;
  updateTeacherSettings: (settings: Partial<TeacherSettings>) => void;
  setStudentName: (name: string, schoolClass?: string) => void;
  selectStudentByName: (name: string) => void;
  resetEntireApp: () => void;
  markVideoWatched: () => void;
  saveVideoNotes: (notes: string) => void;
  setClozeAnswer: (gapId: string, word: string) => void;
  resetClozeAnswers: () => void;
  markClozeCompleted: () => void;
  setTextAnswer: (qId: number, answer: string) => void;
  markTextCompleted: () => void;
  setQuizAnswer: (qId: number, choice: 'A' | 'B' | 'C' | 'D') => void;
  setQuizOptionAttempt: (qId: number, choice: 'A' | 'B' | 'C' | 'D') => { isCorrect: boolean; attempt: number; showHint: boolean; showSolution: boolean };
  unlockQuizWithRamsesCode: (code: string) => boolean;
  submitQuiz: () => { score: number; passed: boolean; needsRamses: boolean };
  setGroupPartners: (partner1: string, partner2: string) => void;
  setGroupRole: (role: 'A' | 'B' | 'C' | 'D') => void;
  setGroupTaskChoice: (choice: 'theater_transport' | 'theater_grab' | 'erfindungen' | 'puzzle' | 'kreativ') => void;
  updateGroupNotes: (notes: Partial<StudentProgress['groupNotes']>) => void;
  markGroupCompleted: () => void;
  assignPresentationGroup: (partner1?: string, partner2?: string) => { partner1: string; partner2: string } | null;
  saveTheaterFeedback: (feedback: { keywordsMentioned: string[]; rating: number; praise: string; tip: string }) => void;
  saveTheaterPhoto: (photoDataUrl: string) => void;
  unlockGroupWithCheopsCode: (code: string) => boolean;
  recordSolutionBookletUsed: () => void;
  submitResultsToTeacher: () => void;
  switchActiveStudent: (studentId: string) => void;
  addNewStudent: (name: string, schoolClass: string) => void;
  resetCurrentStudent: () => void;
  resetStudentProgressById: (studentId: string) => void;
  triggerCelebration: () => void;
  totalProgressPercent: number;
  allThreeClozesSolved: boolean;
  solvedStoriesCount: number;
  lockedNotice: boolean;
  dismissLockedNotice: () => void;
  canAccessGroupStation: boolean;
  needsRamsesCode: boolean;
  needsCheopsCode: boolean;
}

const STORAGE_KEY_STUDENTS = 'woozle_aegypten_students_v3';
const STORAGE_KEY_ACTIVE_ID = 'woozle_aegypten_active_student_id_v3';
const STORAGE_KEY_SETTINGS = 'woozle_aegypten_settings_v3';

const DEFAULT_CURRENT_STUDENT: StudentProgress = {
  id: 'stud-1',
  name: 'Carla',
  schoolClass: CLASS_5B_NAME,
  currentStation: 'video',
  videoWatched: false,
  videoNotes: '',
  clozeAnswers: {},
  clozeCompleted: false,
  textAnswers: {},
  textCompleted: false,
  quizAnswers: {},
  quizAttempts: {},
  quizErrorsCount: 0,
  quizCompleted: false,
  quizScore: 0,
  quizRamsesUnlocked: false,
  groupNotes: {},
  groupCompleted: false,
  groupCheopsUnlocked: false,
  usedSolutionBooklet: false,
  submittedToTeacher: false,
  badges: [],
  lastUpdated: 'Noch nicht begonnen'
};


const DEFAULT_SETTINGS: TeacherSettings = {
  allowStudentSolutionView: true,
  customYoutubeId: 'L9jJ_EwuaE4',
  classGroup: CLASS_5B_NAME
};

const extractYouTubeId = (urlOrId: string): string => {
  if (!urlOrId) return 'L9jJ_EwuaE4';
  const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  return urlOrId.trim();
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentsList, setStudentsList] = useState<StudentProgress[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return createFreshClassStudents();
  });

  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || 'stud-1';
    } catch {
      return 'stud-1';
    }
  });

  const [currentStationState, setCurrentStationState] = useState<StationId>('video');
  const [lockedNotice, setLockedNotice] = useState<boolean>(false);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [teacherSettings, setTeacherSettings] = useState<TeacherSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.customYoutubeId === '3z7o1Y184zQ' || !parsed.customYoutubeId) {
          parsed.customYoutubeId = 'L9jJ_EwuaE4';
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  // Save students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(studentsList));
    } catch (e) {
      console.error(e);
    }
  }, [studentsList]);

  // Save active student ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeStudentId);
    } catch (e) {
      console.error(e);
    }
  }, [activeStudentId]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(teacherSettings));
    } catch (e) {
      console.error(e);
    }
  }, [teacherSettings]);

  const activeStudent = studentsList.find(s => s.id === activeStudentId) || studentsList[0] || DEFAULT_CURRENT_STUDENT;

  const updateActiveStudent = (updater: (prev: StudentProgress) => StudentProgress) => {
    setStudentsList(prev =>
      prev.map(s => {
        if (s.id === activeStudent.id) {
          const updated = updater(s);
          return {
            ...updated,
            lastUpdated: 'vor 1 Minute'
          };
        }
        return s;
      })
    );
  };

  const triggerCelebration = () => {
    sounds.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ef4444', '#10b981']
    });
  };

  const setStudentName = (name: string, schoolClass?: string) => {
    updateActiveStudent(prev => ({
      ...prev,
      name,
      schoolClass: schoolClass || prev.schoolClass
    }));
  };

  const markVideoWatched = () => {
    updateActiveStudent(prev => {
      const newBadges = prev.badges.includes('badge-video')
        ? prev.badges
        : [...prev.badges, 'badge-video'];
      return {
        ...prev,
        videoWatched: true,
        badges: newBadges
      };
    });
    triggerCelebration();
  };

  const saveVideoNotes = (videoNotes: string) => {
    updateActiveStudent(prev => ({ ...prev, videoNotes }));
  };

  const setClozeAnswer = (gapId: string, word: string) => {
    sounds.playPop();
    updateActiveStudent(prev => ({
      ...prev,
      clozeAnswers: {
        ...prev.clozeAnswers,
        [gapId]: word
      }
    }));
  };

  const resetClozeAnswers = () => {
    updateActiveStudent(prev => ({
      ...prev,
      clozeAnswers: {}
    }));
  };

  const markClozeCompleted = () => {
    sounds.playCorrect();
    updateActiveStudent(prev => ({
      ...prev,
      clozeCompleted: true
    }));
  };

  const setTextAnswer = (qId: number, answer: string) => {
    updateActiveStudent(prev => ({
      ...prev,
      textAnswers: {
        ...prev.textAnswers,
        [qId]: answer
      }
    }));
  };

  const markTextCompleted = () => {
    updateActiveStudent(prev => {
      const newBadges = prev.badges.includes('badge-text')
        ? prev.badges
        : [...prev.badges, 'badge-text'];
      return {
        ...prev,
        textCompleted: true,
        clozeCompleted: true,
        badges: newBadges
      };
    });
    triggerCelebration();
  };

  const setQuizAnswer = (qId: number, choice: 'A' | 'B' | 'C' | 'D') => {
    sounds.playPop();
    updateActiveStudent(prev => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [qId]: choice
      }
    }));
  };

  const setQuizOptionAttempt = (qId: number, choice: 'A' | 'B' | 'C' | 'D') => {
    const question = QUIZ_QUESTIONS.find(q => q.id === qId);
    if (!question) return { isCorrect: false, attempt: 1, showHint: false, showSolution: false };

    const currentAttempts = activeStudent.quizAttempts[qId] || 0;
    const isCorrect = choice === question.correctAnswer;

    if (currentAttempts === 0) {
      // First attempt
      if (isCorrect) {
        sounds.playCorrect();
        updateActiveStudent(prev => ({
          ...prev,
          quizAnswers: { ...prev.quizAnswers, [qId]: choice },
          quizAttempts: { ...prev.quizAttempts, [qId]: 1 }
        }));
        return { isCorrect: true, attempt: 1, showHint: false, showSolution: true };
      } else {
        // Wrong on attempt 1: DO NOT reveal answer! Show hint!
        sounds.playPop();
        updateActiveStudent(prev => ({
          ...prev,
          quizFirstWrongAnswers: { ...(prev.quizFirstWrongAnswers || {}), [qId]: choice },
          quizAttempts: { ...prev.quizAttempts, [qId]: 1 },
          quizErrorsCount: (prev.quizErrorsCount || 0) + 1
        }));
        return { isCorrect: false, attempt: 1, showHint: true, showSolution: false };
      }
    } else {
      // Second attempt
      if (isCorrect) {
        sounds.playCorrect();
        updateActiveStudent(prev => ({
          ...prev,
          quizAnswers: { ...prev.quizAnswers, [qId]: choice },
          quizAttempts: { ...prev.quizAttempts, [qId]: 2 }
        }));
        return { isCorrect: true, attempt: 2, showHint: false, showSolution: true };
      } else {
        // Wrong on attempt 2: now reveal answer & explanation!
        sounds.playPop();
        updateActiveStudent(prev => ({
          ...prev,
          quizAnswers: { ...prev.quizAnswers, [qId]: choice },
          quizAttempts: { ...prev.quizAttempts, [qId]: 2 },
          quizErrorsCount: (prev.quizErrorsCount || 0) + 1
        }));
        return { isCorrect: false, attempt: 2, showHint: false, showSolution: true };
      }
    }
  };

  const unlockQuizWithRamsesCode = (code: string) => {
    if (code.trim().toLowerCase() === 'ramses') {
      sounds.playFanfare();
      triggerCelebration();
      updateActiveStudent(prev => ({
        ...prev,
        quizRamsesUnlocked: true
      }));
      return true;
    }
    return false;
  };

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (activeStudent.quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    const errors = activeStudent.quizErrorsCount || (6 - score);
    const needsRamses = errors >= 3 && !activeStudent.quizRamsesUnlocked;
    const passed = score >= 4 && !needsRamses;

    updateActiveStudent(prev => {
      const newBadges = prev.badges.includes('badge-quiz')
        ? prev.badges
        : [...prev.badges, 'badge-quiz'];
      return {
        ...prev,
        quizCompleted: true,
        quizScore: score,
        badges: newBadges
      };
    });

    if (passed) {
      triggerCelebration();
    } else {
      sounds.playCorrect();
    }

    return { score, passed, needsRamses };
  };

  const setGroupPartners = (partner1: string, partner2: string) => {
    sounds.playPop();
    setStudentsList(prev => prev.map(s => {
      if (s.name === partner1 || s.name === partner2) {
        return {
          ...s,
          groupPartner1: partner1,
          groupPartner2: partner2,
          lastUpdated: '2er-Team gebildet'
        };
      }
      return s;
    }));
  };

  const setGroupRole = (selectedGroupRole: 'A' | 'B' | 'C' | 'D') => {
    sounds.playPop();
    updateActiveStudent(prev => ({ ...prev, selectedGroupRole }));
  };

  const setGroupTaskChoice = (groupTaskChoice: 'theater_transport' | 'theater_grab' | 'erfindungen' | 'puzzle' | 'kreativ') => {
    sounds.playPop();
    const p1 = activeStudent.groupPartner1;
    const p2 = activeStudent.groupPartner2;
    setStudentsList(prev => prev.map(s => {
      if (s.id === activeStudent.id || (p1 && s.name === p1) || (p2 && s.name === p2)) {
        return {
          ...s,
          groupTaskChoice,
          lastUpdated: `Aufgabe gewählt`
        };
      }
      return s;
    }));
  };

  const updateGroupNotes = (notes: Partial<StudentProgress['groupNotes']>) => {
    const p1 = activeStudent.groupPartner1;
    const p2 = activeStudent.groupPartner2;
    setStudentsList(prev => prev.map(s => {
      if (s.id === activeStudent.id || (p1 && s.name === p1) || (p2 && s.name === p2)) {
        return {
          ...s,
          groupNotes: {
            ...s.groupNotes,
            ...notes
          }
        };
      }
      return s;
    }));
  };

  const markGroupCompleted = () => {
    const p1 = activeStudent.groupPartner1;
    const p2 = activeStudent.groupPartner2;
    setStudentsList(prev => prev.map(s => {
      if (s.id === activeStudent.id || (p1 && s.name === p1) || (p2 && s.name === p2)) {
        let newBadges = [...s.badges];
        if (!newBadges.includes('badge-group')) newBadges.push('badge-group');
        return {
          ...s,
          groupCompleted: true,
          badges: newBadges,
          lastUpdated: 'Gruppenaufgabe 4 abgeschlossen'
        };
      }
      return s;
    }));
    triggerCelebration();
  };

  const assignPresentationGroup = (arg1?: string, arg2?: string): { partner1: string; partner2: string } | null => {
    const p1 = activeStudent.groupPartner1 || 'Carla';
    const p2 = activeStudent.groupPartner2 || 'Partner';

    let otherP1 = '';
    let otherP2 = '';

    // If explicit other group names are passed:
    if (arg1 && arg2 && (arg1 !== p1 || arg2 !== p2)) {
      otherP1 = arg1;
      otherP2 = arg2;
    } else {
      // Look for another 2er-team in studentsList
      const otherReadyStudent = studentsList.find(s => 
        s.name !== p1 && 
        s.name !== p2 && 
        s.groupPartner1 && 
        s.groupPartner2
      );
      if (otherReadyStudent && otherReadyStudent.groupPartner1 && otherReadyStudent.groupPartner2) {
        otherP1 = otherReadyStudent.groupPartner1;
        otherP2 = otherReadyStudent.groupPartner2;
      } else {
        // Fallback pair from class
        const availableClassmates = ['Sofia', 'Omar', 'Annabelle', 'Adam', 'Ilian', 'Shukrie', 'Monika', 'Matej'].filter(n => n !== p1 && n !== p2);
        otherP1 = availableClassmates[0] || 'Sofia';
        otherP2 = availableClassmates[1] || 'Omar';
      }
    }

    const assigned = { partner1: otherP1, partner2: otherP2 };
    const reciprocalAssigned = { partner1: p1, partner2: p2 };

    setStudentsList(prev => prev.map(s => {
      if (s.name === p1 || s.name === p2 || s.id === activeStudent.id) {
        return {
          ...s,
          assignedPresentationGroup: assigned,
          lastUpdated: `4er-Gruppe: ${otherP1} & ${otherP2}`
        };
      }
      if (s.name === otherP1 || s.name === otherP2) {
        return {
          ...s,
          assignedPresentationGroup: reciprocalAssigned,
          lastUpdated: `4er-Gruppe: ${p1} & ${p2}`
        };
      }
      return s;
    }));

    return assigned;
  };

  const saveTheaterFeedback = (feedback: { keywordsMentioned: string[]; rating: number; praise: string; tip: string }) => {
    sounds.playCorrect();
    const p1 = activeStudent.groupPartner1;
    const p2 = activeStudent.groupPartner2;
    const otherP1 = activeStudent.assignedPresentationGroup?.partner1;
    const otherP2 = activeStudent.assignedPresentationGroup?.partner2;

    setStudentsList(prev => prev.map(s => {
      // update given on current team
      if (s.id === activeStudent.id || (p1 && s.name === p1) || (p2 && s.name === p2)) {
        return {
          ...s,
          groupNotes: {
            ...s.groupNotes,
            feedbackGiven: {
              toGroup: `${otherP1 || ''} & ${otherP2 || ''}`,
              ...feedback
            }
          },
          lastUpdated: 'Theater-Feedback abgegeben'
        };
      }
      // update received on other team
      if ((otherP1 && s.name === otherP1) || (otherP2 && s.name === otherP2)) {
        return {
          ...s,
          groupNotes: {
            ...s.groupNotes,
            feedbackReceived: {
              fromGroup: `${p1 || ''} & ${p2 || ''}`,
              ...feedback
            }
          }
        };
      }
      return s;
    }));
  };

  const saveTheaterPhoto = (photoDataUrl: string) => {
    sounds.playShutter();
    const p1 = activeStudent.groupPartner1;
    const p2 = activeStudent.groupPartner2;
    const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

    setStudentsList(prev => prev.map(s => {
      if (s.id === activeStudent.id || (p1 && s.name === p1) || (p2 && s.name === p2)) {
        return {
          ...s,
          groupNotes: {
            ...s.groupNotes,
            theaterPhoto: photoDataUrl,
            theaterPhotoTimestamp: now
          },
          lastUpdated: 'Theater-Foto hochgeladen'
        };
      }
      return s;
    }));
  };

  const unlockGroupWithCheopsCode = (code: string): boolean => {
    if (code.trim().toLowerCase() === 'cheops') {
      sounds.playFanfare();
      triggerCelebration();
      const p1 = activeStudent.groupPartner1;
      const p2 = activeStudent.groupPartner2;
      setStudentsList(prev => prev.map(s => {
        if (s.id === activeStudent.id || (p1 && s.name === p1) || (p2 && s.name === p2)) {
          let newBadges = [...s.badges];
          if (!newBadges.includes('badge-group')) newBadges.push('badge-group');
          if (!newBadges.includes('badge-master')) newBadges.push('badge-master');
          return {
            ...s,
            groupCompleted: true,
            groupCheopsUnlocked: true,
            badges: newBadges,
            lastUpdated: 'Freischaltcode eingelöst'
          };
        }
        return s;
      }));
      return true;
    }
    return false;
  };

  const resetStudentProgressById = (studentId: string) => {
    sounds.playPop();
    const target = studentsList.find(s => s.id === studentId);
    if (!target) return;

    const partnerName = target.groupPartner1 === target.name 
      ? target.groupPartner2 
      : target.groupPartner1;

    setStudentsList(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          id: s.id,
          name: s.name,
          schoolClass: s.schoolClass || CLASS_5B_NAME,
          currentStation: 'video',
          videoWatched: false,
          videoNotes: '',
          clozeAnswers: {},
          clozeCompleted: false,
          textAnswers: {},
          textCompleted: false,
          quizAnswers: {},
          quizAttempts: {},
          quizErrorsCount: 0,
          quizCompleted: false,
          quizScore: 0,
          quizRamsesUnlocked: false,
          groupNotes: {},
          groupCompleted: false,
          groupCheopsUnlocked: false,
          usedSolutionBooklet: false,
          submittedToTeacher: false,
          badges: [],
          lastUpdated: 'Zurückgesetzt durch Lehrkraft'
        };
      }
      // If the partner was paired with this student, unlink them from the 2er-team
      if (partnerName && s.name === partnerName) {
        return {
          ...s,
          groupPartner1: undefined,
          groupPartner2: undefined,
          groupTaskChoice: undefined,
          groupCompleted: false,
          groupCheopsUnlocked: false,
          assignedPresentationGroup: undefined,
          lastUpdated: 'Partner wurde zurückgesetzt'
        };
      }
      return s;
    }));
  };

  const recordSolutionBookletUsed = () => {
    if (isTeacherMode) return;
    updateActiveStudent(prev => {
      if (prev.usedSolutionBooklet) return prev;
      return {
        ...prev,
        usedSolutionBooklet: true
      };
    });
  };

  const submitResultsToTeacher = () => {
    const timeStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    updateActiveStudent(prev => ({
      ...prev,
      submittedToTeacher: true,
      submittedAt: timeStr,
      lastUpdated: `Abgegeben um ${timeStr}`
    }));
    sounds.playFanfare();
    triggerCelebration();
  };

  const switchActiveStudent = (studentId: string) => {
    setActiveStudentId(studentId);
  };

  const selectStudentByName = (name: string) => {
    sounds.playPop();
    const trimmed = name.trim();
    const found = studentsList.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
    if (found) {
      setActiveStudentId(found.id);
    } else {
      const newStud: StudentProgress = {
        ...DEFAULT_CURRENT_STUDENT,
        id: `stud-${Date.now()}`,
        name: trimmed,
        schoolClass: CLASS_5B_NAME
      };
      setStudentsList(prev => [newStud, ...prev]);
      setActiveStudentId(newStud.id);
    }
    setCurrentStationState('video');
  };

  const resetEntireApp = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
      localStorage.removeItem('woozle_intro_overview_seen');
      localStorage.removeItem('woozle_intro_overview_seen_v3');
      localStorage.removeItem('woozle_student_name_selected');
      localStorage.removeItem('woozle_student_name_selected_v3');
    } catch (e) {
      console.error(e);
    }
    const fresh = createFreshClassStudents();
    setStudentsList(fresh);
    setActiveStudentId(fresh[0]?.id || 'stud-1');
    setCurrentStationState('video');
    setIsTeacherMode(false);
    setTeacherSettings(DEFAULT_SETTINGS);
    sounds.playFanfare();
  };

  const addNewStudent = (name: string, schoolClass: string) => {
    const newStud: StudentProgress = {
      ...DEFAULT_CURRENT_STUDENT,
      id: `stud-${Date.now()}`,
      name,
      schoolClass
    };
    setStudentsList(prev => [newStud, ...prev]);
    setActiveStudentId(newStud.id);
  };

  const isStorySolved = (story: (typeof CLOZE_STORIES)[number], clozeAnswers: { [gapId: string]: string }) => {
    const keys = Object.keys(story.gaps);
    return keys.length > 0 && keys.every(k => clozeAnswers[`${story.id}_${k}`] === story.gaps[k]);
  };

  const solvedStoriesCount = CLOZE_STORIES.filter(s => isStorySolved(s, activeStudent.clozeAnswers)).length;
  // Strictly requires all 3 cloze stories to have their gaps filled correctly
  const allThreeClozesSolved = solvedStoriesCount === CLOZE_STORIES.length;

  const needsRamsesCode = (activeStudent.quizErrorsCount || 0) >= 3 && !activeStudent.quizRamsesUnlocked;
  const canAccessGroupStation = allThreeClozesSolved && activeStudent.quizCompleted && (!needsRamsesCode || isTeacherMode);
  const needsCheopsCode = !activeStudent.groupCheopsUnlocked;

  const handleSetCurrentStation = (station: StationId) => {
    // Gatekeeper 1: Must solve all 3 textbausteine cloze stories before accessing Station 3 (Quiz), 4 (Gruppe), 5 (Belohnung)
    if ((station === 'quiz' || station === 'gruppenarbeit' || station === 'belohnungen') && !allThreeClozesSolved && !isTeacherMode) {
      sounds.playPop();
      setCurrentStationState('textbausteine');
      setLockedNotice(true);
      setTimeout(() => setLockedNotice(false), 5000);
      return;
    }
    // Gatekeeper 2: If student had 3+ quiz errors and hasn't redeemed "Ramses", block Station 4 and 5
    if ((station === 'gruppenarbeit' || station === 'belohnungen') && needsRamsesCode && !isTeacherMode) {
      sounds.playPop();
      setCurrentStationState('quiz');
      return;
    }
    // Gatekeeper 3: To access Station 5 (Belohnungen / Urkunde), group must have presented and entered teacher code "Cheops"
    if (station === 'belohnungen' && !activeStudent.groupCheopsUnlocked && !isTeacherMode) {
      sounds.playPop();
      setCurrentStationState('gruppenarbeit');
      return;
    }
    setLockedNotice(false);
    setCurrentStationState(station);
  };

  const resetCurrentStudent = () => {
    updateActiveStudent(prev => ({
      ...DEFAULT_CURRENT_STUDENT,
      id: prev.id,
      name: prev.name,
      schoolClass: prev.schoolClass
    }));
    setCurrentStationState('video');
  };

  const updateTeacherSettings = (settings: Partial<TeacherSettings>) => {
    const sanitized = { ...settings };
    if (sanitized.customYoutubeId) {
      sanitized.customYoutubeId = extractYouTubeId(sanitized.customYoutubeId);
    }
    setTeacherSettings(prev => ({ ...prev, ...sanitized }));
  };

  // Compute total progress
  let completedUnits = 0;
  if (activeStudent.videoWatched) completedUnits++;
  if (allThreeClozesSolved) completedUnits++;
  if (activeStudent.quizCompleted) completedUnits++;
  if (activeStudent.groupCompleted) completedUnits++;
  const totalProgressPercent = Math.round((completedUnits / 4) * 100);

  return (
    <ProgressContext.Provider
      value={{
        student: activeStudent,
        studentsList,
        currentStation: currentStationState,
        setCurrentStation: handleSetCurrentStation,
        isTeacherMode,
        setIsTeacherMode,
        teacherSettings,
        updateTeacherSettings,
        setStudentName,
        selectStudentByName,
        resetEntireApp,
        markVideoWatched,
        saveVideoNotes,
        setClozeAnswer,
        resetClozeAnswers,
        markClozeCompleted,
        setTextAnswer,
        markTextCompleted,
        setQuizAnswer,
        setQuizOptionAttempt,
        unlockQuizWithRamsesCode,
        submitQuiz,
        setGroupPartners,
        setGroupRole,
        setGroupTaskChoice,
        updateGroupNotes,
        markGroupCompleted,
        assignPresentationGroup,
        saveTheaterFeedback,
        saveTheaterPhoto,
        unlockGroupWithCheopsCode,
        recordSolutionBookletUsed,
        submitResultsToTeacher,
        switchActiveStudent,
        addNewStudent,
        resetCurrentStudent,
        resetStudentProgressById,
        triggerCelebration,
        totalProgressPercent,
        allThreeClozesSolved,
        solvedStoriesCount,
        lockedNotice,
        dismissLockedNotice: () => setLockedNotice(false),
        canAccessGroupStation,
        needsRamsesCode,
        needsCheopsCode
      }}
    >
      {children}
    </ProgressContext.Provider>
  );


};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
