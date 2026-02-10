import { getUniqueSecretWord } from "../../utils/getUniqueSecretWord";
import styles from "./styles.module.scss";
import categoriesData, { optionsByCategory } from "../../data/Categories";
import { useState } from "react";
import { SetParameters } from "../SetParameters";
import { Game } from "../Game";
import hintsType from "../../data/hints";
import { getAIHint } from "../../utils/openai.ts";
import { armenianToEnglish } from "../../data/translations";

type Role = "NORMAL" | "SPY" | "HELPER";

interface Player {
  role: Role;
  word: string;
  spiesIndexes?: number[];
}

const Categories = () => {
  const [choosenCategory, setChoosenCategory] = useState("");
  const [playersCount, setPlayersCount] = useState(() => {
    const saved = localStorage.getItem("playersCount");
    return saved ? Number(saved) : 4;
  });
  const [helpersCount, setHelpersCount] = useState(() => {
    const saved = localStorage.getItem("helpersCount");
    return saved ? Number(saved) : 0;
  });
  const [spiesCount, setSpiesCount] = useState(() => {
    const saved = localStorage.getItem("spiesCount");
    return saved ? Number(saved) : 1;
  });
  const [hintSpy, setHintSpy] = useState(false);
  const [spyHint, setSpyHint] = useState<null | string>(null);
  const [specificHintContent, setSpecificHintContent] = useState<null | string>(
    null,
  );
  const [startGame, setStartGame] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [prevSecretWord, setPrevSecretWord] = useState<string | null>(null);
  const [theSecretWord, setTheSecretWord] = useState("");
  const [gameDuration, setGameDuration] = useState(() => {
    const saved = localStorage.getItem("gameDuration");
    return saved ? Number(saved) : 5;
  });
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);

  const handlePlayersCountChange = (count: number) => {
    setPlayersCount(count);
    localStorage.setItem("playersCount", count.toString());
  };

  const handleSetHintSpy = () => {
    setHintSpy(!hintSpy);
  };

  const handleSpiesCountChange = (count: number) => {
    setSpiesCount(count);
    localStorage.setItem("spiesCount", count.toString());
  };

  const handleGameDurationChange = (duration: number) => {
    setGameDuration(duration);
    localStorage.setItem("gameDuration", duration.toString());
  };

  const handleBackToCategories = () => {
    setChoosenCategory("");
  };

  const handleFinishGame = () => {
    setChoosenCategory("");
    setStartGame(false);
  };

  const startGameHandler = async () => {
    const options = optionsByCategory[choosenCategory];

    const secretWord = getUniqueSecretWord(options);
    setTheSecretWord(secretWord);

    // Initialize all players as NORMAL with secretWord
    const generatedPlayers: Player[] = Array(playersCount)
      .fill(null)
      .map(() => ({
        role: "NORMAL",
        word: secretWord,
      }));

    // Place spies
    let spiesPlaced = 0;
    const spiesIndexes: number[] = [];
    while (spiesPlaced < spiesCount) {
      const index = Math.floor(Math.random() * playersCount);
      if (generatedPlayers[index].role !== "SPY") {
        generatedPlayers[index] = { role: "SPY", word: "SPY" };
        spiesIndexes.push(index);
        spiesPlaced++;
      }
    }

    // Place helpers
    let helpersPlaced = 0;
    while (helpersPlaced < helpersCount) {
      const index = Math.floor(Math.random() * playersCount);
      if (generatedPlayers[index].role === "NORMAL") {
        generatedPlayers[index] = {
          role: "HELPER",
          word: secretWord,
          spiesIndexes: spiesIndexes,
        };
        helpersPlaced++;
      }
    }

    setPrevSecretWord(secretWord);
    if (hintSpy) {
      const randomHint =
        hintsType[Math.floor(Math.random() * hintsType.length)];

      if (randomHint.type === "The specific hint") {
        setSpyHint(randomHint.type);
        setIsGeneratingHint(true);
        try {
          const translatedWord = armenianToEnglish[secretWord] || secretWord;
          const aiHint = await getAIHint(translatedWord);
          setSpecificHintContent(aiHint);
        } finally {
          setIsGeneratingHint(false);
        }
      } else {
        setSpyHint(randomHint.type);
        setSpecificHintContent(null);
      }
    } else {
      setSpyHint(null);
      setSpecificHintContent(null);
    }
    setPlayers(generatedPlayers);
    setCurrentPlayer(0);
    setIsCardOpen(false);
    setStartGame(true);
  };

  return (
    <div className={styles.categoriesWrapper}>
      {startGame ? (
        <Game
          secretWord={theSecretWord}
          players={players}
          currentPlayer={currentPlayer}
          spyHint={spyHint}
          specificHintContent={specificHintContent}
          isCardOpen={isCardOpen}
          hintSpy={hintSpy}
          prevSecretWord={prevSecretWord}
          onFinish={handleFinishGame}
          gameDuration={gameDuration}
          toggleCard={() => {
            if (isCardOpen) {
              setIsCardOpen(false);
              setCurrentPlayer((prev) => prev + 1);
            } else {
              setIsCardOpen(true);
            }
          }}
        />
      ) : (
        <>
          {!choosenCategory && <h3>Ընտրեք բառացանկը</h3>}

          <div className={styles.categories}>
            {choosenCategory ? (
              <SetParameters
                helpersCount={helpersCount}
                playersCount={playersCount}
                spiesCount={spiesCount}
                setHelpersCount={setHelpersCount}
                setPlayersCount={handlePlayersCountChange}
                setSpiesCount={handleSpiesCountChange}
                hintSpy={hintSpy}
                setHintSpy={handleSetHintSpy}
                goBack={handleBackToCategories}
                onStartGame={startGameHandler}
                gameDuration={gameDuration}
                setGameDuration={handleGameDurationChange}
                isGeneratingHint={isGeneratingHint}
              />
            ) : (
              categoriesData.map((category) => (
                <div
                  key={category.name}
                  className={styles.category}
                  onClick={() => setChoosenCategory(category.name)}
                >
                  <h4>{category.name}</h4>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
