import { io } from "socket.io-client";
import ENVARS from "@/config/env";

const socket = io(ENVARS.API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;