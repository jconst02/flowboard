import { Request, Response } from "express";
import pool from "../db";

export const createCard = async (req: Request, res: Response) => {
    const { title, list_id } = req.body;
  
    const countResult = await pool.query(
        "SELECT COUNT(*) FROM cards WHERE list_id = $1",
        [list_id]
    );

    const position = parseInt(countResult.rows[0].count);
    
    const card = await pool.query(
      "INSERT INTO cards (title, list_id, position) VALUES ($1, $2, $3) RETURNING *",
      [title, list_id, position]
    );
  
    return res.status(201).json(card.rows[0]);
}

export const getCards = async (req: Request, res: Response) => {
    const { id } = req.params;

    const cards = await pool.query(
        "SELECT * FROM cards WHERE list_id = $1 ORDER BY position ASC",
        [id]
    );

    return res.json(cards.rows);
}


export const moveCard = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { list_id, position } = req.body;

    const current = await pool.query(
        "SELECT list_id, position FROM cards WHERE id = $1",
        [id]
    );

    const oldListId = current.rows[0].list_id;
    const oldPosition = current.rows[0].position;

    if (oldListId === list_id) {
        if (oldPosition < position) {
            await pool.query(
                `UPDATE cards SET position = position - 1
                WHERE list_id = $1 AND position > $2 AND position <= $3 AND id != $4`,
                [list_id, oldPosition, position, id]
            );
        } else {
            await pool.query(
                `UPDATE cards SET position = position + 1
                WHERE list_id = $1 AND position >= $2 AND position < $3 AND id != $4`,
                [list_id, position, oldPosition, id]
            );
        }
    } else {
        await pool.query(
            `UPDATE cards SET position = position - 1
            WHERE list_id = $1 AND position > $2 AND id != $3`,
            [oldListId, oldPosition, id]
        );
        await pool.query(
            `UPDATE cards SET position = position + 1
            WHERE list_id = $1 AND position >= $2`,
            [list_id, position]
        );
    }

    const cards = await pool.query(
        "UPDATE cards SET list_id = $1, position = $2 WHERE id = $3 RETURNING *",
        [list_id, position, id]
    );

    return res.json(cards.rows[0]);
}


export const deleteCard = async (req: Request, res: Response) => {
    const { id } = req.params;

    const card = await pool.query(
        "SELECT list_id, position FROM cards WHERE id = $1",
        [id]
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

    await pool.query("DELETE FROM cards WHERE id = $1", [id]);


    return res.json({ message: "Card deleted" });
}