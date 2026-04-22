import type { Card } from "../types";
import { deleteCard } from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSortable } from '@dnd-kit/react/sortable';

interface Props {
    card: Card,
    index: number
}

function KanbanCard({ card , index }: Props) {
    const queryClient = useQueryClient();

    const { ref } = useSortable({ id: card.id, index, group: card.list_id });

    const handleDeleteCard = async() => {
        await deleteCard(card.id);
        queryClient.invalidateQueries({ queryKey: ["cards", card.list_id]});
    }
    return (
        <div ref={ref} className="group relative bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors">
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