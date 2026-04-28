import { useNavigate } from "react-router-dom"
import type { Board } from "../../types";

interface Props {
  board: Board,
  onDelete: (boardId: string) => void
}

function BoardCard({ board, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div className="group relative p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={() => navigate(`/board/${board.id}`)}>
      <p className="font-semibold text-white">{board.title}</p>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(board.id)
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        X
      </button>
    </div>
  )
}

export default BoardCard;