import { useState } from "react";
import styles from "./styles.module.scss";
import { useLanguage } from "../../../shared/LanguageContext";
import { useOnlineIdentity } from "../../hooks/useOnlineIdentity";

type View = "selection" | "lobby" | "game";

export const OnlineLayout = () => {
  const [view, setView] = useState<View>("selection");
  const [roomCode, setRoomCode] = useState("");
  const { t } = useLanguage();
  const { username, clientId } = useOnlineIdentity();

  const handleCreateRoom = () => {
    // Logic for creating room will go here
    console.log("Creating room for client:", clientId);
    setView("lobby");
  };

  const handleJoinRoom = () => {
    // Logic for joining room will go here
    if (roomCode.trim()) {
      setView("lobby");
    }
  };

  return (
    <div className={styles.onlineContainer}>
      {view === "selection" && (
        <div className={styles.selectionCard}>
          <h3>{t("onlineMode")}</h3>
          <div className={styles.actionGroup}>
            <button className={styles.mainButton} onClick={handleCreateRoom}>
              {t("createRoom")}
            </button>
            <div className={styles.divider}>
              <span>{t("or")}</span>
            </div>
            <div className={styles.joinGroup}>
              <input
                type="text"
                placeholder={t("roomCode")}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className={styles.input}
              />
              <button
                className={styles.secondaryButton}
                onClick={handleJoinRoom}
                disabled={!roomCode.trim()}
              >
                {t("joinRoom")}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "lobby" && (
        <div className={styles.selectionCard}>
          <h3>{t("lobby")}</h3>
          <p>{t("waitingForPlayers")}</p>
          <div className={styles.roomInfo}>
            <span>{t("roomCode")}: XYZ123</span>
          </div>
          <ul className={styles.playerList}>
            <li>{username} (Host)</li>
          </ul>
          <button
            className={styles.mainButton}
            onClick={() => setView("selection")}
          >
            {t("back")}
          </button>
        </div>
      )}
    </div>
  );
};
