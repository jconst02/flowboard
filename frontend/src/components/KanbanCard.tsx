import type { Card } from "../types";
import { useSortable } from '@dnd-kit/react/sortable';

interface Props {
    card: Card,
    index: number,
    listId: string,
    lockedCards: Set<string>,
    onDelete: () => void
}

function KanbanCard({ card , index, listId, lockedCards, onDelete }: Props) {

    const { ref } = useSortable({ 
        id: card.id, 
        index, 
        group: listId,
        type: 'item',
        accept: 'item',
        disabled: lockedCards.has(card.id)
    });


    return (
        <div ref={ref} className={`group relative rounded-lg p-3 transition-colors ${
            lockedCards.has(card.id)
            ? 'bg-gray-600 opacity-50 cursor-not-allowed ring-2 ring-blue-400'
            : 'hover:bg-gray-600 bg-gray-700 cursor-pointer'
        }`}>
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