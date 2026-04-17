import { Router } from "express";
import { createList, getLists, deleteList } from "../controllers/lists";

const router = Router();

router.post("/", createList);
router.get("/board/:id", getLists);
router.delete("/:id", deleteList);

export default router;