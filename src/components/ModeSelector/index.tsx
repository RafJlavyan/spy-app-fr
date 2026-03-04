import styles from "./styles.module.scss";
import { useLanguage } from "../../shared/LanguageContext";

interface ModeSelectorProps {
  mode: "offline" | "online";
  onChange: (mode: "offline" | "online") => void;
}

export const ModeSelector = ({ mode, onChange }: ModeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className={styles.modeSelector}>
      <button
        className={`${styles.modeButton} ${mode === "offline" ? styles.active : ""}`}
        onClick={() => onChange("offline")}
      >
        {t("offline")}
      </button>
      <button
        className={`${styles.modeButton} ${styles.onlineButton} ${mode === "online" ? styles.active : ""}`}
        onClick={() => onChange("online")}
      >
        {t("online")}
        <p className={styles.betaTag}>BETA</p>
      </button>
    </div>
  );
};
