import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "am" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved as Language) || "am";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  // Basic translation function for UI strings
  const t = (key: string): string => {
    // This will be expanded or used with a lookup object
    return uiTranslations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Internal UI translations
const uiTranslations: Record<Language, Record<string, string>> = {
  am: {
    settings: "Կարգավորումներ",
    players: "Խաղացողներ",
    spies: "Լրտեսներ",
    time: "Ժամանակ",
    minutes: "րոպե",
    start: "Սկսել",
    categories: "Կատեգորիաներ",
    back: "Հետ",
    next: "Առաջ",
    spy: "Լրտես",
    location: "Վայր",
    hint: "Հուշում",
    close: "Փակել",
    endGame: "Ավարտել խաղը",
    winner: "Հաղթող",
    playAgain: "Նորից խաղալ",
    selectLanguage: "Ընտրեք լեզուն",
    selectCategory: "Ընտրեք բառացանկը",
    totalPlayers: "Ընդհանուր խաղացողների քանակը",
    spiesCount: "Որից լրտեսների քանակը",
    hintSpy: "Հուշում լրտեսին",
    spyHelper: "Լրտեսի օգնական",
    gameDuration: "Խաղի տևողությունը (րոպե)",
    generating: "Գեներացվում է...",
    remainingTime: "Մնացած ժամանակը",
    timesUp: "Ժամանակն ավարտվեց:",
    player: "Խաղացող",
    openCard: "Բացել քարտը",
    closeCard: "Փակել քարտը",
    firstLetter: "Առաջին տառը՝",
    partOfWord: "Բառի մի մասը՝",
    spyIsPlayer: "Լրտեսը №",
    isPlayer: "խաղացողն է",
    otherSpies: "Մյուս լրտեսներն են՝ ",
    Մասնագիտություններ: "Մասնագիտություններ",
    "Հայտնի մարդիկ": "Հայտնի մարդիկ",
    Տեղանուններ: "Տեղանուններ",
    Կերպարներ: "Կերպարներ",
    offline: "Օֆլայն",
    online: "Օնլայն",
    enterName: "Մուտքագրեք ձեր անունը",
    yourName: "Ձեր անունը",
    save: "Պահպանել",
    onlineMode: "Օնլայն Ռեժիմ",
    createRoom: "Ստեղծել Սենյակ",
    joinRoom: "Միանալ Սենյակին",
    roomCode: "Սենյակի Կոդը",
    or: "կամ",
    lobby: "Լոբբի",
    waitingForPlayers: "Սպասում ենք խաղացողներին...",
    startingGame: "Խաղը սկսվում է...",
    you: "Դուք",
    host: "Host",
    gameStarted: "Խաղը սկսված է",
    yourRole: "Ձեր դերը",
    youAreSpy: "Դուք լրտես եք",
    yourWord: "Ձեր բառը",
    helper: "Օգնական",
    hintPrefix: "Հուշում: ",
    finishGame: "Ավարտել խաղը",
    copy: "Պատճենել",
    copied: "Պատճենված է",
    spyIs: "Լրտեսն է՝ ",
    comingSoon: "Շուտով",
    changeCategory: "Փոխել կատեգորիան",
    backToLobby: "Հետ լոբբի",
    leaveGame: "Լքել խաղը",
    apply: "Կիրառել",
    roomClosedByHost: "Սենյակը փակվել է host-ի կողմից",
    ready: "Պատրաստ",
    unready: "Պատրաստ չեմ",
    notReady: "Պատրաստ չէ",
    everyoneReady: "Բոլորը պատրաստ են",
    leftTheGame: "լքեց խաղը",
  },
  en: {
    settings: "Settings",
    players: "Players",
    spies: "Spies",
    time: "Time",
    minutes: "min",
    start: "Start",
    categories: "Categories",
    back: "Back",
    next: "Next",
    spy: "Spy",
    location: "Location",
    hint: "Hint",
    close: "Close",
    endGame: "End Game",
    winner: "Winner",
    playAgain: "Play Again",
    selectLanguage: "Select Language",
    selectCategory: "Select Category",
    totalPlayers: "Total Players Count",
    spiesCount: "Of which spies count",
    hintSpy: "Hint to spy",
    spyHelper: "Spy helper",
    gameDuration: "Game duration (minutes)",
    generating: "Generating...",
    remainingTime: "Remaining Time",
    timesUp: "Time is up!",
    player: "Player",
    openCard: "Open Card",
    closeCard: "Close Card",
    firstLetter: "First Letter:",
    partOfWord: "Part of the word:",
    spyIsPlayer: "Spy is Player №",
    isPlayer: "",
    otherSpies: "Other spies are: ",
    Մասնագիտություններ: "Professions",
    "Հայտնի մարդիկ": "Famous People",
    Տեղանուններ: "Place Names",
    Կերպարներ: "Characters",
    Առարկաներ: "Objects",
    offline: "Offline",
    online: "Online",
    enterName: "Enter your name",
    yourName: "Your name",
    save: "Save",
    onlineMode: "Online Mode",
    createRoom: "Create Room",
    joinRoom: "Join Room",
    roomCode: "Room Code",
    or: "or",
    lobby: "Lobby",
    waitingForPlayers: "Waiting for players...",
    startingGame: "Starting game...",
    you: "You",
    host: "Host",
    gameStarted: "Game Started",
    yourRole: "Your Role",
    youAreSpy: "You are a spy",
    yourWord: "Your Word",
    helper: "Helper",
    hintPrefix: "Hint: ",
    finishGame: "Finish Game",
    copy: "Copy",
    copied: "Copied!",
    spyIs: "Spy is: ",
    comingSoon: "Coming Soon",
    changeCategory: "Change Category",
    backToLobby: "Back to Lobby",
    leaveGame: "Leave Game",
    apply: "Apply",
    roomClosedByHost: "Room closed by host",
    ready: "Ready",
    unready: "Unready",
    notReady: "Not ready",
    everyoneReady: "Everyone is ready",
    leftTheGame: "left the game",
  },
};
