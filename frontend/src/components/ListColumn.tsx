import { createCard } from "../api/api";
import { useCards } from "../hooks/useCards";
import type { List } from "../types";
import KanbanCard from "./KanbanCard";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
    list: List
}

function ListColumn({ list }: Props) {
  const { data: cards } = useCards(list.id);

  const queryClient = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("")
  
  const handleAddCard = async() => {
    await createCard(title, list.id);
    queryClient.invalidateQueries({ queryKey: ["cards", list.id]} )
    setAdding(false);
    setTitle("");
  }

    return (
      <div className="flex flex-col bg-gray-800 rounded-none p-4 flex-shrink-0 border-r border-gray-700">
        <h3 className="font-semibold text-white text-center mb-3">{list.title}</h3>
        {cards?.map(card => (
            <KanbanCard key={card.id} card={card}></KanbanCard>
        ))}
        { adding ? (
          <div className="mt-2">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Card title"
                className="w-full bg-gray-700 rounded text-white px-3 py-2 text-sm outline-none"
              />
            <div className="flex gap-2 mt-2">
              <button onClick={handleAddCard} disabled={!title} className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed">Add</button>
              <button onClick={() => setAdding(false)} className="px-2 py-1 bg-gray-600 text-white rounded text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setAdding(true)}
            className="mt-3 text-gray-400 hover:text-white text-sm w-full"
          >
            Add item
          </button>
        )}
      </div>
    )
}

export default ListColumn;