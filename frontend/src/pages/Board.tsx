import { useState, useEffect, useRef } from "react"
import CreateModal from "../components/CreateModal";
import { createCard, createList, deleteCard, deleteList, getBoard, getCardsByBoard, getLists, moveCard } from "../api/api";
import { useParams } from "react-router-dom"
import ListColumn from "../components/ListColumn";
import { DragDropProvider } from "@dnd-kit/react";
import type { Card, List, UserPresence } from "../types";
import { move } from "@dnd-kit/helpers"
import { isSortable } from "@dnd-kit/react/sortable"
import { io } from "socket.io-client";
import { useUser } from '@clerk/react';
import PresenceBar from "../components/PresenceBar";

function Board() {
  const { boardId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const [lists, setLists] = useState<List[]>([]);
  const [items, setItems] = useState<Record<string, Card[]>>({});
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
  const [cursors, setCursor] = useState<Record<string, { x: number, y: number, userName: string}>>({});
  const [lockedCards, setLockedCards] = useState<Set<string>>(new Set());
  const [boardTitle, setBoardTitle] = useState("");
  const socketRef = useRef(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });
  },[boardId]);

  useEffect(() => {
    if (!boardId) return;

    const socket = io(import.meta.env.VITE_API_URL);
    socketRef.current = socket;

    socket.emit("join-board", {
      boardId,
      userId: user?.id,
      userName: user?.fullName,
      userAvatar: user?.imageUrl
    });

    socket.on("presence-update", (users) => {
      setActiveUsers(users);
      console.log(users);
    })

    socket.on("card-moved", ({card, oldListId}) => {
      setItems(prev => {
        // const updated = { ...prev };
        // updated[oldListId] = prev[oldListId]?.filter(c => c.id !== card.id) ?? [];
        const updated = Object.fromEntries(
          Object.entries(prev).map(([id, cards]) => [
            id, cards.filter(c => c.id !== card.id)
          ])
        )

        const newList = [...(updated[card.list_id] ?? [])];
        newList.splice(card.position, 0, card);
        updated[card.list_id] = newList;
        return updated;
      })
    })

    socket.on("card-created", ({ card }) => {
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

    socket.on("list-created", ({ list }) => {
      //TODO: potentially sort this cuz when 2 users create lists at the same time there is a chance one of theirs is out of position visually
      setLists(prev => [...prev, list]);
      setItems(prev => ({...prev, [list.id]: []}));
    })

    socket.on("list-deleted", (listId: string) => {
      setLists(prev => prev.filter(l => l.id !== listId));
      setItems(prev => {
        const updated = { ...prev };
        delete updated[listId];
        return updated;
      });
    })

    const handleMouseMove = (e: MouseEvent) => {
      socket.emit("cursor-move", { boardId, x: e.clientX, y: e.clientY, userName: user?.fullName });
    }
    window.addEventListener("mousemove", handleMouseMove);

    socket.on("cursor-move", ({ socketId, x, y, userName }) => {
      setCursor(prev => ({ ...prev, [socketId]: { x, y, userName }}))
    })


    const handleMouseLeave = () => {
      console.log("check")
      socket.emit("cursor-leave", { boardId });
    }
    document.addEventListener("mouseleave", handleMouseLeave);

    socket.on("cursor-leave", ({ socketId }) => {
      setCursor(prev => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      })
    })

    socket.on("card-drag-start", ({ cardId }) => {
      setLockedCards(prev => new Set(prev).add(cardId));
    })

    socket.on("card-dragging", ({ cardId, listId, index}) => {
      setItems(prev => {
        let movingCard: Card | undefined;
        //remove cardId from whatever list it is in
        const updated = Object.fromEntries(
          Object.entries(prev).map(([id, cards]) => {
            const filtered = cards.filter(card => {
              if (card.id === cardId) {
                movingCard = card;
                return false;
              }
              return true;
            });

            return [id, filtered];
          })
        );
        if (!movingCard) return prev;
        const newList = [...(updated[listId] ?? [])];
        const newIndex = Math.min(index, newList.length);
        newList.splice(newIndex, 0, movingCard);
        updated[listId] = newList;
        return updated;
      })
    })

    socket.on("card-drag-end", ({ cardId }) => {
      setLockedCards(prev => {
        const locked = new Set(prev);
        locked.delete(cardId);
        return locked;
      })
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      socket.disconnect();
    }
  }, [boardId]);

  //updeta this. i think group is wrong. get new group. redo func pretty much. WORKS I THINK
  //TODO: add socket event to make card not drabale on others end
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
    socketRef.current?.emit("card-drag-end", { boardId, cardId: source.id });
  }

  //5db is im moving from. 12b is where im dropping

  //idk somethign here: TODO: FIX THSI AND MAYBE HANDLE DRAG TO ALLOW TO DRAG OVER/ FIXED I THINK
  //TODO: socket event to display card being dragged on other end
  const handleDragOver = async(event) => {
    const { source, target } = event.operation;
    if (!isSortable(source)) return;

    setItems(items => move(items, event));

    if (target?.id == null) return;

    const listId = lists.some(l => l.id === target.id) ? target.id : target.group;
    
    socketRef.current?.emit("card-dragging", {
      boardId,
      cardId: source.id,
      listId,
      index: source.index
    })
  }

  //TODO: socket even wehn starting to drag to make cardl locked on others
  const handleDragStart = async(event) => {
    const { source } = event.operation;
    
    console.log(source);
    socketRef.current.emit("card-drag-start", { boardId, cardId: source.id })
  }

  const handleCreateList = async(title: string) => {
    const newList = await createList(title, boardId, socketRef.current?.id);
    setLists(prev => [...prev, newList])
    setItems(prev => ({ ...prev, [newList.id]: [] }))
    setShowModal(false)
  }

  const handleDeleteList = async(listId: string) => {
    await deleteList(listId, socketRef.current?.id);
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
    <DragDropProvider onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart}>
      <div className="bg-gray-950 text-white p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">{boardTitle}</h3>

          <PresenceBar users={activeUsers} />
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            Add list
          </button>
        </div>

        <div className="grid grid-flow-col auto-cols-[200px] overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
          {!loading && lists?.length === 0 && (
            <p className="text-gray-500">No lists yet - add one to get started.</p>
          )}
          {lists?.map(list => (
            <ListColumn 
              key={list.id} 
              list={list} 
              cards={items[list.id]}
              lockedCards={lockedCards}
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
      {Object.entries(cursors).map(([socketId, {x, y, userName }]) => (
        <div
          key={socketId}
          className="fixed pointer-events-none z-50"
          style={{left: x, top: y }}
        >
          <div className="w-2 h-2 rounded-full bg-blue-500"/>
          <span className="text-xs text-white bg-blue=500 px-1 rounded ml-1 whitespace-nowrap"></span>
          {userName}
        </div>
      ))}
    </DragDropProvider>
  )
}

export default Board;