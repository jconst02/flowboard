import type { Card } from "../types";

interface Props {
    card: Card
}

function KanbanCard({ card }: Props) {
    return (
        <div className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors">
          <p className="text-white text-sm break-words">{card.title}</p>
        </div>
    )
}

export default KanbanCard;