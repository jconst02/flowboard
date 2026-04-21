import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api/api";

export const useBoards = (userId: string) => {
    return useQuery({
        queryKey: ["boards", userId],
        queryFn: () => getBoards(userId)
    })
}