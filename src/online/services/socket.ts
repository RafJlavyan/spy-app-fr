import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export interface RoomConfig {
  categoryId: string;
  playersCount: number;
  spiesCount: number;
  helpersCount: number;
  hintSpy: boolean;
}

export interface Player {
  socketId: string;
  clientId: string;
  name: string;
  isSpy: boolean;
  isHost: boolean;
  isReady: boolean;
  role?: "spy" | "helper" | "player";
  word?: string;
}

export interface Room {
  roomCode: string;
  hostSocketId: string;
  players: Player[];
  gameState: "lobby" | "playing" | "voting";
  config: RoomConfig;
}

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  leaveRoom() {
    this.socket?.emit("leave_room");
  }

  joinRoom(data: { roomCode: string; name: string; clientId: string }) {
    this.socket?.emit("join_room", data);
  }

  createRoom(data: { name: string; clientId: string; config: RoomConfig }) {
    this.socket?.emit("create_room", data);
  }

  startGame(data: {
    roomCode: string;
    players: Player[];
    currentWord: string;
  }) {
    this.socket?.emit("start_game", data);
  }

  resetGame(roomCode: string) {
    this.socket?.emit("reset_game", { roomCode });
  }

  updateRoomConfig(roomCode: string, config: RoomConfig) {
    this.socket?.emit("update_room_config", { roomCode, config });
  }

  toggleReady(roomCode: string, clientId: string) {
    this.socket?.emit("toggle_ready", { roomCode, clientId });
  }

  onRoomCreated(callback: (room: Room) => void) {
    this.socket?.on("room_created", callback);
  }

  onRoomUpdated(callback: (room: Room) => void) {
    this.socket?.on("room_updated", callback);
  }

  onGameStarted(callback: (room: Room) => void) {
    this.socket?.on("game_started", callback);
  }

  onGameReset(callback: (room: Room) => void) {
    this.socket?.on("game_reset", callback);
  }

  onRoomClosed(callback: () => void) {
    this.socket?.on("room_closed", callback);
  }

  onPlayerLeftGame(callback: (data: { playerName: string }) => void) {
    this.socket?.on("player_left_game", callback);
  }

  onError(callback: (error: string) => void) {
    this.socket?.on("error", callback);
    this.socket?.on("connect_error", (err) => callback(err.message));
  }

  onReconnect(callback: () => void) {
    this.socket?.on("reconnect", callback);
  }

  onDisconnect(callback: (reason: string) => void) {
    this.socket?.on("disconnect", callback);
  }
}

export const socketService = new SocketService();
