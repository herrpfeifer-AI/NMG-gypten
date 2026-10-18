import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Award, 
  UserCheck, 
  RotateCcw,
  BookOpen, 
  HelpCircle,
  Pencil,
  Clock,
  Star,
  CheckSquare,
  Square,
  MessageSquare,
  Laptop
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { THEATER_TOPICS, TheaterTopicDefinition } from '../data/learningData';
import { sounds } from '../utils/soundEffects';

export const GroupStation: React.FC = () => {
  const { 
    student, 
    studentsList,
    setGroupTaskChoice, 
    setGroupPartners,
    updateGroupNotes, 
    markGroupCompleted, 
    assignPresentationGroup,
    saveTheaterFeedback,
    unlockGroupWithCheopsCode,
    setCurrentStation 
  } = useProgress();

  // Registration state
  const currentStudentName = student.name || 'Carla';
  const [partner1, setPartner1] = useState<string>(student.groupPartner1 || currentStudentName);
  const [partner2, setPartner2] = useState<string>(student.groupPartner2 || '');
  const [isEditingTeam, setIsEditingTeam] = useState<boolean>(!student.groupPartner1 || !student.groupPartner2);

  // Filter eligible partners: must have completed Station 1-3 AND not be in any 2er team yet
  const eligiblePartners = studentsList.filter(s => 
    s.name !== currentStudentName &&
    s.videoWatched &&
    s.textCompleted &&
    s.quizCompleted &&
    !s.groupPartner1 &&
    !s.groupPartner2
  );

  // Set default partner2 if empty and eligible partners exist
  useEffect(() => {
    if (!partner2 && eligiblePartners.length > 0) {
      setPartner2(eligiblePartners[0].name);
    }
  }, [eligiblePartners.length, partner2]);

  // Cheops verification state (teacher code)
  const [codeTeacherInput, setCodeTeacherInput] = useState('');
  const [codeError, setCodeError] = useState(false);

  // Active chosen theater task
  const chosenTopicId = student.groupTaskChoice === 'theater_grab' ? 'grab' : student.groupTaskChoice === 'theater_transport' ? 'transport' : null;
  const currentTopic: TheaterTopicDefinition | undefined = THEATER_TOPICS.find(t => t.id === chosenTopicId);

  // Rehearsal keyword check state
  const [checkedKeywords, setCheckedKeywords] = useState<{ [key: string]: boolean }>({});
  const toggleKeyword = (kw: string) => {
    sounds.playPop();
    setCheckedKeywords(prev => ({ ...prev, [kw]: !prev[kw] }));
  };

  // Roles switch state
  const [rolesReversed, setRolesReversed] = useState(false);

  // 4er-Group presentation state
  const isWaitingForOtherTeam = student.groupCompleted && !student.assignedPresentationGroup?.partner1;
  const hasAssignedGroup = Boolean(student.assignedPresentationGroup?.partner1);

  // Feedback form state (given to the other team)
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackCheckedKws, setFeedbackCheckedKws] = useState<string[]>([]);
  const [feedbackPraise, setFeedbackPraise] = useState<string>('Alle Schlagwörter super eingebaut und lebendig gespielt!');
  const [feedbackTip, setFeedbackTip] = useState<string>('Noch etwas lauter und deutlicher sprechen.');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(Boolean(student.groupNotes?.feedbackGiven));

  const handleConfirmTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (partner1 && partner2 && partner1 !== partner2) {
      setGroupPartners(partner1, partner2);
      setIsEditingTeam(false);
      sounds.playCorrect();
    }
  };

  const handleSelectTopic = (topicId: 'transport' | 'grab') => {
    sounds.playPop();
    setGroupTaskChoice(topicId === 'transport' ? 'theater_transport' : 'theater_grab');
  };

  const handleFinishTheaterWork = () => {
    markGroupCompleted();
    const assigned = assignPresentationGroup(partner1, partner2);
    if (assigned) {
      sounds.playFanfare();
    } else {
      sounds.playCorrect();
    }
  };

  const handleCheckForOtherGroup = () => {
    sounds.playPop();
    const assigned = assignPresentationGroup(partner1, partner2);
    if (assigned) {
      sounds.playFanfare();
    }
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    saveTheaterFeedback({
      keywordsMentioned: feedbackCheckedKws,
      rating: feedbackRating,
      praise: feedbackPraise,
      tip: feedbackTip
    });
    setFeedbackSubmitted(true);
    sounds.playFanfare();
  };

  const handleVerifyTeacherCode = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = unlockGroupWithCheopsCode(codeTeacherInput);
    if (ok) {
      setCodeError(false);
      setCodeTeacherInput('');
    } else {
      setCodeError(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 mb-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Station 4: Kooperative 2er-Gruppenwerkstatt & Theater</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-200">
              Das große Pharaonen-Theater (2er-Teams)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Schließt euch zu zweit zusammen und studiert ein kurzes historisches <strong>Theaterstück</strong> ein. 
              Danach führt ihr es einer anderen 2er-Gruppe vor und gebt euch gegenseitig Feedback!
            </p>
          </div>

          {student.groupPartner1 && student.groupPartner2 && !isEditingTeam && (
            <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-3.5 py-2 rounded-2xl shrink-0">
              <UserCheck className="w-4 h-4 text-purple-300" />
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Euer 2er-Team:</span>
                <strong className="text-amber-300">{student.groupPartner1} & {student.groupPartner2}</strong>
              </div>
              <button
                onClick={() => setIsEditingTeam(true)}
                className="ml-2 text-xs text-purple-300 hover:text-white underline p-1"
                title="Team-Namen ändern"
              >
                Ändern
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STEP 1: 2ER-TEAM REGISTRATION OR WAITING FOR FASTEST CHILD */}
      {isEditingTeam ? (
        <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-xl text-amber-200">
              2er-Team Bildung: Klasse 5b
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Für die 2er-Gruppe können nur Kinder gewählt werden, die <strong>Aufgabe 1 bis 3 bereits gelöst</strong> haben und noch in keinem anderen Team sind.
            </p>
          </div>

          {eligiblePartners.length === 0 && !student.groupPartner2 ? (
            /* FASTEST CHILD WAITING BOX */
            <div className="bg-amber-950/30 border-2 border-amber-500/40 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 text-amber-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-amber-200">
                  Du bist superschnell! 🌟
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                  Aktuell hat noch kein anderes Kind Station 1 bis 3 abgeschlossen (oder alle fertigen Kinder haben bereits ein 2er-Team gebildet).
                </p>
              </div>

              {/* Waiting Activity Advice */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/20 text-left text-xs space-y-2">
                <span className="font-bold text-amber-300 block">📚 Was du in der Zwischenzeit tun kannst:</span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Gehe leise nach hinten und lies in den <strong>Sachbüchern zum Alten Ägypten</strong>.</li>
                  <li>Oder öffne <strong>OneNote</strong> und vertiefe deine Notizen zu den Pharaonen!</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => sounds.playPop()}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs border border-amber-500/30 flex items-center justify-center gap-2 mx-auto transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Nach fertigen Mitschüler:innen suchen</span>
                </button>
              </div>
            </div>
          ) : (
            /* TEAM FORMATION FORM */
            <form onSubmit={handleConfirmTeam} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Partner 1 (Current Student) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200">
                    Partner 1 (Du):
                  </label>
                  <div className="w-full bg-slate-950 border border-purple-500/40 rounded-xl p-3 text-sm text-amber-300 font-bold flex items-center justify-between">
                    <span>{partner1}</span>
                    <span className="text-[10px] text-slate-400 font-normal bg-slate-900 px-2 py-0.5 rounded-full">Angemeldet</span>
                  </div>
                </div>

                {/* Partner 2 Selection (Only eligible students) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-200">
                    Partner 2 (Wähle ein freies Kind):
                  </label>
                  <select
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    required
                  >
                    {student.groupPartner2 && (
                      <option value={student.groupPartner2}>{student.groupPartner2} (Bestehendes Team)</option>
                    )}
                    {eligiblePartners.map(s => (
                      <option key={s.name} value={s.name}>
                        {s.name} (Station 1–3 beendet ✓)
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={!partner2 || partner1 === partner2}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 text-xs sm:text-sm inline-flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>2er-Team bestätigen & Theater-Thema wählen</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* STEP 2: THEATER TASK SELECTION & WORKSPACE */
        <div className="space-y-6">

          {/* Theater Topic Selection Tabs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Wählt euer Theater-Thema für das 2er-Team:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEATER_TOPICS.map(topic => {
                const isSelected = chosenTopicId === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.id)}
                    className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-gradient-to-br from-purple-950/70 to-slate-900 border-amber-400 shadow-xl shadow-purple-500/20 scale-[1.02]' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                        Gewählt ✓
                      </div>
                    )}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/30 inline-block">
                        {topic.badge}
                      </span>
                      <h4 className="font-display font-bold text-base text-amber-200">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {topic.shortDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-400">
                      <span>Rollen: {topic.role1.roleName} & {topic.role2.roleName}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE THEATER WORKSPACE */}
          {currentTopic && (
            <div className="bg-slate-900/90 border-2 border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                    Euer gewähltes Theaterstück:
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-amber-200">
                    {currentTopic.title}
                  </h3>
                </div>
                <button
                  onClick={() => setRolesReversed(!rolesReversed)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rollen tauschen</span>
                </button>
              </div>

              {/* Roles Assignment Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Role 1 */}
                {(() => {
                  const roleData = rolesReversed ? currentTopic.role2 : currentTopic.role1;
                  const actorName = rolesReversed ? partner2 : partner1;
                  return (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">Schauspieler:in 1</span>
                        <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full">{actorName}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-purple-200">
                        {roleData.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {roleData.description}
                      </p>
                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs italic text-amber-200/90 font-serif">
                        {roleData.typicalQuote}
                      </div>
                    </div>
                  );
                })()}

                {/* Role 2 */}
                {(() => {
                  const roleData = rolesReversed ? currentTopic.role1 : currentTopic.role2;
                  const actorName = rolesReversed ? partner1 : partner2;
                  return (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">Schauspieler:in 2</span>
                        <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full">{actorName}</span>
                      </div>
                      <h4 className="font-display font-bold text-base text-purple-200">
                        {roleData.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {roleData.description}
                      </p>
                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs italic text-amber-200/90 font-serif">
                        {roleData.typicalQuote}
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Scene Guide & Action Ideas */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Regieanweisung: Wie könnte euer Theater aussehen?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentTopic.sceneGuide}
                </p>
              </div>

              {/* Dialogue Example / Rehearsal Script */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Beispiel-Dialog zum Üben (Ihr dürft eigene Worte erfinden!):
                </span>
                <div className="space-y-2 bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
                  {currentTopic.dialogueExample.map((line, idx) => (
                    <div key={idx} className="text-xs flex items-start gap-2.5">
                      <strong className="text-amber-400 font-display min-w-[80px] shrink-0">{line.speaker}:</strong>
                      <span className="text-slate-200 leading-relaxed font-serif italic">„{line.text}“</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Keywords Checklist for Rehearsal */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                    Pflicht-Schlagwörter (Müssen im Theater vorkommen!):
                  </span>
                  <span className="text-[11px] text-amber-300">Hakt sie beim Proben ab:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {currentTopic.keywords.map((kw) => {
                    const isChecked = checkedKeywords[kw];
                    return (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => toggleKeyword(kw)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                          isChecked 
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className="font-semibold">{kw}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-amber-400" />
                  <span>Eure eigenen Theater-Ideen, Requisiten oder Notizen:</span>
                </label>
                <textarea
                  value={student.groupNotes.theaterNotes || ''}
                  onChange={(e) => updateGroupNotes({ theaterNotes: e.target.value })}
                  placeholder="Welche Bewegungen macht ihr? Wer zählt beim Ziehen? Notiert euch hier eure Regieideen..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* FINISH THEATER & SEARCH FOR PARTNER 2ER-GROUP */}
              {!student.groupCompleted && (
                <div className="pt-2 text-center">
                  <button
                    onClick={handleFinishTheaterWork}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/25 text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Theaterstück fertig geprobt – Abschließen & Partnergruppe suchen!</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: WAITING FOR ANOTHER 2ER-GROUP OR 4ER-GROUP PRESENTATION */}
          {student.groupCompleted && (
            <div className="space-y-6">
              
              {isWaitingForOtherTeam ? (
                /* WAITING BOX: NO OTHER 2ER-GROUP READY YET */
                <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-7 h-7 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-amber-200">
                      Super gemacht! Euer 2er-Team ist bereit! ⏳
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                      Aktuell hat noch keine andere 2er-Gruppe Aufgabe 4 abgeschlossen. 
                      Bitte geduldet euch noch einen kurzen Moment, während die anderen Gruppen ihr Theaterstück proben.
                    </p>
                  </div>

                  {/* Activity suggestion */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/20 text-left text-xs space-y-2 max-w-md mx-auto">
                    <span className="font-bold text-amber-300 block">📚 Was ihr jetzt tun könnt:</span>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      <li>Probt euer Theaterstück noch 1–2 Mal leise durch.</li>
                      <li>Lest leise in den Sachbüchern oder forscht auf OneNote weiter.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleCheckForOtherGroup}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Erneut prüfen, ob eine Gruppe bereit ist 🔄</span>
                    </button>
                  </div>
                </div>
              ) : hasAssignedGroup ? (
                /* 4ER-GROUP PRESENTATION & MUTUAL FEEDBACK PHASE */
                <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-1.5">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>Gemeinsame 4er-Gruppe</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-amber-200">
                        Theater-Vorspiel & Gegenseitiges Feedback
                      </h3>
                    </div>
                    <div className="text-xs bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                      Euer Team: <strong className="text-amber-300">{student.groupPartner1} & {student.groupPartner2}</strong>
                    </div>
                  </div>

                  {/* Assigned Partner Group Card */}
                  <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-5 text-center space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Euch zugeordnete Partner-Gruppe:
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center font-display font-bold text-xl shadow-lg">
                        🎭
                      </div>
                      <div className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
                        {student.assignedPresentationGroup?.partner1} & {student.assignedPresentationGroup?.partner2}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                      Sucht jetzt <strong className="text-amber-300">{student.assignedPresentationGroup?.partner1}</strong> und <strong className="text-amber-300">{student.assignedPresentationGroup?.partner2}</strong> im Klassenzimmer! 
                      Setzt euch zu viert an einen Gruppentisch zusammen und führt euch eure Stücke gegenseitig vor!
                    </p>
                  </div>

                  {/* The 4-step workflow */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">1</span>
                      <h4 className="font-bold text-amber-300 text-xs sm:text-sm">Runde 1: Theaterstück vorspielen</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Das erste 2er-Team spielt sein Theaterstück mit Requisiten und verteilten Rollen vor. Das zweite Team schaut aufmerksam zu und achtet auf die Pflicht-Schlagwörter!
                      </p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">2</span>
                      <h4 className="font-bold text-amber-300 text-xs sm:text-sm">Runde 2: Feedback & Rollenwechsel</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Gebt der Partnergruppe Feedback im unteren Formular. Danach wechselt ihr und das andere Team führt sein Stück vor!
                      </p>
                    </div>
                  </div>

                  {/* Interactive Feedback Form */}
                  <div className="bg-slate-950/90 border border-purple-500/40 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <h4 className="font-display font-bold text-sm sm:text-base text-purple-200">
                        Feedback für {student.assignedPresentationGroup?.partner1} & {student.assignedPresentationGroup?.partner2}
                      </h4>
                    </div>

                    {!feedbackSubmitted ? (
                      <form onSubmit={handleSubmitFeedback} className="space-y-4">
                        {/* Rating stars */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">
                            Wie fandet ihr das Theaterstück insgesamt?
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackRating(star)}
                                className="p-1 hover:scale-125 transition-transform"
                              >
                                <Star className={`w-6 h-6 ${star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                              </button>
                            ))}
                            <span className="text-xs text-amber-300 font-bold ml-2">
                              {feedbackRating === 5 ? '🌟 Überragend!' : feedbackRating >= 4 ? '👍 Sehr gut gespielt!' : '🙂 Gut gemacht!'}
                            </span>
                          </div>
                        </div>

                        {/* Praise */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Was hat euch besonders gut gefallen? (Lob):
                          </label>
                          <input
                            type="text"
                            value={feedbackPraise}
                            onChange={(e) => setFeedbackPraise(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        {/* Tip */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Ein kleiner Tipp für das nächste Mal:
                          </label>
                          <input
                            type="text"
                            value={feedbackTip}
                            onChange={(e) => setFeedbackTip(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
                        >
                          Feedback speichern & bestätigen ✓
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs space-y-1 text-emerald-300">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Euer Feedback für {student.assignedPresentationGroup?.partner1} & {student.assignedPresentationGroup?.partner2} wurde gespeichert!</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">
                          Bewertung: {feedbackRating} / 5 Sterne • Lob: „{feedbackPraise}“
                        </p>
                      </div>
                    )}
                  </div>

                  {/* STEP 4: TEACHER CODE (NO CHEOPS LEAK) */}
                  <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-display font-bold text-amber-200">
                          Abschluss: Lehrperson aufsuchen & Freischaltcode holen
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          Sobald beide 2er-Teams ihr Theaterstück zu viert aufgeführt und Feedback ausgetauscht haben, geht ihr <strong>gemeinsam zu viert zur Lehrperson (Herr Pfeifer & Frau Escher)</strong>. 
                          Sie prüfen euer Feedback und geben euch den geheimen Freischaltcode für eure Urkunde!
                        </p>
                      </div>
                    </div>

                    {student.groupCheopsUnlocked ? (
                      <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 text-emerald-300 text-xs sm:text-sm font-bold">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          <span>Freischaltcode erfolgreich bestätigt! Station 5 (Schatzkammer & Urkunde) ist freigeschaltet!</span>
                        </div>
                        <button
                          onClick={() => setCurrentStation('belohnungen')}
                          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-lg text-xs flex items-center justify-center gap-2 transition-all hover:scale-105"
                        >
                          <span>Zur Schatzkammer & Urkunde</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyTeacherCode} className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="text"
                            value={codeTeacherInput}
                            onChange={(e) => {
                              setCodeTeacherInput(e.target.value);
                              setCodeError(false);
                            }}
                            placeholder="Geheimcode der Lehrperson eingeben..."
                            className={`flex-1 bg-slate-900 border rounded-xl px-4 py-2.5 text-sm text-white uppercase tracking-wider font-mono focus:outline-none ${
                              codeError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-purple-500/40 focus:border-amber-400'
                            }`}
                          />
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all shrink-0"
                          >
                            Station 5 freischalten
                          </button>
                        </div>
                        {codeError && (
                          <p className="text-xs text-rose-400 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Ungültiger Freischaltcode. Bitte führt zuerst euer Theater zu viert vor und fragt dann die Lehrperson nach dem Code.</span>
                          </p>
                        )}
                      </form>
                    )}
                  </div>

                </div>
              ) : null}

            </div>
          )}

          {/* POST-COMPLETION ACTIVITIES (BOOKS & ONENOTE) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>📚 Was könnt ihr tun, wenn ihr fertig seid?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sobald eure 2er- bzw. 4er-Gruppe mit der Theater-Präsentation und der Urkunde fertig ist:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">1. In den Sachbüchern lesen:</strong>
                  <span className="text-slate-400 text-[11px]">Geht leise nach hinten und schmökert in den Ägypten-Büchern im Klassenzimmer.</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                <Laptop className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">2. Auf OneNote weiterarbeiten:</strong>
                  <span className="text-slate-400 text-[11px]">Öffnet euer OneNote-Notizbuch und bearbeitet eure weiteren Aufgaben oder Vertiefungen.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
