import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

export const initSocketServer = (server: HTTPServer) => {
    const io = new SocketIOServer(server);

    io.on("connection", (socket) => {
        console.log("A user connected");

        // Listen for a notification event from the frontend
        socket.on("notification", (data) => {
            // Broadcast it to every connected client (including the admin dashboard)
            io.emit("newNotification", data);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};