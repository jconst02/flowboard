import { useState } from "react"
import CreateModal from "../components/CreateModal";
import { useAuth } from "@clerk/react";
import { useBoards } from "../hooks/useBoards";
import BoardCard from "../components/board/BoardCard";
import { useQueryClient } from "@tanstack/react-query";
import { useApi } from "../hooks/useApi";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const { userId } = useAuth();
  const { data: boards } = useBoards(userId!);
  const queryClient = useQueryClient();
  const api = useApi();

  const handleCreate = async(title: string) => {
    await api.createBoard(title);
    queryClient.invalidateQueries({ queryKey: ["boards", userId]} )
    setShowModal(false)
  }

  const handleDelete = async (boardId: string) => {
    await api.deleteBoard(boardId);
    queryClient.invalidateQueries({ queryKey: ["boards", userId]} );
  }
  
  return (
    <div className="bg-gray-950 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My boards</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          Create board
        </button>
      </div>

      {boards?.length === 0 && (
        <p className="text-gray-500">No boards yet - create one to get started.</p>
      )}
      <div className="grid grid-cols-5 gap-4">
        {boards?.map(board => (
          <BoardCard key={board.id} board={board} onDelete={handleDelete} />
        ))}
      </div>

      {showModal && (
        <CreateModal
          title="Create Board"
          placeholder="Board title"
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  )
}

export default Home;