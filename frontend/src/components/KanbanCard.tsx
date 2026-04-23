import type { Card } from "../types";
import { useSortable } from '@dnd-kit/react/sortable';

interface Props {
    card: Card,
    index: number,
    onDelete: () => void
}

function KanbanCard({ card , index, onDelete }: Props) {

    const { ref } = useSortable({ 
        id: card.id, 
        index, 
        group: card.list_id,
        type: 'item',
        accept: 'item'
    });


    return (
        <div ref={ref} className="group relative bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors">
          <p className="text-white text-sm break-words">{card.title}</p>
          <button
            onClick={onDelete}
            className="absolute top-0 right-1 opacity-0 hover:text-red-600 text-xs group-hover:opacity-50"
            >
            x
            </button>
        </div>
    )
}

export default KanbanCard;