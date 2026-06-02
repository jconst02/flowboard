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
        }
    }
}