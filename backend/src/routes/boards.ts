import { Router } from "express";
import { createBoard, getBoards, getBoard, deleteBoard } from "../controllers/boards";
import { getCardsByBoard } from "../controllers/cards";
import { getLists } from "../controllers/lists";

const router = Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:boardId", getBoard);
router.delete("/:boardId", deleteBoard);
router.get("/:boardId/cards", getCardsByBoard);
router.get("/:boardId/lists", getLists);

export default router;