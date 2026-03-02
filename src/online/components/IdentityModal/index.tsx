import { useState } from "react";
import styles from "./styles.module.scss";
import { useLanguage } from "../../../shared/LanguageContext";

interface IdentityModalProps {
  onSave: (username: string) => void;
}

export const IdentityModal = ({ onSave }: IdentityModalProps) => {
  const [name, setName] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{t("enterName")}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("yourName")}
            autoFocus
            className={styles.input}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className={styles.button}
          >
            {t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};
