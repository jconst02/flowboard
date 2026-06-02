import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import type { Board } from "../types";

export const useBoards = (userId: string) => {
    const api = useApi();

    return useQuery<Board[]>({
        queryKey: ["boards", userId],
        queryFn: () => api.getBoards()
    })
}