import { ToggleButton } from "../../shared/ui/ToggleButton";
import styles from "./styles.module.scss";

interface SetParametersProps {
  playersCount: number;
  spiesCount: number;
  helpersCount: number;
  setPlayersCount: (count: number) => void;
  setSpiesCount: (count: number) => void;
  setHelpersCount: (count: number) => void;
  goBack: () => void;
  onStartGame: () => void;
  hintSpy: boolean;
  setHintSpy: () => void;
  gameDuration: number;
  setGameDuration: (duration: number) => void;
  isGeneratingHint: boolean;
}

export const SetParameters = ({
  playersCount,
  spiesCount,
  helpersCount,
  setPlayersCount,
  setSpiesCount,
  setHelpersCount,
  goBack,
  onStartGame,
  hintSpy,
  setHintSpy,
  gameDuration,
  setGameDuration,
  isGeneratingHint,
}: SetParametersProps) => {
  const incrementPlayers = () => setPlayersCount(playersCount + 1);
  const decrementPlayers = () => {
    if (playersCount > 3) {
      const newPlayersCount = playersCount - 1;
      setPlayersCount(newPlayersCount);
      if (spiesCount > newPlayersCount) {
        setSpiesCount(newPlayersCount);
      }
      if (helpersCount > newPlayersCount - spiesCount) {
        setHelpersCount(newPlayersCount - spiesCount);
      }
    }
  };
  const incrementSpies = () => {
    if (spiesCount < playersCount) {
      setSpiesCount(spiesCount + 1);
      if (helpersCount > playersCount - (spiesCount + 1)) {
        setHelpersCount(playersCount - (spiesCount + 1));
      }
    }
  };
  const decrementSpies = () => {
    if (spiesCount > 1) {
      setSpiesCount(spiesCount - 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles.goBackArrow} onClick={goBack}>
        <span>&#8592;</span>
      </button>
      <div className={styles.block}>
        <h4>Ընդհանուր խաղացողների քանակը</h4>
        <div className={styles.countWrapper}>
          <button onClick={decrementPlayers} disabled={playersCount <= 3}>
            -
          </button>
          <span>{playersCount}</span>
          <button onClick={incrementPlayers}>+</button>
        </div>
      </div>
      <div className={styles.block}>
        <h4>Որից լրտեսների քանակը</h4>
        <div className={styles.countWrapper}>
          <button onClick={decrementSpies} disabled={spiesCount <= 1}>
            -
          </button>
          <span>{spiesCount}</span>
          <button
            onClick={incrementSpies}
            disabled={spiesCount >= playersCount}
          >
            +
          </button>
        </div>
      </div>
      <div className={`${styles.block} ${styles.toggleParametr}`}>
        <h4>Հուշում լրտեսին</h4>
        <div className={styles.countWrapper}>
          <ToggleButton isActive={hintSpy} onToggle={setHintSpy} />
        </div>
      </div>
      <div className={`${styles.block} ${styles.toggleParametr}`}>
        <h4>Լրտեսի oգնական</h4>
        <div className={styles.countWrapper}>
          <ToggleButton
            isActive={helpersCount === 1}
            onToggle={() => setHelpersCount(helpersCount === 1 ? 0 : 1)}
          />
        </div>
      </div>
      <div className={styles.block}>
        <h4>Խաղի տևողությունը (րոպե)</h4>
        <div className={styles.countWrapper}>
          <button
            onClick={() => setGameDuration(Math.max(1, gameDuration - 1))}
            disabled={gameDuration <= 1}
          >
            -
          </button>
          <span>{gameDuration}</span>
          <button
            onClick={() => setGameDuration(Math.min(10, gameDuration + 1))}
            disabled={gameDuration >= 10}
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={onStartGame}
        className={styles.startBtn}
        disabled={isGeneratingHint}
      >
        {isGeneratingHint ? "Գեներացվում է..." : "Սկսել"}
      </button>
    </div>
  );
};

// jj
