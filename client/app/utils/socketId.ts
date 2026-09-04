import io from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

export const socketId = io(ENDPOINT, { transports: ["websocket"] });