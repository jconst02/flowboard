import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api/api";
import type { Board } from "../types";

export const useBoards = (userId: string) => {
    return useQuery<Board[]>({
        queryKey: ["boards", userId],
        queryFn: () => getBoards(userId)
    })
}