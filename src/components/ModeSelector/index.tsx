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
      <div className={styles.buttonContainer}>
        <span className={styles.comingSoon}>{t("comingSoon")}</span>
        <button
          className={`${styles.modeButton} ${mode === "online" ? styles.active : ""}`}
          onClick={() => onChange("online")}
          disabled
        >
          {t("online")}
        </button>
      </div>
    </div>
  );
};
