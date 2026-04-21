import { useQuery } from "@tanstack/react-query";
import { getCards } from "../api/api";
import type { Card } from "../types";

export const useCards = (listId: string) => {
    return useQuery<Card[]>({
        queryKey: ["cards", listId],
        queryFn: () => getCards(listId)
    })
}