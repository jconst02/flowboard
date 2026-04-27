import { Request, Response } from "express";
import pool from "../db";

export const createList = async (req: Request, res: Response) => {
    const { title, board_id } = req.body;
  
    const countResult = await pool.query(
        "SELECT COUNT(*) FROM lists WHERE board_id = $1",
        [board_id]
    );

    const position = parseInt(countResult.rows[0].count);

    const list = await pool.query(
      "INSERT INTO lists (title, board_id, position) VALUES ($1, $2, $3) RETURNING *",
      [title, board_id, position]
    );
  
    return res.status(201).json(list.rows[0]);
}

export const getLists = async (req: Request, res: Response) => {
    const { boardId } = req.params;

    const lists = await pool.query(
        "SELECT * FROM lists WHERE board_id = $1",
        [boardId]
    );

    return res.json(lists.rows);
}


export const deleteList = async (req: Request, res: Response) => {
    const { listId } = req.params;

    await pool.query("BEGIN");

    try {
        const list = await pool.query(
            "SELECT board_id, position FROM lists WHERE id = $1",
            [listId]
        );
        
        if (list.rowCount === 0){
            return res.status(404).json({ error: "List not found" })
        };
    
        const { board_id, position } = list.rows[0];
    
        await pool.query(
            `UPDATE lists SET position = position - 1
            WHERE board_id = $1 AND position > $2`,
            [board_id, position]
        )
    
        await pool.query("DELETE FROM lists WHERE id = $1", [listId]);
    
        await pool.query("COMMIT");

        return res.json({ message: "List deleted" });
    
    } catch(e) {
        await pool.query("ROLLBACK");
        throw e;
    }
}

