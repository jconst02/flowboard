import { Request, Response } from "express";
import pool from "../db";

export const createCard = async (req: Request, res: Response) => {
    const { title, list_id, board_id } = req.body;
  
    const countResult = await pool.query(
        "SELECT COUNT(*) FROM cards WHERE list_id = $1",
        [list_id]
    );

    const position = parseInt(countResult.rows[0].count);
    
    const card = await pool.query(
      "INSERT INTO cards (title, list_id, board_id, position) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, list_id, board_id, position]
    );
  
    return res.status(201).json(card.rows[0]);
}

export const getCardsByList = async (req: Request, res: Response) => {
    const { listId } = req.params;

    const cards = await pool.query(
        "SELECT * FROM cards WHERE list_id = $1 ORDER BY position ASC",
        [listId]
    );

    return res.json(cards.rows);
}

export const getCardsByBoard = async (req: Request, res: Response) => {
    const { boardId } = req.params;

    const cards = await pool.query(
        "SELECT * FROM cards WHERE board_id = $1 ORDER BY list_id, position ASC",
        [boardId]
    );

    return res.json(cards.rows);
}



export const moveCard = async (req: Request, res: Response) => {
    const { cardId } = req.params;
    const { list_id, position } = req.body;

    await pool.query("BEGIN");

    try {
        const current = await pool.query(
            "SELECT list_id, position FROM cards WHERE id = $1",
            [cardId]
        );
    
        const oldListId = current.rows[0].list_id;
        const oldPosition = current.rows[0].position;
    
        if (oldListId === list_id) {
            if (oldPosition < position) {
                await pool.query(
                    `UPDATE cards SET position = position - 1
                    WHERE list_id = $1 AND position > $2 AND position <= $3 AND id != $4`,
                    [list_id, oldPosition, position, cardId]
                );
            } else {
                await pool.query(
                    `UPDATE cards SET position = position + 1
                    WHERE list_id = $1 AND position >= $2 AND position < $3 AND id != $4`,
                    [list_id, position, oldPosition, cardId]
                );
            }
        } else {
            await pool.query(
                `UPDATE cards SET position = position - 1
                WHERE list_id = $1 AND position > $2 AND id != $3`,
                [oldListId, oldPosition, cardId]
            );
            await pool.query(
                `UPDATE cards SET position = position + 1
                WHERE list_id = $1 AND position >= $2`,
                [list_id, position]
            );
        }
    
        const cards = await pool.query(
            "UPDATE cards SET list_id = $1, position = $2 WHERE id = $3 RETURNING *",
            [list_id, position, cardId]
        );
        
        await pool.query("COMMIT");

        return res.json(cards.rows[0]);

    } catch(e) {
        await pool.query("ROLLBACK");
        throw e;
    }
}


export const deleteCard = async (req: Request, res: Response) => {
    const { cardId } = req.params;

    await pool.query("BEGIN");

    try {
        const card = await pool.query(
            "SELECT list_id, position FROM cards WHERE id = $1",
            [cardId]
        );
    
        if (card.rowCount === 0) {
            return res.status(404).json({ error: "Card not found" });
        };
    
        const { list_id, position } = card.rows[0];
    
        await pool.query(
            `UPDATE cards SET position = position - 1
            WHERE list_id = $1 AND position > $2`,
            [list_id, position]
        );
    
        await pool.query("DELETE FROM cards WHERE id = $1", [cardId]);
    
        await pool.query("COMMIT");

        return res.json({ message: "Card deleted" });

    } catch(e) {
        await pool.query("ROLLBACK");
        throw e;
    }
}