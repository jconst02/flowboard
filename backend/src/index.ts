import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from "./socket";
import boardRoutes from "./routes/boards";
import listRoutes from "./routes/lists";
import cardRoutes from "./routes/cards";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173"},
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok")
});

type UserPresence = {
  userId: string,
  userName?: string,
  userAvatar?: string,
  socketIds: string[]
}

const boardUsers: Record<string, UserPresence[]> = {}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join-board", ({ boardId, userId, userName, userAvatar }) => {
    socket.join(boardId);
    socket.data.boardId = boardId;
    socket.data.userId = userId;

    if (!boardUsers[boardId]) boardUsers[boardId] = [];

    const existingUser = boardUsers[boardId].find(u => u.userId === userId);

    if (existingUser) {
      existingUser.socketIds.push(socket.id);
    } else {
      boardUsers[boardId].push({
        userId,
        userName,
        userAvatar,
        socketIds: [socket.id]
      });
    }

    io.to(boardId).emit("presence-update", boardUsers[boardId]);
  
    console.log(`${socket.id} joined board ${boardId}`);
  });

  socket.on("disconnect", () => {
    const { boardId, userId } = socket.data;

    if (!boardId || !boardUsers[boardId]) return;

    boardUsers[boardId] = boardUsers[boardId]
      .map(user => {
        if (user.userId !== userId) return user;

        return {
          ...user,
          socketIds: user.socketIds.filter(id => id !== socket.id)
        };
      })
      .filter(user => user.socketIds.length > 0);
    
    io.to(boardId).emit("presence-update", boardUsers[boardId])
  
    console.log("user disconnected", socket.id);
  });
});

setIO(io);

app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

