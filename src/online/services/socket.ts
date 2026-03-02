import { io, Socket } from "socket.io-client";

// In a real scenario, this would come from an environment variable
const SOCKET_URL = "http://localhost:3000";

export interface JoinRoomData {
  roomCode: string;
  name: string;
  clientId: string;
}

export interface GameState {
  roomCode: string;
  players: { name: string; clientId: string; isHost: boolean }[];
  status: "lobby" | "playing" | "voting";
  // Add more state as needed
}

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(data: JoinRoomData) {
    this.socket?.emit("join_room", data);
  }

  createRoom(data: { name: string; clientId: string }) {
    this.socket?.emit("create_room", data);
  }

  onGameStateUpdate(callback: (state: GameState) => void) {
    this.socket?.on("game_state_update", callback);
  }

  // Abstract more events as needed
}

export const socketService = new SocketService();
