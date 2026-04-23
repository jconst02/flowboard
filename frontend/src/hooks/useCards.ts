import { useQuery } from "@tanstack/react-query";
import { getCardsByBoard } from "../api/api";
import type { Card } from "../types";

export const useCards = (boardId: string) => {
    return useQuery<Card[]>({
        queryKey: ["cards", boardId],
        queryFn: () => getCardsByBoard(boardId)
    })
}