import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { VideoStation } from './components/VideoStation';
import { TextModuleStation } from './components/TextModuleStation';
import { QuizStation } from './components/QuizStation';
import { GroupStation } from './components/GroupStation';
import { RewardStation } from './components/RewardStation';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SolutionModal } from './components/SolutionModal';
import { IntroOverviewModal } from './components/IntroOverviewModal';
import { StudentSelectModal } from './components/StudentSelectModal';
import { ClassScoreboardModal } from './components/ClassScoreboardModal';
import { PhotoWallModal } from './components/PhotoWallModal';

const STORAGE_OVERVIEW_SEEN = 'woozle_intro_overview_seen_v3';
const STORAGE_NAME_SELECTED = 'woozle_student_name_selected_v3';

const AppContent: React.FC = () => {
  const { 
    currentStation, 
    setCurrentStation, 
    isTeacherMode, 
    student, 
    selectStudentByName, 
    resetEntireApp 
  } = useProgress();

  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isPhotoWallOpen, setIsPhotoWallOpen] = useState(false);

  // Station overview is shown on first visit
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState<boolean>(() => {
    try {
      const seen = localStorage.getItem(STORAGE_OVERVIEW_SEEN);
      return !seen;
    } catch {
      return true;
    }
  });

  // Name selection mask is opened right after overview
  const [isNameSelectModalOpen, setIsNameSelectModalOpen] = useState<boolean>(() => {
    try {
      const selected = localStorage.getItem(STORAGE_NAME_SELECTED);
      const overviewSeen = localStorage.getItem(STORAGE_OVERVIEW_SEEN);
      // If overview has already been seen but no name selected, show it
      return Boolean(overviewSeen && !selected);
    } catch {
      return false;
    }
  });

  const handleCloseOverview = () => {
    try {
      localStorage.setItem(STORAGE_OVERVIEW_SEEN, 'true');
    } catch {}
    setIsOverviewModalOpen(false);

    // Open student name selection mask after the overview
    setIsNameSelectModalOpen(true);
  };

  const handleSelectStudent = (chosenName: string) => {
    selectStudentByName(chosenName);
    try {
      localStorage.setItem(STORAGE_NAME_SELECTED, 'true');
    } catch {}
    setIsNameSelectModalOpen(false);
    setCurrentStation('video');
  };

  const handleResetApp = () => {
    resetEntireApp();
    try {
      localStorage.removeItem(STORAGE_OVERVIEW_SEEN);
      localStorage.removeItem(STORAGE_NAME_SELECTED);
    } catch {}
    setIsNameSelectModalOpen(false);
    setIsOverviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-body">
      {/* Top Header */}
      <Header 
        onOpenSolutions={() => setIsSolutionModalOpen(true)} 
        onOpenOverview={() => setIsOverviewModalOpen(true)}
        onOpenNameSelect={() => setIsNameSelectModalOpen(true)}
        onOpenScoreboard={() => setIsScoreboardOpen(true)}
        onOpenPhotoWall={() => setIsPhotoWallOpen(true)}
        onResetApp={handleResetApp}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {isTeacherMode ? (
          <TeacherDashboard />
        ) : (
          <>
            {/* Interactive Progress Journey across stations */}
            <ProgressBar />

            {/* Active Station View */}
            {currentStation === 'video' && <VideoStation />}
            {currentStation === 'textbausteine' && <TextModuleStation />}
            {currentStation === 'quiz' && <QuizStation />}
            {currentStation === 'gruppenarbeit' && (
              <GroupStation onOpenPhotoWall={() => setIsPhotoWallOpen(true)} />
            )}
            {currentStation === 'belohnungen' && (
              <RewardStation 
                onOpenPhotoWall={() => setIsPhotoWallOpen(true)}
                onOpenScoreboard={() => setIsScoreboardOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* 1. Intro Overview Modal */}
      <IntroOverviewModal
        isOpen={isOverviewModalOpen}
        onClose={handleCloseOverview}
        onStartStation1={() => {
          handleCloseOverview();
        }}
      />

      {/* 2. New Student Name Selection Mask (Klasse 5b - Herr Pfeifer & Frau Escher) */}
      <StudentSelectModal
        isOpen={isNameSelectModalOpen}
        onClose={() => setIsNameSelectModalOpen(false)}
        onSelectStudent={handleSelectStudent}
        currentStudentName={student.name}
        canCloseWithoutSelect={Boolean(student.name && localStorage.getItem(STORAGE_NAME_SELECTED))}
      />

      {/* Class Scoreboard Modal (Points & Ranking for the whole class) */}
      <ClassScoreboardModal
        isOpen={isScoreboardOpen}
        onClose={() => setIsScoreboardOpen(false)}
      />

      {/* Class Photo Wall Modal (Pinboard with Theater Poses) */}
      <PhotoWallModal
        isOpen={isPhotoWallOpen}
        onClose={() => setIsPhotoWallOpen(false)}
        onOpenGroupStation={() => {
          setIsPhotoWallOpen(false);
          setCurrentStation('gruppenarbeit');
        }}
      />

      {/* Modal Solution Handbook */}
      <SolutionModal
        isOpen={isSolutionModalOpen}
        onClose={() => setIsSolutionModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>Expedition Altes Ägypten • Begleitmaterial zu „Was macht Woozle im alten Ägypten?“</span>
          </div>
          <div className="text-amber-500/80 font-mono text-[11px]">
            1. Video • 2. Textbausteine • 3. Quiz • 4. Gruppe • 5. Belohnung
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
