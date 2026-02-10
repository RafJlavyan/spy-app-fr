import { useState, useEffect } from "react";
import styles from "./styles.module.scss";

type Role = "NORMAL" | "SPY" | "HELPER";

interface Player {
  role: Role;
  word: string;
  spiesIndexes?: number[];
}

type GameProps = {
  players: Player[];
  currentPlayer: number;
  spyHint: string | null;
  specificHintContent: string | null;
  isCardOpen: boolean;
  hintSpy: boolean;
  prevSecretWord: string | null;
  onFinish: () => void;
  toggleCard: () => void;
  secretWord: string;
  gameDuration: number;
};

export const Game = ({
  players,
  currentPlayer,
  spyHint,
  specificHintContent,
  isCardOpen,
  hintSpy,
  prevSecretWord,
  onFinish,
  toggleCard,
  secretWord,
  gameDuration,
}: GameProps) => {
  const [showWord, setShowWord] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameDuration * 60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isGameOver = currentPlayer >= players.length;

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
      }, 2000);
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
                <h3>Մնացած ժամանակը</h3>
                <div className={styles.timer}>{formatTime(timeLeft)}</div>
              </>
            ) : (
              <h3 className={styles.timesUp}>Ժամանակն ավարտվեց:</h3>
            )}
          </div>
          <button onClick={onFinish} className={styles.finishBtn}>
            Ավարտել խաղը
          </button>
        </div>
      ) : (
        <div className={styles.cardSection}>
          <h3>Խաղացող {currentPlayer + 1}</h3>

          <div className={styles.card}>
            <div className={styles.wordWrapper}>
              {isCardOpen ? (
                players[currentPlayer].role === "SPY" ? (
                  <>
                    SPY
                    {hintSpy && spyHint && prevSecretWord && (
                      <div className={styles.spyHint}>
                        {spyHint === "First Letter" && (
                          <span className={styles.hint}>
                            Առաջին տառը՝{" "}
                            {(() => {
                              const cleanedWord = prevSecretWord.replace(
                                / /g,
                                "",
                              );

                              if (
                                cleanedWord[0] === "ո" &&
                                cleanedWord[1] === "ւ"
                              ) {
                                return "ու";
                              }

                              return cleanedWord[0];
                            })()}
                          </span>
                        )}
                        {spyHint === "The part of the word is" &&
                          prevSecretWord.length >= 2 && (
                            <span className={styles.hint}>
                              Բառի մի մասը՝{" "}
                              {(() => {
                                const cleanedWord = prevSecretWord.replace(
                                  / /g,
                                  "",
                                );
                                const letters: string[] = [];
                                let i = 0;

                                while (i < cleanedWord.length) {
                                  if (
                                    cleanedWord[i] === "ո" &&
                                    cleanedWord[i + 1] === "ւ"
                                  ) {
                                    letters.push("ու");
                                    i += 2;
                                  } else {
                                    letters.push(cleanedWord[i]);
                                    i++;
                                  }
                                }

                                const maxIndex = letters.length - 1;
                                let attempts = 0;

                                while (attempts <= maxIndex) {
                                  const start = Math.floor(
                                    Math.random() * maxIndex,
                                  );
                                  const part = letters
                                    .slice(start, start + 2)
                                    .join("");
                                  if (!part.includes(" ")) {
                                    return part;
                                  }
                                  attempts++;
                                }

                                return letters.slice(0, 2).join("");
                              })()}
                            </span>
                          )}
                        {spyHint === "The specific hint" &&
                          specificHintContent && (
                            <span className={styles.hint}>
                              {specificHintContent}
                            </span>
                          )}
                      </div>
                    )}
                  </>
                ) : players[currentPlayer].role === "HELPER" ? (
                  <>
                    {players[currentPlayer].word}
                    <br />
                    <span className={styles.helper}>
                      Լրտեսը №{" "}
                      {players[currentPlayer].spiesIndexes
                        ?.map((i) => i + 1)
                        .join(", ")}{" "}
                      խաղացողն է
                    </span>
                  </>
                ) : (
                  players[currentPlayer].word
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
              {isCardOpen ? "Փակել քարտը" : "Բացել քարտը"}
            </button>
            <p
              style={{ opacity: showWord ? 1 : 0, marginTop: "64px" }}
              onClick={() => setShowWord(false)}
              onDoubleClick={() => setShowWord(true)}
            >
              {secretWord}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
