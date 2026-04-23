import { Router } from "express";
import { createList, getLists, deleteList } from "../controllers/lists";
import { getCardsByList } from "../controllers/cards";

const router = Router();

router.post("/", createList);
router.get("/:listId/cards", getCardsByList);
router.delete("/:listId", deleteList);

export default router;