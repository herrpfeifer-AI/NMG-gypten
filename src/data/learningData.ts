import { VideoChapter, ClozeItem, TextModuleQuestion, QuizQuestion, Badge, StudentProgress } from '../types';

export const VIDEO_DEFAULT_ID = "L9jJ_EwuaE4"; // Woozle Goozle Altes Ägypten
export const YOUTUBE_FALLBACK_URL = "https://www.youtube.com/watch?v=L9jJ_EwuaE4";

export const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'chap-1',
    title: '1. Reich & Schrift',
    timeSeconds: 150, // 02:30
    timeFormatted: '02:30 min',
    description: 'Lage am Nil vor 6.000 Jahren, allmächtige Pharaonen, Hieroglyphen & der Stein von Rosette (1799).',
    iconName: 'Scroll'
  },
  {
    id: 'chap-2',
    title: '2. Alltag, Nahrung & Gesellschaft',
    timeSeconds: 370, // 06:10
    timeFormatted: '06:10 min',
    description: 'Siedlungen (Amarna), weiße Häuser gegen Hitze, Schulbildung für Reiche, Fladenbrot, Feigen & Datteln.',
    iconName: 'Home'
  },
  {
    id: 'chap-3',
    title: '3. Pyramidenbau & Glaubenswelt',
    timeSeconds: 600, // 10:00
    timeFormatted: '10:00 min',
    description: 'Cheops-Pyramide (140m, 2,6 Mio. Blöcke), Weiterleben im Jenseits, Holzschlitten & Nilkanäle (Papyrus 2017).',
    iconName: 'Pyramid'
  },
  {
    id: 'chap-4',
    title: '4. Pharaonen, Mumifizierung & Grabfunde',
    timeSeconds: 820, // 13:40
    timeFormatted: '13:40 min',
    description: 'Pharaonin Hatschepsut, Tal der Könige, Howard Carter & Tutanchamun (1922) sowie der Mumifizierungsprozess.',
    iconName: 'Sparkles'
  },
  {
    id: 'chap-5',
    title: '5. Erfindungen der Ägypter',
    timeSeconds: 1120, // 18:40
    timeFormatted: '18:40 min',
    description: 'Kalender mit 3 Jahreszeiten (Achet, Peret, Shemu), Papyrus, Glasbehälter, Spiegel & Pfefferminzpastillen.',
    iconName: 'Lightbulb'
  }
];

export const CLOZE_STORIES: ClozeItem[] = [
  {
    id: 'cloze-schrifttum',
    title: '📜 Rätsel 1: Das Geheimnis der Schrift',
    intro: 'Setze die passenden Textbausteine in die Lücken ein, um die Entzifferung der Hieroglyphen zu erklären!',
    textTemplate: 'Vor über 6.000 Jahren entstand am {gap_1} das Reich der Pharaonen. Die Ägypter schrieben mit geheimnisvollen Zeichen, den {gap_2}. Jahrhundertelang konnte niemand diese Schrift lesen. Die Rettung brachte der berühmte {gap_3}, der im Jahr {gap_4} gefunden wurde. Da derselbe Text auch in {gap_5} eingemeißelt war, konnten Sprachforscher den Code endlich knacken!',
    // Thoroughly scrambled order so students have to read and sort them
    availableWords: ['1799', 'Stein von Rosette', 'Altgriechisch', 'Hieroglyphen', 'Nil'],
    gaps: {
      gap_1: 'Nil',
      gap_2: 'Hieroglyphen',
      gap_3: 'Stein von Rosette',
      gap_4: '1799',
      gap_5: 'Altgriechisch'
    }
  },
  {
    id: 'cloze-pyramidenbau',
    title: '📐 Rätsel 2: Der unglaubliche Pyramidenbau',
    intro: 'Wie bauten die Ägypter die gigantische Cheops-Pyramide? Baue den Text mit den Bausteinen zusammen!',
    textTemplate: 'Die Cheops-Pyramide ragte einst stolze {gap_1} Meter in den Himmel und besteht aus rund 2,6 Millionen Steinblöcken. Ein einzelner Stein wog im Durchschnitt {gap_2}. Ein Papyrus-Fund aus dem Jahr {gap_3} verriet, dass die Steine über künstliche {gap_4} transportiert wurden. An Land zogen Arbeiter die Lasten mit reiner Muskelkraft auf {gap_5} über feuchte Sandrampen.',
    // Thoroughly scrambled order so students have to read and sort them
    availableWords: ['Holzschlitten', '2017', 'Nilkanäle', '2,5 Tonnen', '140'],
    gaps: {
      gap_1: '140',
      gap_2: '2,5 Tonnen',
      gap_3: '2017',
      gap_4: 'Nilkanäle',
      gap_5: 'Holzschlitten'
    }
  },
  {
    id: 'cloze-mumien',
    title: '🏺 Rätsel 3: Das Reich der Toten & Mumien',
    intro: 'Warum wurden Pharaonen einbalsamiert? Setze die Textbausteine richtig ein!',
    textTemplate: 'Die Ägypter glaubten fest an ein {gap_1} nach dem Tod. Damit die Seele ihren Körper wiedererkennen konnte, wurde er aufwendig konserviert. Bei der Mumifizierung wurden die {gap_2} entnommen, damit der Leichnam nicht verwest. Berühmt wurde das fast ungeplünderte Grab von {gap_3}, das 1922 von {gap_4} entdeckt wurde. Es enthielt eine weltberühmte Maske aus purem {gap_5}.',
    // Thoroughly scrambled order so students have to read and sort them
    availableWords: ['Howard Carter', 'Gold', 'inneren Organe', 'Tutanchamun', 'Weiterleben'],
    gaps: {
      gap_1: 'Weiterleben',
      gap_2: 'inneren Organe',
      gap_3: 'Tutanchamun',
      gap_4: 'Howard Carter',
      gap_5: 'Gold'
    }
  }
];

export const TEXT_QUESTIONS: TextModuleQuestion[] = [
  {
    id: 1,
    title: '1. Der Sprachschlüssel',
    category: 'Schrift & Entdeckung',
    question: 'Warum war der Fund des Steins von Rosette im Jahr 1799 so ein riesiges Glück für die Sprachforscher?',
    tip: 'Achte auf die Sprachen, die auf dem Stein eingemeißelt waren!',
    suggestedBlocks: [
      'das die Forscher bereits lesen konnten',
      'Der Stein von Rosette',
      'darunter auch Altgriechisch',
      'Dadurch gelang der Vergleich',
      'enthielt denselben Text in drei Schriften',
      'und die Entzifferung der Hieroglyphen'
    ],
    sampleSolution: 'Der Stein von Rosette enthielt denselben Erlass in drei verschiedenen Schriften, darunter auch Altgriechisch. Da Sprachforscher Altgriechisch bereits beherrschten, konnten sie den Text vergleichen und so die Hieroglyphen nach Jahrhunderten endlich entschlüsseln.'
  },
  {
    id: 2,
    title: '2. Klimaanlage der Antike',
    category: 'Alltag & Architektur',
    question: 'Warum strichen die alten Ägypter ihre Häuser weiß an?',
    tip: 'Denke an die heiße Wüstensonne und helle Farben!',
    suggestedBlocks: [
      'und verhindert ein starkes Aufheizen',
      'Es funktionierte wie eine natürliche Klimaanlage',
      'der Wohnräume bei extremer Wüstenhitze',
      'Die weiße Farbe reflektiert das Sonnenlicht'
    ],
    sampleSolution: 'Die weiße Farbe wirkte als antike Klimaanlage: Weiß reflektiert die sengenden Sonnenstrahlen der ägyptischen Wüste, sodass die Innenräume der Häuser deutlich kühler blieben.'
  },
  {
    id: 3,
    title: '3. Schule damals',
    category: 'Gesellschaft & Bildung',
    question: 'Wer durfte im alten Ägypten zur Schule gehen und wie sah der Alltag der anderen Kinder aus?',
    tip: 'Nicht jedes Kind hatte die gleichen Rechte...',
    suggestedBlocks: [
      'oder auf den Feldern der Eltern schuften',
      'vor allem Jungen der Oberschicht',
      'Ärmere Kinder mussten früh arbeiten',
      'durften lesen, schreiben und rechnen lernen',
      'im Handwerk mithelfen',
      'Nur Kinder aus reichen Familien'
    ],
    sampleSolution: 'Nur Kinder aus wohlhabenden, einflussreichen Familien durften eine Schule besuchen, um Schreiber oder Priester zu werden. Kinder ärmerer Familien mussten von klein auf im Handwerk, im Haushalt oder auf den Feldern am Nil mithelfen.'
  },
  {
    id: 4,
    title: '4. Ernährung in der Wüste',
    category: 'Essen & Natur',
    question: 'Warum waren Früchte wie Feigen und Datteln besonders beliebte Lebensmittel in dieser heißen Region?',
    tip: 'Was passiert mit Feigen und Datteln an der Sonne?',
    suggestedBlocks: [
      'und wuchsen gut an den Nil-Oasen',
      'können leicht getrocknet werden',
      'bleiben in der Hitze lange haltbar',
      'Sie lieferten schnelle Energie und Fruchtzucker'
    ],
    sampleSolution: 'Feigen und Datteln lieferten viel süße Energie und wertvolle Nährstoffe. Zudem ließen sie sich hervorragend in der Sonne trocknen und blieben so über Monate hinweg auch in heißem Klima genießbar, ohne zu verderben.'
  },
  {
    id: 5,
    title: '5. Die Logistik des Pyramidenbaus',
    category: 'Technik & Forschung',
    question: 'Welcher Fund im Jahr 2017 hat Forschern geholfen zu verstehen, wie die 2,5 Tonnen schweren Steinblöcke überhaupt zur Baustelle transportiert wurden?',
    tip: 'Ein Tagebuch aus Schilfpapier!',
    suggestedBlocks: [
      'mit großen Holzbooten direkt bis an die Pyramidenbaustelle',
      'das Logbuch/Tagebuch eines Aufsehers namens Merer',
      'beschrieb den Transport über künstlich umgeleitete Nilkanäle',
      'Ein Papyrus-Fund aus dem Jahr 2017'
    ],
    sampleSolution: 'Im Jahr 2017 entdeckte man ein antikes Papyrus-Tagebuch eines Baustellen-Aufsehers (Merer). Darin war detailliert beschrieben, wie Arbeiter die schweren Steinblöcke auf Schiffen über speziell gegrabene Nilkanäle direkt an den Fuß der Pyramide brachten.'
  },
  {
    id: 6,
    title: '6. Schätze im Tal der Könige',
    category: 'Grabfunde & Archäologie',
    question: 'Warum war die Entdeckung des Grabs von Tutanchamun durch Howard Carter im Jahr 1922 so eine weltweite Sensation im Vergleich zu den meisten anderen Gräbern?',
    tip: 'Was war mit den meisten anderen Gräbern über Jahrtausende passiert?',
    suggestedBlocks: [
      'von Grabräubern leergeräumt worden',
      'mit tausenden Goldschätzen, Streitwagen',
      'Fast alle Königsgräber waren längst geplündert',
      'und der berühmten goldenen Totenmaske',
      'Tutanchamuns Grab war jedoch nahezu unberührt'
    ],
    sampleSolution: 'Nahezu alle Gräber im Tal der Könige wurden bereits in der Antike von Grabräubern ausgeraubt. Tutanchamuns Grab war jedoch fast 3.300 Jahre unentdeckt und ungeplündert geblieben, vollgepackt mit unermesslichen Kunstschätzen und der goldenen Totenmaske.'
  },
  {
    id: 7,
    title: '7. Warum der Mumien-Aufwand?',
    category: 'Religion & Glaube',
    question: 'Aus welchem religiösen Grund betrieben die Ägypter den enormen Aufwand, Körper nach dem Tod einzubalsamieren und zu umwickeln?',
    tip: 'Was glaubten sie über das Leben nach dem Tod?',
    suggestedBlocks: [
      'Ohne Konservierung würde der Körper verwesen',
      'Die Seele (Ba und Ka) brauchte einen unversehrten Körper',
      'um im Totenreich weiterzuexistieren',
      'Die Ägypter glaubten an ein Weiterleben im Jenseits',
      'und die Seele heimatlos werden'
    ],
    sampleSolution: 'Die Ägypter glaubten fest an die Unsterblichkeit der Seele im Jenseits. Damit die Seele nach dem Tod ihren Körper wiedererkennen und eine ewige Wohnung haben konnte, musste dieser vor dem Verwesen geschützt und mumifiziert werden.'
  },
  {
    id: 8,
    title: '8. Die drei Jahreszeiten',
    category: 'Kalender & Nil',
    question: 'Der ägyptische Kalender hatte 12 Monate, aber nur 3 Jahreszeiten. Wodurch wurden diese drei Abschnitte bestimmt?',
    tip: 'Der Nil war der Lebensnerv Ägyptens...',
    suggestedBlocks: [
      'und Shemu (Erntezeit und große Sommerhitze)',
      'Achet (Überschwemmung)',
      'Der Lebensrhythmus wurde vom Nil bestimmt',
      'Peret (Aussaat auf fruchtbarem Schlamm)',
      'Sie richteten sich komplett nach dem Wasserstand'
    ],
    sampleSolution: 'Die drei Jahreszeiten wurden ausschließlich durch den natürlichen Rhythmus des Nils und der Landwirtschaft bestimmt: Achet (die Nilüberschwemmung, die fruchtbaren Schlamm brachte), Peret (die Saatzeit und das Pflanzenwachstum) und Shemu (die Erntezeit und Trockenperiode).'
  }
];


export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Wie gelang es den Forschern, die ägyptischen Hieroglyphen zu entziffern?',
    options: [
      { key: 'A', text: 'Sie fanden ein zweisprachiges Wörterbuch aus Papyrus.' },
      { key: 'B', text: 'Der Stein von Rosette enthielt denselben Text auch auf Altgriechisch.' },
      { key: 'C', text: 'Woozle hat eine Übersetzungsmaschine gebaut.' },
      { key: 'D', text: 'Pharao Tutanchamun hatte die Bedeutung aufgeschrieben.' }
    ],
    correctAnswer: 'B',
    explanation: 'Der 1799 gefundene Stein von Rosette trug denselben Text in drei Schriften. Da die Gelehrten Altgriechisch beherrschten, konnten sie die Hieroglyphen Buchstabe für Buchstabe entschlüsseln!',
    woozleFact: 'Woozle meinte zwar, sein "Hieroglyphen-Toaster 3000" könne das auch, aber Sprachforscher Champollion brauchte dafür jahrelange Detektivarbeit!',
    hint: 'Tipp: Suche nach dem Fund aus dem Jahr 1799, der denselben Text in drei verschiedenen Sprachen eingemeißelt hatte!'
  },
  {
    id: 2,
    question: 'Was war das absolute Grundnahrungsmittel im alten Ägypten?',
    options: [
      { key: 'A', text: 'Kartoffeln' },
      { key: 'B', text: 'Reis' },
      { key: 'C', text: 'Brot bzw. Fladenbrot' },
      { key: 'D', text: 'Maiskolben' }
    ],
    correctAnswer: 'C',
    explanation: 'Die alten Ägypter wurden von Nachbarvölkern sogar oft „Brotesser“ genannt, weil Fladenbrot die Hauptnahrung für Arm und Reich war.',
    woozleFact: 'Kartoffeln und Mais kannten die alten Ägypter noch gar nicht – die wuchsen damals nur in Amerika!',
    hint: 'Tipp: Es wurde aus Getreide gebacken. Die Ägypter wurden von Nachbarvölkern sogar oft „...-esser“ genannt!'
  },
  {
    id: 3,
    question: 'Wie schwer war ein durchschnittlicher Steinblock der Cheops-Pyramide?',
    options: [
      { key: 'A', text: 'Ungefähr 250 kg' },
      { key: 'B', text: 'Etwa 2,5 Tonnen' },
      { key: 'C', text: 'Rund 10 Tonnen' },
      { key: 'D', text: '50 Tonnen' }
    ],
    correctAnswer: 'B',
    explanation: 'Ein Block wog im Schnitt 2,5 Tonnen – das ist so schwer wie ein großes Nashorn oder zwei moderne Autos zusammen!',
    woozleFact: 'Die gesamte Pyramide besteht aus etwa 2,6 Millionen dieser Riesenblöcke. Unglaubliche Baukunst ohne Motoren!',
    hint: 'Tipp: Ein Block wog so schwer wie ein ausgewachsenes Nashorn oder zwei Autos zusammen (in Tonnen)!'
  },
  {
    id: 4,
    question: 'Was passierte bei der Mumifizierung mit den inneren Organen (wie Magen und Leber)?',
    options: [
      { key: 'A', text: 'Sie wurden im Körper belassen und tiefgefroren.' },
      { key: 'B', text: 'Sie wurden entnommen, damit der Körper nicht verwest.' },
      { key: 'C', text: 'Sie wurden getrocknet und dem Toten in die Hand gegeben.' },
      { key: 'D', text: 'Sie wurden verbrannt und ins Meer geworfen.' }
    ],
    correctAnswer: 'B',
    explanation: 'Weil innere Organe viel Feuchtigkeit enthalten und schnell faulen, wurden sie vorsichtig entnommen, separat balsamiert und in Krügen (Kanopen) aufbewahrt.',
    woozleFact: 'Nur das Herz ließen die Ägypter oft im Körper, weil sie glaubten, dass darin der Verstand und die Gefühle wohnen!',
    hint: 'Tipp: Organe sind feucht und verwesen sehr schnell. Sie durften daher nicht im Körper bleiben!'
  },
  {
    id: 5,
    question: 'Welche Jahreszeit stand im ägyptischen Kalender für die Überschwemmung des Nils?',
    options: [
      { key: 'A', text: 'Shemu' },
      { key: 'B', text: 'Peret' },
      { key: 'C', text: 'Achet' },
      { key: 'D', text: 'Amarna' }
    ],
    correctAnswer: 'C',
    explanation: '„Achet“ war die Jahreszeit der Nilflut. Der Fluss überflutete die Felder und hinterließ den fruchtbaren schwarzen Schlamm.',
    woozleFact: 'Ohne die Achet-Überschwemmung wäre Ägypten nur eine trockene Wüste geblieben. Deshalb nannten sie Ägypten das „Geschenk des Nils“.',
    hint: 'Tipp: Der Name dieser Jahreszeit beginnt mit dem Buchstaben „A“ und stand für die große Nilflut!'
  },
  {
    id: 6,
    question: 'Woraus stellten die alten Ägypter ihre Spiegel her?',
    options: [
      { key: 'A', text: 'Aus poliertem Metall' },
      { key: 'B', text: 'Aus geschliffenem Glas' },
      { key: 'C', text: 'Aus klarem Nilwasser in Schalen' },
      { key: 'D', text: 'Aus Silberfolie' }
    ],
    correctAnswer: 'A',
    explanation: 'Glasspiegel gab es damals noch nicht. Die Ägypter polierten Metallscheiben aus Kupfer oder Bronze so lange, bis man sein Gesicht darin spiegeln konnte!',
    woozleFact: 'Woozle hat versucht, sich in einem Stück Schokolade zu spiegeln – funktionierte leider nicht ganz so glänzend wie Bronze!',
    hint: 'Tipp: Glasspiegel gab es damals noch nicht. Welches glänzende Material (wie Bronze oder Kupfer) wurde blank poliert?'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge-video',
    title: 'Amulett des Sonnengottes Re',
    description: 'Das 22-minütige Abenteuer-Video von Woozle und Marc aufmerksam studiert.',
    icon: 'Sun',
    station: 'video',
    color: 'from-amber-400 to-yellow-600',
    unlockedAtStep: 'Station 1 abgeschlossen'
  },
  {
    id: 'badge-text',
    title: 'Heilige Papyrusrolle des Schreibers',
    description: 'Die Lückentexte und Beobachtungsfragen mit Textbausteinen erfolgreich gelöst.',
    icon: 'Scroll',
    station: 'textbausteine',
    color: 'from-emerald-400 to-teal-700',
    unlockedAtStep: 'Station 2 abgeschlossen'
  },
  {
    id: 'badge-quiz',
    title: 'Goldener Skarabäus der Weisheit',
    description: 'Das Ägypten-Quiz mit Scharfsinn und Bravour gemeistert.',
    icon: 'Bug',
    station: 'quiz',
    color: 'from-cyan-400 to-blue-600',
    unlockedAtStep: 'Station 3 abgeschlossen'
  },
  {
    id: 'badge-group',
    title: 'Goldene Totenmaske des Tutanchamun',
    description: 'Im 2er-Tandem als Forscher-Detektiv oder Kreativ-Baumeister geglänzt.',
    icon: 'Crown',
    station: 'gruppenarbeit',
    color: 'from-purple-400 to-indigo-700',
    unlockedAtStep: 'Station 4 abgeschlossen'
  },
  {
    id: 'badge-master',
    title: 'Großer Pharaonen-Meisterorden',
    description: 'Alle Einheiten der Ägypten-Expedition fehlerfrei absolviert!',
    icon: 'Award',
    station: 'belohnungen',
    color: 'from-amber-300 via-yellow-500 to-amber-700',
    unlockedAtStep: 'Alle Einheiten gemeistert'
  }
];

export interface TheaterTopicDefinition {
  id: 'transport' | 'grab';
  title: string;
  badge: string;
  shortDesc: string;
  role1: {
    title: string;
    roleName: string;
    description: string;
    typicalQuote: string;
  };
  role2: {
    title: string;
    roleName: string;
    description: string;
    typicalQuote: string;
  };
  sceneGuide: string;
  dialogueExample: { speaker: string; text: string }[];
  keywords: string[];
}

export const THEATER_TOPICS: TheaterTopicDefinition[] = [
  {
    id: 'transport',
    title: 'Thema 1: Transport & Baustelle der Pyramide',
    badge: 'Pyramidenbau & Nil-Logistik',
    shortDesc: 'Spielt nach, wie ein riesiger 2,5-Tonnen-Kalksteinblock vom Steinbruch über den Nil zur Baustelle der Cheops-Pyramide geschafft wird!',
    role1: {
      title: 'Partner 1: Der königliche Bau-Aufseher (oder Schiffskapitän)',
      roleName: 'Aufseher',
      description: 'Du hast den Bauplan der Pyramide, treibst die Arbeiter an, steuerst den Lastkahn durch den Nil-Kanal und gibst die Kommandos beim Entladen.',
      typicalQuote: '„Beeilt euch! Pharao Cheops erwartet, dass dieser 2,5-Tonnen-Block noch vor Sonnenuntergang auf der Rampe liegt! Gießt mehr Nilschlamm unter die Kufen!“'
    },
    role2: {
      title: 'Partner 2: Der Arbeiter / Steinmetz am Holzschlitten',
      roleName: 'Arbeiter',
      description: 'Du ziehst mit Seilen am schweren Holzschlitten, schwitzt in der Hitze, schmierst die Kufen mit Nilschlamm und schiebst den Block mit ganzer Kraft.',
      typicalQuote: '„Puh, dieser Kalkstein wiegt 2,5 Tonnen! Wenn wir den Nilschlamm nicht vor den Schlitten gießen, bewegt sich das Holz keinen Zentimeter im Wüstensand! 1, 2, 3 – ZIEHT!“'
    },
    sceneGuide: 'Das Theater beginnt, als der Lastkahn am künstlich gegrabenen Nil-Kanal direkt am Fuß der Cheops-Pyramide anlegt. Ihr besprecht lautstark, wie der 2,5 Tonnen schwere Stein auf den Holzschlitten geladen wird, nutzt Rundhölzer und Schmiere (Nilschlamm/Wasser) und zieht den Stein gemeinsam unter lautem Zählen über die Rampe!',
    dialogueExample: [
      { speaker: 'Aufseher', text: 'Halt! Leinen festmachen! Der Lastkahn hat den künstlichen Nil-Kanal pünktlich passiert. Hier ist der nächste Stein für die Grabkammer!' },
      { speaker: 'Arbeiter', text: 'Endlich! Aber der Block wiegt mindestens 2,5 Tonnen. Wir brauchen den großen Holzschlitten und starke Seile!' },
      { speaker: 'Aufseher', text: 'Los, nicht trödeln! Pharao Cheops lässt die Baustelle heute persönlich inspizieren!' },
      { speaker: 'Arbeiter', text: 'Schnell, schüttet Nilschlamm vor die Holzkufen, damit der Sand nicht bremst! Und jetzt: 1, 2, 3 – ZIEHEN!' }
    ],
    keywords: [
      '2,5 Tonnen Kalkstein',
      'Nil-Kanal & Lastkahn',
      'Holzschlitten & Rundhölzer',
      'Nilschlamm zur Schmierung',
      'Pharao Cheops'
    ]
  },
  {
    id: 'grab',
    title: 'Thema 2: Grabbeigaben & Tal der Könige',
    badge: 'Geheimnis der Felsengräber',
    shortDesc: 'Spielt nach, wie im Tal der Könige ein Felsengrab vor Grabräubern geschützt und die Mumie mit Schätzen für das Weiterleben im Jenseits vorbereitet wird!',
    role1: {
      title: 'Partner 1: Der Einbalsamierer-Priester des Anubis',
      roleName: 'Priester',
      description: 'Du bist der heilige Priester. Du passt auf die Kanopenkrüge mit den Organen auf, umwickelst die Mumie mit Leinenbinden und legst ihr die goldene Totenmaske an.',
      typicalQuote: '„Behandelt die Kanopenkrüge mit Ehrfurcht! Darin ruhen die getrockneten Organe – ohne sie kann die Seele im Jenseits nicht weiterleben!“'
    },
    role2: {
      title: 'Partner 2: Der königliche Schatzmeister / Wächter',
      roleName: 'Schatzmeister',
      description: 'Du versteckst die unermesslichen Goldschätze im Felsengrab tief im Tal der Könige und sicherst den Eingang mit Fallen und Steinen vor gierigen Grabräubern.',
      typicalQuote: '„Wir mussten weg von den Pyramiden! Nur hier im geheimen Tal der Könige sind die goldenen Grabbeigaben vor den frechen Grabräubern sicher! Verschließt den Eingang!“'
    },
    sceneGuide: 'Das Theater spielt im Halbdunkel eines neu geschlagenen Felsengrabes im Tal der Könige. Ihr tragt die goldenen Schätze, Möbel und die Kanopenkrüge hinein. Der Priester erklärt das Jenseits, während der Schatzmeister nervös nach Grabräubern Ausschau hält und die Totenmaske feierlich übergibt.',
    dialogueExample: [
      { speaker: 'Schatzmeister', text: 'Pst, leise! Niemand durfte uns hierher ins Tal der Könige folgen. Fast alle alten Pyramiden wurden ja von Grabräubern geplündert!' },
      { speaker: 'Priester', text: 'Ja, hier in den Felsen ist der Pharao sicher. Reiche mir die vier Kanopenkrüge mit den Organen – sie sind lebensnotwendig für sein Weiterleben im Jenseits.' },
      { speaker: 'Schatzmeister', text: 'Hier sind sie. Und hier ist die funkelnde, goldene Totenmaske zusammen mit Gold, Streitwagen und Speisen als Grabbeigaben.' },
      { speaker: 'Priester', text: 'Möge der Gott Osiris ihn beschützen! Nun lasst uns das Siegel anbringen und den Eingang mit Steinen tarnen, damit kein Grabräuber jemals diesen Schatz findet!' }
    ],
    keywords: [
      'Tal der Könige (Felsengrab)',
      'Schutz vor Grabräubern',
      'Jenseits & Weiterleben',
      'Kanopenkrüge für die Organe',
      'Goldene Totenmaske & Grabbeigaben'
    ]
  }
];

// Initial class roster with the 20 official students
export const OFFICIAL_CLASS_NAMES = [
  'Carla', 'Matej', 'Sofia', 'Omar', 'Angelica',
  'Ilian', 'Shukrie', 'Monika', 'Annabelle', 'Adam',
  'Brittany', 'Amelia', 'Melisa', 'Sophia', 'Viola',
  'Luca', 'Louis', 'Marin', 'Derin', 'Amira'
];

export const CLASS_5B_NAME = 'Klasse 5b (Herr Pfeifer & Frau Escher)';

export const createFreshClassStudents = (): StudentProgress[] => {
  return OFFICIAL_CLASS_NAMES.map((name, idx): StudentProgress => ({
    id: `stud-${idx + 1}`,
    name,
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
  }));
};

export const DEMO_STUDENTS: StudentProgress[] = OFFICIAL_CLASS_NAMES.map((name, idx): StudentProgress => {
  // Give some students realistic sample progress so the teacher has an active class dashboard if demo data is loaded
  if (name === 'Carla') {
    return {
      id: `stud-${idx + 1}`,
      name: 'Carla',
      schoolClass: CLASS_5B_NAME,
      currentStation: 'belohnungen',
      videoWatched: true,
      videoNotes: 'Besonders spannend: Wie die Steine über Kanäle geschifft wurden.',
      clozeAnswers: {
        'cloze-schrifttum_gap_1': 'Nil', 'cloze-schrifttum_gap_2': 'Hieroglyphen', 'cloze-schrifttum_gap_3': 'Stein von Rosette', 'cloze-schrifttum_gap_4': '1799', 'cloze-schrifttum_gap_5': 'Altgriechisch',
        'cloze-pyramidenbau_gap_1': '140', 'cloze-pyramidenbau_gap_2': '2,5 Tonnen', 'cloze-pyramidenbau_gap_3': '2017', 'cloze-pyramidenbau_gap_4': 'Nilkanäle', 'cloze-pyramidenbau_gap_5': 'Holzschlitten',
        'cloze-mumien_gap_1': 'Weiterleben', 'cloze-mumien_gap_2': 'inneren Organe', 'cloze-mumien_gap_3': 'Tutanchamun', 'cloze-mumien_gap_4': 'Howard Carter', 'cloze-mumien_gap_5': 'Gold'
      },
      clozeCompleted: true,
      textAnswers: {
        1: 'Der Stein von Rosette enthielt denselben Text auch auf Altgriechisch. So konnten Forscher Hieroglyphen endlich übersetzen.',
        2: 'Weiß wirft die Sonnenstrahlen zurück, damit es drinnen schön kühl bleibt.'
      },
      textCompleted: true,
      quizAnswers: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C', 6: 'A' },
      quizAttempts: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
      quizErrorsCount: 0,
      quizCompleted: true,
      quizScore: 6,
      groupPartner1: 'Carla',
      groupPartner2: 'Matej',
      groupTaskChoice: 'erfindungen',
      groupNotes: {
        erfindungenSelected: ['Papyrus', 'Kalender mit 3 Jahreszeiten', 'Pfefferminzbonbons'],
        erfindungenFavorite: 'Papyrus',
        erfindungenReason: 'Weil Wissen ohne Papier kaum weitergegeben werden konnte.'
      },
      groupCompleted: true,
      badges: ['badge-video', 'badge-text', 'badge-quiz', 'badge-group', 'badge-master'],
      lastUpdated: 'vor 3 Minuten'
    };
  }

  if (name === 'Matej') {
    return {
      id: `stud-${idx + 1}`,
      name: 'Matej',
      schoolClass: CLASS_5B_NAME,
      currentStation: 'belohnungen',
      videoWatched: true,
      videoNotes: 'Pyramidenbau war Teamarbeit!',
      clozeAnswers: {},
      clozeCompleted: true,
      textAnswers: {},
      textCompleted: true,
      quizAnswers: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C', 6: 'A' },
      quizAttempts: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
      quizErrorsCount: 0,
      quizCompleted: true,
      quizScore: 6,
      groupPartner1: 'Carla',
      groupPartner2: 'Matej',
      groupTaskChoice: 'erfindungen',
      groupNotes: {},
      groupCompleted: true,
      badges: ['badge-video', 'badge-text', 'badge-quiz', 'badge-group', 'badge-master'],
      lastUpdated: 'vor 5 Minuten'
    };
  }

  if (name === 'Sofia') {
    return {
      id: `stud-${idx + 1}`,
      name: 'Sofia',
      schoolClass: CLASS_5B_NAME,
      currentStation: 'gruppenarbeit',
      videoWatched: true,
      videoNotes: 'Tutanchamun starb jung mit 18 Jahren.',
      clozeAnswers: {},
      clozeCompleted: true,
      textAnswers: {},
      textCompleted: true,
      quizAnswers: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C', 6: 'B' },
      quizAttempts: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 2 },
      quizErrorsCount: 1,
      quizCompleted: true,
      quizScore: 5,
      groupPartner1: 'Sofia',
      groupPartner2: 'Omar',
      groupTaskChoice: 'puzzle',
      groupNotes: {
        puzzleRoleNotes: 'Experte A: Steine mit Lastkähnen über künstliche Kanäle geschifft.'
      },
      groupCompleted: false,
      badges: ['badge-video', 'badge-text', 'badge-quiz'],
      lastUpdated: 'vor 10 Minuten'
    };
  }

  if (name === 'Omar') {
    return {
      id: `stud-${idx + 1}`,
      name: 'Omar',
      schoolClass: CLASS_5B_NAME,
      currentStation: 'gruppenarbeit',
      videoWatched: true,
      videoNotes: 'Kanäle und Nilflut.',
      clozeAnswers: {},
      clozeCompleted: true,
      textAnswers: {},
      textCompleted: true,
      quizAnswers: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C', 6: 'A' },
      quizAttempts: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
      quizErrorsCount: 0,
      quizCompleted: true,
      quizScore: 6,
      groupPartner1: 'Sofia',
      groupPartner2: 'Omar',
      groupTaskChoice: 'puzzle',
      groupNotes: {},
      groupCompleted: false,
      badges: ['badge-video', 'badge-text', 'badge-quiz'],
      lastUpdated: 'vor 12 Minuten'
    };
  }

  if (name === 'Ilian') {
    return {
      id: `stud-${idx + 1}`,
      name: 'Ilian',
      schoolClass: CLASS_5B_NAME,
      currentStation: 'quiz',
      videoWatched: true,
      videoNotes: 'Notizen zu Pyramiden.',
      clozeAnswers: {},
      clozeCompleted: true,
      textAnswers: {},
      textCompleted: true,
      quizAnswers: { 1: 'A', 2: 'A', 3: 'A' },
      quizAttempts: { 1: 2, 2: 2, 3: 2 },
      quizErrorsCount: 3,
      quizRamsesUnlocked: false,
      quizCompleted: false,
      quizScore: 0,
      groupNotes: {},
      groupCompleted: false,
      badges: ['badge-video', 'badge-text'],
      lastUpdated: 'vor 20 Minuten'
    };
  }

  return {
    id: `stud-${idx + 1}`,
    name,
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
    groupNotes: {},
    groupCompleted: false,
    badges: [],
    lastUpdated: 'Noch nicht begonnen'
  };
});

