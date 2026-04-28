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

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join-board", (boardId: string) => {
    socket.join(boardId);
    console.log(`${socket.id} joined board ${boardId}`);
  });

  socket.on("disconnect", () => {
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

