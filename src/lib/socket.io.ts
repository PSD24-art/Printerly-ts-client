import { io } from "socket.io-client";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const socket = io(baseUrl, {
  autoConnect: false,
  withCredentials: true,
});
