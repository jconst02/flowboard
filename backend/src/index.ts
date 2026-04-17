import "dotenv/config";
import express from "express";
import cors from "cors";
import boardRoutes from "./routes/boards";
import listRoutes from "./routes/lists";
import cardRoutes from "./routes/cards";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok")
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);


// POST   /boards          → create a board
// GET    /boards/:id      → get a board + its lists + cards
// POST   /lists           → create a list
// POST   /cards           → create a card
// PATCH  /cards/:id       → move a card (update its listId)
// DELETE /cards/:id       → delete a card