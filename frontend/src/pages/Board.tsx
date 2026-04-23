import { useState, useEffect } from "react"
import CreateModal from "../components/CreateModal";
import { createCard, createList, deleteCard, getCardsByBoard, getLists, moveCard } from "../api/api";
import { useLists } from "../hooks/useLists";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import ListColumn from "../components/ListColumn";
import { DragDropProvider } from "@dnd-kit/react";
import { useCards } from "../hooks/useCards";
import type { Card, List } from "../types";
import { move } from "@dnd-kit/helpers"
import { isSortable } from "@dnd-kit/react/sortable"

function Board() {
  const { boardId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const [lists, setLists] = useState<List[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [items, setItems] = useState<Record<string, Card[]>>({});

  const buildItems = (lists: List[], cards: Card[]) => {
    const byList = lists.reduce((acc, list) => {
      acc[list.id] = []
      return acc;
    }, {} as Record<string, Card[]>);

    cards.forEach(card => {
      byList[card.list_id]?.push(card);
    });

    return byList;
  }

  useEffect(() => {
    if (!boardId) return;

    Promise.all([
      getLists(boardId),
      getCardsByBoard(boardId)
    ]).then(([lists, cards]) => {
      setLists(lists);
      setCards(cards);
      setItems(buildItems(lists, cards));
    });
  },[boardId]);

  //updeta this. i think group is wrong. get new group. redo func pretty much
  const handleDrag = async (event) => {
    console.log("handleDrag fired", event)
    const { operation, canceled } = event;
    if (canceled) return;

    const { source } = operation;
    const { initialIndex, index, initialGroup, group } = source;

    if (initialIndex === index && initialGroup === group) return;

    moveCard(source.id, group, index);
  }

  //idk somethign here: TODO: FIX THSI AND MAYBE HANDLE DRAG TO ALLOW TO DRAG OVER
  const handleDragOver = async(event) => {
    const { source, target } = event.operation
    if (!isSortable(source)) return
    if (isSortable(target) && source.group === target.group) return
    setItems(items => move(items, event))
  }

  const handleCreate = async(title: string) => {
    const newList = await createList(title, boardId);
    setLists(prev => [...prev, newList])
    setItems(prev => ({ ...prev, [newList.id]: [] }))
    setShowModal(false)
  }

  const handleDeleteCard = (cardId: string, listId: string) => {
    deleteCard(cardId)
    setItems(prev => ({
      ...prev,
      [listId]: prev[listId].filter(c => c.id !== cardId)
    }))
    console.log(items);
  }

  // const handleDeleteCard = async (cardId: string, listId: string) => {
  //   await deleteCard(cardId)
  //   const newCards = await getCardsByBoard(boardId!)
  //   setCards(newCards)
  //   setItems(buildItems(lists, newCards))
  // }

  const handleAddCard = async (title: string, listId: string) => {
    const newCard = await createCard(title, listId, boardId!);
    console.log(newCard);
    setItems(prev => ({
      ...prev,
      [listId]: [...(prev[listId] ?? []), newCard]
    }))
  }

  return (
    <DragDropProvider onDragEnd={handleDrag} onDragOver={handleDragOver}>
      <div className="bg-gray-950 text-white p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Add list
          </button>
        </div>

        <div className="grid grid-flow-col auto-cols-[200px] overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
          {lists?.map(list => (
            <ListColumn key={list.id} list={list} cards={items[list.id]} onDeleteCard={handleDeleteCard} onAddCard={handleAddCard}/>
          ))}
        </div>
        
        {showModal && (
          <CreateModal
            title="Create List"
            placeholder="list title"
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
          />
        )}
      </div>
    </DragDropProvider>
  )
}

export default Board;