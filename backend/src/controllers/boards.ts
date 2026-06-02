import { Request, Response } from "express";
import pool from "../db";
import { getAuth } from "@clerk/express";

export const createBoard = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title } = req.body;
  
    const board = await pool.query(
      "INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );
  
    return res.status(201).json(board.rows[0]);
}

export const getBoard = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { boardId } = req.params;

    const board = await pool.query(
        "SELECT * FROM boards WHERE id = $1",
        [boardId]
    );

    if (board.rows.length === 0) {
        return res.status(404).json({ error: "Board not found" })
    };

    return res.json(board.rows[0]);
}

export const getBoards = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const boards = await pool.query(
        "SELECT * FROM boards WHERE user_id = $1",
        [userId]
    );

    return res.json(boards.rows);
}

export const deleteBoard = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { boardId } = req.params;

    const result = await pool.query(
        "DELETE FROM boards WHERE id = $1 AND user_id = $2 RETURNING *",
        [boardId, userId]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Board not found" });
    }

    return res.json({ message: "Board deleted" });
}