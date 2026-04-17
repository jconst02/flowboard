import { Router } from "express";
import { createCard, getCards, moveCard, deleteCard } from "../controllers/cards";

const router = Router();

router.post("/", createCard);
router.get("/list/:id", getCards);
router.patch("/:id", moveCard);
router.delete("/:id", deleteCard);

export default router;