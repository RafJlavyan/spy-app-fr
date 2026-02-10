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
  gameDuration: number;
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
  gameDuration,
}: GameProps) => {
  const { language, t } = useLanguage();
  const [showWord, setShowWord] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameDuration * 60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isGameOver = currentPlayer >= players.length;

  const translateWord = (word: string) => {
    if (language === "en") {
      return armenianToEnglish[word] || word;
    }
    return word;
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isGameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isGameOver) {
      playBellSound();
    }
  }, [timeLeft, isGameOver]);

  useEffect(() => {
    if (isCardOpen && !isGameOver) {
      setIsButtonDisabled(true);
      const timer = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isCardOpen, isGameOver]);

  const playBellSound = () => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Bell-like parameters
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime); // Base frequency

      // Envelope
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3); // Decay over 3 seconds

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.cardWrapper}>
      {isGameOver ? (
        <div className={styles.gameOverSection}>
          <div className={styles.timerWrapper}>
            {timeLeft > 0 ? (
              <>
                <h3>{t("remainingTime")}</h3>
                <div className={styles.timer}>{formatTime(timeLeft)}</div>
              </>
            ) : (
              <h3 className={styles.timesUp}>{t("timesUp")}</h3>
            )}
          </div>
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
                  <>
                    {t("spy")}
                    {hintSpy && specificHintContent && (
                      <div className={styles.spyHint}>
                        <span className={styles.hint}>
                          {specificHintContent}
                        </span>
                      </div>
                    )}
                  </>
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
