import type { Card } from "../types";
import { deleteCard } from "../api/api";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    card: Card
}

function KanbanCard({ card }: Props) {
    const queryClient = useQueryClient();

    const handleDeleteCard = async() => {
        await deleteCard(card.id);
        queryClient.invalidateQueries({ queryKey: ["cards", card.list_id]});
    }
    return (
        <div className="group relative bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors">
          <p className="text-white text-sm break-words">{card.title}</p>
          <button
            onClick={handleDeleteCard}
            className="absolute top-0 right-1 opacity-0 hover:text-red-600 text-xs group-hover:opacity-50"
            >
            x
            </button>
        </div>
    )
}

export default KanbanCard;