import { useState } from "react"
import CreateModal from "../components/CreateModal";
import { createList } from "../api/api";
import { useLists } from "../hooks/useLists";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import ListColumn from "../components/ListColumn";

function Board() {
  const { boardId } = useParams();
  const { data: lists } = useLists(boardId); 

  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async(title: string) => {
    await createList(title, boardId);
    queryClient.invalidateQueries({ queryKey: ["lists", boardId]} )
    setShowModal(false)
  }

  return (
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
          <ListColumn key={list.id} list={list} />
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
  )
}

export default Board;