import { useQuery } from "@tanstack/react-query";
import type { Card } from "../types";
import { useApi } from "./useApi";

export const useCards = (boardId: string) => {
    const api = useApi();

    return useQuery<Card[]>({
        queryKey: ["cards", boardId],
        queryFn: () => api.getCardsByBoard(boardId)
    })
}