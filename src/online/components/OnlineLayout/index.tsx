import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { useLanguage } from "../../../shared/LanguageContext";
import { useOnlineIdentity } from "../../hooks/useOnlineIdentity";
import { socketService, Room, RoomConfig, Player } from "../../services/socket";
import Categories from "../../../components/Categories";
import { optionsByCategory } from "../../../data/Categories";
import { getUniqueSecretWord } from "../../../utils/getUniqueSecretWord";
import hintsType from "../../../data/hints";
import { generateHint, HintType } from "../../../utils/hintGenerator";

type View = "selection" | "categories" | "lobby" | "game";

export const OnlineLayout = () => {
  const [view, setView] = useState<View>("selection");
  const [roomCode, setRoomCode] = useState("");
  const { t } = useLanguage();
  const { username, clientId } = useOnlineIdentity();

  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socketService.connect();

    socketService.onRoomCreated((newRoom) => {
      setRoom(newRoom);
      setRoomCode(newRoom.roomCode);
      setView("lobby");
    });

    socketService.onRoomUpdated((updatedRoom) => {
      setRoom(updatedRoom);
      // Sync view if game is in progress (e.g., on reconnection)
      if (updatedRoom.gameState === "playing" && view !== "game") {
        setView("game");
      }
    });

    socketService.onGameStarted((startedRoom) => {
      setRoom(startedRoom);
      setView("game");
    });

    socketService.onGameReset((resetRoom) => {
      setRoom(resetRoom);
      setView("lobby");
    });

    socketService.onRoomClosed(() => {
      setRoom(null);
      setView("selection");
      setError(t("roomClosedByHost"));
      setTimeout(() => setError(null), 5000);
    });

    socketService.onPlayerLeftGame(({ playerName }) => {
      setError(`${playerName} ${t("leftTheGame")}`);
      socketService.leaveRoom();
      setRoom(null);
      setView("selection");
      setTimeout(() => setError(null), 5000);
    });

    socketService.onError((err) => {
      setError(err);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  // Auto-start logic removed in favor of manual start button
  // as per user request (host should be able to create new game/category)

  const handleAutoStart = () => {
    if (!room) return;

    const { config, roomCode, players } = room;
    const options = optionsByCategory[config.categoryId];
    const secretWord = getUniqueSecretWord(options);

    // Copy players to avoid direct mutation
    const updatedPlayers: Player[] = players.map((p) => ({
      ...p,
      role: "player" as const,
      word: secretWord,
    }));

    // Place spies
    let spiesPlaced = 0;
    const spiesIndexes: number[] = [];
    while (spiesPlaced < config.spiesCount) {
      const index = Math.floor(Math.random() * updatedPlayers.length);
      if (updatedPlayers[index].role !== "spy") {
        updatedPlayers[index].role = "spy";
        updatedPlayers[index].word = ""; // Will be updated if hint is enabled
        spiesIndexes.push(index);
        spiesPlaced++;
      }
    }

    // Place helpers
    let helpersPlaced = 0;
    while (helpersPlaced < config.helpersCount) {
      const index = Math.floor(Math.random() * updatedPlayers.length);
      if (updatedPlayers[index].role === "player") {
        updatedPlayers[index].role = "helper";
        // Find names of spies to show the helper
        const spyNames = updatedPlayers
          .filter((p) => p.role === "spy")
          .map((p) => p.name)
          .join(", ");
        updatedPlayers[index].word =
          `${secretWord}\n(${t("spyIs")}${spyNames})`;
        helpersPlaced++;
      }
    }

    if (config.hintSpy) {
      const randomHint =
        hintsType[Math.floor(Math.random() * hintsType.length)];
      const hint = generateHint(secretWord, randomHint.type as HintType);

      // Update spies with hint and potentially other spies names
      updatedPlayers.forEach((p) => {
        if (p.role === "spy") {
          const otherSpies = updatedPlayers
            .filter((op) => op.role === "spy" && op.clientId !== p.clientId)
            .map((op) => op.name);

          let spyWord = `${t("hintPrefix")}${hint}`;
          if (otherSpies.length > 0) {
            spyWord += `\n(${t("otherSpies")}: ${otherSpies.join(", ")})`;
          }
          p.word = spyWord;
        }
      });
    } else {
      // If no hint, still show other spies names to each other
      updatedPlayers.forEach((p) => {
        if (p.role === "spy") {
          const otherSpies = updatedPlayers
            .filter((op) => op.role === "spy" && op.clientId !== p.clientId)
            .map((op) => op.name);

          if (otherSpies.length > 0) {
            p.word = `(${t("otherSpies")}: ${otherSpies.join(", ")})`;
          }
        }
      });
    }

    socketService.startGame({
      roomCode,
      players: updatedPlayers,
      currentWord: secretWord,
    });
  };

  const handleCreateRoom = () => {
    setView("categories");
  };

  const handleConfigComplete = (config: RoomConfig) => {
    if (room?.roomCode) {
      socketService.updateRoomConfig(room.roomCode, config);
      setView("lobby");
    } else {
      socketService.createRoom({
        name: username || "Player",
        clientId: clientId || "",
        config,
      });
    }
  };

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      socketService.joinRoom({
        roomCode: roomCode.toUpperCase(),
        name: username || "Player",
        clientId: clientId || "",
      });
      setView("lobby");
    }
  };

  const handleCopyCode = () => {
    if (room?.roomCode) {
      navigator.clipboard.writeText(room.roomCode);
    }
  };

  const localPlayer = room?.players.find((p) => p.clientId === clientId);

  return (
    <div className={styles.onlineContainer}>
      {error && <div className={styles.errorBanner}>{error}</div>}

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
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
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

      {view === "categories" && (
        <Categories
          onGameStateChange={() => {}}
          onConfigComplete={handleConfigComplete}
          startButtonLabel={room ? t("apply") : t("start")}
        />
      )}

      {view === "lobby" && room && (
        <div className={styles.selectionCard}>
          <h3>{t("lobby")}</h3>
          <div className={styles.roomInfo}>
            <div className={styles.codeContainer}>
              <span>
                {t("roomCode")}: {room.roomCode}
              </span>
              <button
                className={styles.copyButton}
                onClick={handleCopyCode}
                title={t("copy")}
              >
                &#xF0C5;
              </button>
            </div>
            <small>
              {t(room.config.categoryId)} | {t("totalPlayers")}:{" "}
              {room.players.length}/{room.config.playersCount}
            </small>
          </div>
          <p className={styles.waitingText}>
            {room.players.length < room.config.playersCount
              ? t("waitingForPlayers")
              : room.players.every((p) => p.isReady)
                ? t("everyoneReady")
                : t("waitingForPlayers")}
          </p>
          <ul className={styles.playerList}>
            {room.players.map((p) => (
              <li key={p.clientId}>
                {p.name} {p.clientId === clientId ? `(${t("you")})` : ""}{" "}
                {p.socketId === room.hostSocketId
                  ? `(${t("host")})`
                  : p.isReady
                    ? `(${t("ready")})`
                    : `(${t("notReady")})`}
              </li>
            ))}
          </ul>
          {room.hostSocketId === localPlayer?.socketId ? (
            <div className={styles.hostActions}>
              <button
                className={styles.mainButton}
                onClick={handleAutoStart}
                disabled={
                  room.players.length < room.config.playersCount ||
                  !room.players.every((p) => p.isReady)
                }
                style={{ marginBottom: "10px" }}
              >
                {t("start")}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => setView("categories")}
                style={{ marginBottom: "10px" }}
              >
                {t("changeCategory")}
              </button>
            </div>
          ) : (
            <button
              className={styles.mainButton}
              onClick={() =>
                room &&
                clientId &&
                socketService.toggleReady(room.roomCode, clientId)
              }
              style={{ marginBottom: "10px" }}
            >
              {localPlayer?.isReady ? t("unready") : t("ready")}
            </button>
          )}
          <button
            className={styles.secondaryButton}
            onClick={() => {
              socketService.leaveRoom();
              setView("selection");
              setRoom(null);
            }}
          >
            {t("back")}
          </button>
        </div>
      )}

      {view === "game" && room && localPlayer && (
        <div className={styles.selectionCard}>
          <h3>{t("gameStarted")}</h3>
          <div className={styles.roleCard}>
            <h4>
              {t("yourRole")}: {t(localPlayer.role || "player")}
            </h4>
            <p>{localPlayer.role === "spy" ? t("youAreSpy") : t("yourWord")}</p>
            {localPlayer.word && (
              <div className={styles.wordDisplay}>{localPlayer.word}</div>
            )}
          </div>
          {room.hostSocketId === localPlayer.socketId ? (
            <button
              className={styles.mainButton}
              style={{ marginTop: "20px" }}
              onClick={() => {
                socketService.resetGame(room.roomCode);
              }}
            >
              {t("endGame")}
            </button>
          ) : (
            <button
              className={styles.secondaryButton}
              style={{ marginTop: "20px" }}
              onClick={() => {
                socketService.leaveRoom();
                setView("selection");
                setRoom(null);
              }}
            >
              {t("leaveGame")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineLayout;
