import { Router } from "express";
import { createCard, moveCard, deleteCard } from "../controllers/cards";

const router = Router();

router.post("/", createCard);
router.patch("/:cardId", moveCard);
router.delete("/:cardId", deleteCard);

export default router;