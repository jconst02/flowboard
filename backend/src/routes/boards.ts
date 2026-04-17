import { Router } from "express";
import { createBoard, getBoards, getBoard, deleteBoard } from "../controllers/boards";

const router = Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoard);
router.delete("/:id", deleteBoard);

export default router;