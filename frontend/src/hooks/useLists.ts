import { useQuery } from "@tanstack/react-query";
import type { List } from "../types";
import { useApi } from "./useApi";

export const useLists = (boardId: string) => {
    const api = useApi();
    
    return useQuery<List[]>({
        queryKey: ["lists", boardId],
        queryFn: () => api.getLists(boardId)
    })
}