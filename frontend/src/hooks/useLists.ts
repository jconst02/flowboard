import { useQuery } from "@tanstack/react-query";
import { getLists } from "../api/api";
import type { List } from "../types";

export const useLists = (boardId: string) => {
    return useQuery<List[]>({
        queryKey: ["lists", boardId],
        queryFn: () => getLists(boardId)
    })
}