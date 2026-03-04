import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { useLanguage } from "../../shared/LanguageContext";
import { armenianToEnglish } from "../../data/translations";

type Role = "NORMAL" | "SPY" | "HELPER";

interface Player {
  role: Role;
  word: string;
  spiesIndexes?: number[];
}

type GameProps = {
  players: Player[];
  currentPlayer: number;
  specificHintContent: string | null;
  isCardOpen: boolean;
  hintSpy: boolean;
  onFinish: () => void;
  toggleCard: () => void;
  secretWord: string;
};

export const Game = ({
  players,
  currentPlayer,
  specificHintContent,
  isCardOpen,
  hintSpy,
  onFinish,
  toggleCard,
  secretWord,
}: GameProps) => {
  const { language, t } = useLanguage();
  const [showWord, setShowWord] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isGameOver = currentPlayer >= players.length;

  useEffect(() => {
    if (isCardOpen && !isGameOver) {
      setIsButtonDisabled(true);
      const timer = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCardOpen, isGameOver]);

  const translateWord = (word: string) => {
    if (language === "en") {
      return armenianToEnglish[word] || word;
    }
    return word;
  };

  return (
    <div className={styles.cardWrapper}>
      {isGameOver ? (
        <div className={styles.gameOverSection}>
          <button onClick={onFinish} className={styles.finishBtn}>
            {t("endGame")}
          </button>
        </div>
      ) : (
        <div className={styles.cardSection}>
          <h3>
            {t("player")} {currentPlayer + 1}
          </h3>
          <div className={styles.card}>
            <div className={styles.wordWrapper}>
              {isCardOpen ? (
                players[currentPlayer].role === "SPY" ? (
                  <div className={styles.spy}>
                    {t("spy")}
                    {players[currentPlayer].spiesIndexes &&
                      players[currentPlayer].spiesIndexes!.length > 1 && (
                        <div className={styles.spyHint}>
                          <span className={styles.helper}>
                            {t("otherSpies")}
                            {players[currentPlayer]
                              .spiesIndexes!.filter((i) => i !== currentPlayer)
                              .map((i) => i + 1)
                              .join(", ")}
                          </span>
                        </div>
                      )}
                    {hintSpy && specificHintContent && (
                      <div className={styles.spyHint}>
                        <span className={styles.hint}>
                          {specificHintContent}
                        </span>
                      </div>
                    )}
                  </div>
                ) : players[currentPlayer].role === "HELPER" ? (
                  <>
                    {translateWord(players[currentPlayer].word)}
                    <br />
                    <span className={styles.helper}>
                      {t("spyIsPlayer")}{" "}
                      {players[currentPlayer].spiesIndexes
                        ?.map((i) => i + 1)
                        .join(", ")}{" "}
                      {t("isPlayer")}
                    </span>
                  </>
                ) : (
                  translateWord(players[currentPlayer].word)
                )
              ) : (
                "—"
              )}
            </div>
            <button
              onClick={toggleCard}
              disabled={isCardOpen && isButtonDisabled}
              style={{
                opacity: isCardOpen && isButtonDisabled ? 0.5 : 1,
                cursor:
                  isCardOpen && isButtonDisabled ? "not-allowed" : "pointer",
              }}
            >
              {isCardOpen ? t("closeCard") : t("openCard")}
            </button>
            <p
              style={{ opacity: showWord ? 1 : 0, marginTop: "64px" }}
              onClick={() => setShowWord(false)}
              onDoubleClick={() => setShowWord(true)}
            >
              {translateWord(secretWord)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
