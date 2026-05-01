import type { Board, Card, List } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL

//BOARDS
export const createBoard = async (title: string, userId: string): Promise<Board> => {
    const res = await fetch(`${BASE_URL}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, user_id: userId })
    })
    return res.json();
}

export const getBoards = async (userId: string): Promise<Board[]> => {
  const res = await fetch(`${BASE_URL}/boards?user_id=${userId}`);
  return res.json();
}

export const getBoard = async (boardId: string): Promise<Board> => {
  const res = await fetch(`${BASE_URL}/boards/${boardId}`);
  return res.json();
}

export const deleteBoard = async (boardId: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/boards/${boardId}`, {
    method: "DELETE"
  });
  return res.json();
}

//LISTS

export const createList = async (title: string, boardId: string): Promise<List> => {
  const res = await fetch(`${BASE_URL}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, board_id: boardId})
  });
  return res.json();
}

export const getLists = async (boardId: string): Promise<List[]> => {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/lists`);
  return res.json();
}

export const deleteList = async (listId: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/lists/${listId}`, {
    method: "DELETE"
  });
  return res.json();
}

//CARDS

export const createCard = async (title: string, listId: string, boardId: string, socketId?: string): Promise<Card>  => {
  const res = await fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, list_id: listId, board_id: boardId, socket_id: socketId })
  });
  return res.json();
}

export const getCards = async (listId: string): Promise<Card[]>  => {
  const res = await fetch(`${BASE_URL}/lists/${listId}/cards`);
  return res.json();
}

export const deleteCard = async (cardId: string, socketId?: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ socket_id: socketId })
  });
  return res.json();
}

export const moveCard = async (cardId: string, listId: string, position: number, socketId?: string): Promise<Card> => {
  const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ list_id: listId, position, socket_id: socketId })
  });
  return res.json();
}

export const getCardsByBoard = async (boardId: string): Promise<Card[]> => {
  const res = await fetch(`${BASE_URL}/boards/${boardId}/cards`)
  return res.json()
}