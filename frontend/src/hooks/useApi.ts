import { useAuth } from "@clerk/react";
import * as api from "../api/api";

export function useApi() {
    const { getToken } = useAuth();

    return {
        createBoard: async (title: string) => {
            const token = await getToken();
            return api.createBoard(title, token!);
        },
        getBoards: async() => {
            const token = await getToken();
            return api.getBoards(token!);
        },
        getBoard: async(boardId: string) => {
            const token = await getToken();
            return api.getBoard(boardId, token!);
        },
        deleteBoard: async (boardId: string) => {
            const token = await getToken();
            return api.deleteBoard(boardId, token!);
        },
        getLists: async (boardId: string) => {
            const token = await getToken();
            return api.getLists(boardId, token!)
        },
        createList: async (title: string, boardId: string, socketId?: string) => {
            const token = await getToken();
            return api.createList(title, boardId, token!, socketId);
        },
        deleteList: async (listId: string, socketId?: string) => {
            const token = await getToken();
            return api.deleteList(listId, token!, socketId);
        },
        createCard: async (title: string, listId: string, boardId: string, socketId?: string) => {
            const token = await getToken();
            return api.createCard(title, listId, boardId, token!, socketId);
        },
        getCardsByBoard: async (boardId: string) => {
            const token = await getToken();
            return api.getCardsByBoard(boardId, token!);
        },
        deleteCard: async (cardId: string, socketId?: string) => {
            const token = await getToken();
            return api.deleteCard(cardId, token!, socketId);
        },
        moveCard: async (cardId: string, listId: string, position: number, socketId?: string) => {
            const token = await getToken();
            return api.moveCard(cardId, listId, position, token!, socketId);
        }
    }
}