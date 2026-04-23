import { Request, Response } from "express";
import pool from "../db";

export const createBoard = async (req: Request, res: Response) => {
    const { title, user_id } = req.body;
  
    const board = await pool.query(
      "INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, user_id]
    );
  
    return res.status(201).json(board.rows[0]);
}

export const getBoard = async (req: Request, res: Response) => {
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
    const { user_id } = req.query;

    const boards = await pool.query(
        "SELECT * FROM boards WHERE user_id = $1",
        [user_id]
    );

    return res.json(boards.rows);
}

export const deleteBoard = async (req: Request, res: Response) => {
    const { boardId } = req.params;

    const result = await pool.query(
        "DELETE FROM boards WHERE id = $1 RETURNING *",
        [boardId]
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Board not found" });
    }

    return res.json({ message: "Board deleted" });
}