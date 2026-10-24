import React, { useState } from 'react';
import { 
  Camera, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Users, 
  Calendar, 
  Maximize2, 
  Upload,
  Heart,
  Theater,
  CheckCircle2
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { StudentProgress } from '../types';

interface PhotoWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGroupStation?: () => void;
}

export const PhotoWallModal: React.FC<PhotoWallModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenGroupStation 
}) => {
  const { studentsList, student: activeStudent } = useProgress();
  const [selectedPhoto, setSelectedPhoto] = useState<{
    imageUrl: string;
    groupNames: string;
    topic: string;
    timestamp?: string;
  } | null>(null);

  if (!isOpen) return null;

  // Aggregate unique groups with their photos or theater completion
  interface PhotoEntry {
    id: string;
    partner1: string;
    partner2: string;
    topic: string;
    photoUrl?: string;
    timestamp?: string;
    hasPhoto: boolean;
    isCurrentStudentGroup: boolean;
  }

  const groupEntries: PhotoEntry[] = [];
  const processedKeys = new Set<string>();

  studentsList.forEach(s => {
    if (s.groupPartner1 && s.groupPartner2) {
      const p1 = s.groupPartner1;
      const p2 = s.groupPartner2;
      const key = [p1, p2].sort().join('___');

      if (!processedKeys.has(key)) {
        processedKeys.add(key);

        const topicTitle = s.groupTaskChoice === 'theater_grab' 
          ? 'Grabbeigaben & Tal der Könige' 
          : 'Stein-Transport & Pyramidenbaustelle am Nil';

        const photo = s.groupNotes?.theaterPhoto;
        const time = s.groupNotes?.theaterPhotoTimestamp || (photo ? 'Heute' : undefined);

        const isCurrent = s.name === activeStudent.name || 
          p1 === activeStudent.name || 
          p2 === activeStudent.name;

        groupEntries.push({
          id: key,
          partner1: p1,
          partner2: p2,
          topic: topicTitle,
          photoUrl: photo,
          timestamp: time,
          hasPhoto: Boolean(photo),
          isCurrentStudentGroup: isCurrent
        });
      }
    }
  });

  // If few or no groups yet, add cheerful demo showcase cards to inspire students
  const sampleShowcase: PhotoEntry[] = [
    {
      id: 'showcase-1',
      partner1: 'Sofia',
      partner2: 'Omar',
      topic: 'Stein-Transport & Pyramidenbaustelle am Nil',
      photoUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80',
      timestamp: '09:25 Uhr',
      hasPhoto: true,
      isCurrentStudentGroup: false
    },
    {
      id: 'showcase-2',
      partner1: 'Ilian',
      partner2: 'Shukrie',
      topic: 'Grabbeigaben & Tal der Könige',
      photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      timestamp: '09:40 Uhr',
      hasPhoto: true,
      isCurrentStudentGroup: false
    }
  ];

  // Merge real groups first, followed by demo cards if student hasn't uploaded
  const allCards = [...groupEntries];
  sampleShowcase.forEach(sample => {
    if (!allCards.some(c => c.partner1 === sample.partner1 && c.partner2 === sample.partner2)) {
      allCards.push(sample);
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1a1412] border-4 border-[#8B5A2B] rounded-3xl max-w-5xl w-full shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Board Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#2c1d11] via-[#3d2716] to-[#2c1d11] border-b-2 border-[#8B5A2B]/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#1e130c] rounded-[14px] flex items-center justify-center text-amber-400">
                <Camera className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  NMG 5. Klassen (Klasse 5a & 5b)
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-2xl text-amber-200">
                Theater-Fotowand der Pharaonen
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-black/40 hover:bg-black/60 text-amber-200 hover:text-white flex items-center justify-center border border-amber-600/40 transition-colors shrink-0"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board Instruction Banner */}
        <div className="px-4 py-3 bg-[#24170d] border-b border-[#8B5A2B]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Hier seht ihr alle 2er-Teams in ihrer Theater-Pose! Ladet bei Station 4 (Gruppenarbeit) euer eigenes Foto hoch.
            </span>
          </div>

          {onOpenGroupStation && (
            <button
              onClick={() => {
                onClose();
                onOpenGroupStation();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Eigenes Foto bei Station 4 knipsen</span>
            </button>
          )}
        </div>

        {/* Pinboard Grid (Cork / Papyrus style) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-[#2a1b12] to-[#1c120b] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allCards.map((card, idx) => {
              // slight alternating rotations for authentic pinboard polaroid effect
              const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
              const rot = rotations[idx % rotations.length];

              return (
                <div
                  key={card.id}
                  className={`bg-[#fcf8ed] text-slate-900 rounded-2xl p-4 shadow-xl border-2 border-amber-800/40 transform ${rot} hover:rotate-0 hover:scale-105 transition-all duration-300 relative group flex flex-col justify-between`}
                >
                  {/* Pushpin in header */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-red-600 via-rose-500 to-red-800 shadow-md border border-red-950 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  </div>

                  {/* Photo area */}
                  <div className="space-y-3">
                    <div 
                      onClick={() => {
                        if (card.photoUrl) {
                          setSelectedPhoto({
                            imageUrl: card.photoUrl,
                            groupNames: `${card.partner1} & ${card.partner2}`,
                            topic: card.topic,
                            timestamp: card.timestamp
                          });
                        }
                      }}
                      className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative shadow-inner cursor-pointer group-hover:opacity-95 border border-amber-900/20"
                    >
                      {card.photoUrl ? (
                        <img 
                          src={card.photoUrl} 
                          alt={`Theaterpose von ${card.partner1} und ${card.partner2}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 text-amber-200/70 space-y-2">
                          <Camera className="w-10 h-10 text-amber-400/50 animate-bounce" />
                          <span className="text-xs font-semibold">Noch kein Foto hochgeladen</span>
                          <span className="text-[10px] text-slate-400">Station 4 öffnen & Kamera starten!</span>
                        </div>
                      )}

                      {card.photoUrl && (
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3" />
                          Vergrößern
                        </div>
                      )}
                    </div>

                    {/* Polaroid Text & Info */}
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-display font-bold text-base text-amber-950 leading-tight">
                          {card.partner1} & {card.partner2}
                        </h4>
                        {card.isCurrentStudentGroup && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                            Euer Team ⭐
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-amber-900/90 font-serif italic mt-1 flex items-center gap-1">
                        <Theater className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="line-clamp-1">{card.topic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom footer */}
                  <div className="mt-3 pt-2 border-t border-amber-900/20 flex items-center justify-between text-[11px] text-amber-900/80">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Theater-Pose
                    </span>
                    <span>{card.timestamp || 'Heute'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Lightbox for zoomed-in photo */}
        {selectedPhoto && (
          <div 
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-h-[65vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-amber-500/40">
                <img 
                  src={selectedPhoto.imageUrl} 
                  alt={selectedPhoto.groupNames}
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-xl text-amber-300">
                  {selectedPhoto.groupNames}
                </h3>
                <p className="text-xs text-slate-300">
                  Thema: {selectedPhoto.topic}
                </p>
                {selectedPhoto.timestamp && (
                  <p className="text-[11px] text-slate-400">
                    Aufgenommen um {selectedPhoto.timestamp}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
