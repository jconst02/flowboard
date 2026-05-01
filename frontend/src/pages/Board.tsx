import { useState, useEffect, useRef } from "react"
import CreateModal from "../components/CreateModal";
import { createCard, createList, deleteCard, deleteList, getBoard, getCardsByBoard, getLists, moveCard } from "../api/api";
import { useParams } from "react-router-dom"
import ListColumn from "../components/ListColumn";
import { DragDropProvider } from "@dnd-kit/react";
import type { Card, List } from "../types";
import { move } from "@dnd-kit/helpers"
import { isSortable } from "@dnd-kit/react/sortable"
import { io } from "socket.io-client";

function Board() {
  const { boardId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const [lists, setLists] = useState<List[]>([]);
  const [items, setItems] = useState<Record<string, Card[]>>({});
  const [boardTitle, setBoardTitle] = useState("");
  const socketRef = useRef(null);

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
      getBoard(boardId),
      getLists(boardId),
      getCardsByBoard(boardId)
    ]).then(([board, lists, cards]) => {
      setBoardTitle(board.title);
      setLists(lists);
      setItems(buildItems(lists, cards));
    });
  },[boardId]);

  useEffect(() => {
    if (!boardId) return;

    const socket = io(import.meta.env.VITE_API_URL);
    socketRef.current = socket;
    socket.emit("join-board", boardId);

    socket.on("card-moved", ({card, oldListId}) => {
      
      setItems(prev => {
        const updated = { ...prev };

        updated[oldListId] = prev[oldListId]?.filter(c => c.id !== card.id) ?? [];

        const newList = [...(updated[card.list_id] ?? [])];
        newList.splice(card.position, 0, card);
        updated[card.list_id] = newList

        return updated
      })
    })

    socket.on("card-added", ({ card }) => {
      setItems(prev => {
        const updated = { ...prev }

        const newList = [...(updated[card.list_id] ?? [])];
        newList.splice(card.position, 0, card);
        updated[card.list_id] = newList;

        return updated;
      })
    })

    socket.on("card-deleted", ({ cardId, listId }) => {
      setItems(prev => {
        const updated = { ...prev };
        
        updated[listId] = prev[listId]?.filter(c => c.id !== cardId) ?? [];
        return updated;
      })
    })

    return () => {
      socket.disconnect();
    }
  }, [boardId]);

  //updeta this. i think group is wrong. get new group. redo func pretty much. WORKS I THINK
  const handleDragEnd = async (event) => {
    const { operation, canceled } = event;

    if (canceled) return;

    const { source } = operation;

    const newListId = source.group;
    const newIndex = source.index;

    if (!newListId) return;

    setItems(prev => ({
      ...prev,
      [newListId]: prev[newListId].map(card =>
        card.id === source.id ? { ...card, list_id: newListId } : card
      )
    }));

    await moveCard(source.id, newListId, newIndex, socketRef.current?.id);
  }

  //5db is im moving from. 12b is where im dropping

  //idk somethign here: TODO: FIX THSI AND MAYBE HANDLE DRAG TO ALLOW TO DRAG OVER/ FIXED I THINK
  const handleDragOver = async(event) => {
    const { source } = event.operation
    if (!isSortable(source)) return
    setItems(items => move(items, event))
  }

  const handleCreateList = async(title: string) => {
    const newList = await createList(title, boardId);
    setLists(prev => [...prev, newList])
    setItems(prev => ({ ...prev, [newList.id]: [] }))
    setShowModal(false)
  }

  const handleDeleteList = async(listId: string) => {
    await deleteList(listId);
    setLists(prev => prev.filter(l => l.id !== listId));
    setItems(prev => {
      const updated = { ...prev }
      delete updated[listId]
      return updated
    })
  }

  const handleDeleteCard = async (cardId: string, listId: string) => {
    await deleteCard(cardId, socketRef.current?.id);
    setItems(prev => ({
      ...prev,
      [listId]: prev[listId].filter(c => c.id !== cardId)
    }))
    console.log(items);
  }

  const handleAddCard = async (title: string, listId: string) => {
    const newCard = await createCard(title, listId, boardId!, socketRef.current?.id);
    console.log(newCard);
    setItems(prev => ({
      ...prev,
      [listId]: [...(prev[listId] ?? []), newCard]
    }))
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="bg-gray-950 text-white p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">{boardTitle}</h3>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Add list
          </button>
        </div>

        <div className="grid grid-flow-col auto-cols-[200px] overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
          {lists?.map(list => (
            <ListColumn 
              key={list.id} 
              list={list} 
              cards={items[list.id]}
              onDeleteList={handleDeleteList}
              onDeleteCard={handleDeleteCard} 
              onAddCard={handleAddCard}
            />
          ))}
        </div>
        
        {showModal && (
          <CreateModal
            title="Create List"
            placeholder="list title"
            onClose={() => setShowModal(false)}
            onSubmit={handleCreateList}
          />
        )}
      </div>
    </DragDropProvider>
  )
}

export default Board;