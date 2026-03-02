import { useState } from "react";
import Categories from "../components/Categories";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ModeSelector } from "../components/ModeSelector";
import OnlineContainer from "../online/OnlineContainer";
import styles from "./styles.module.scss";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameMode, setGameMode] = useState<"offline" | "online">("offline");

  return (
    <div className={styles.appContainer}>
      {!isGameStarted && (
        <>
          <LanguageSwitcher />
          <ModeSelector mode={gameMode} onChange={setGameMode} />
        </>
      )}
      {gameMode === "offline" ? (
        <Categories onGameStateChange={setIsGameStarted} />
      ) : (
        <OnlineContainer />
      )}
    </div>
  );
}

export default App;
