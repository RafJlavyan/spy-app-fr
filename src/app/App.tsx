import { useState } from "react";
import Categories from "../components/Categories";
import LanguageSwitcher from "../components/LanguageSwitcher";
import styles from "./styles.module.scss";

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className={styles.appContainer}>
      {!isGameStarted && <LanguageSwitcher />}
      <Categories onGameStateChange={setIsGameStarted} />
    </div>
  );
}

export default App;
