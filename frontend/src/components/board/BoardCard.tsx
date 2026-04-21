import { useNavigate } from "react-router-dom"

export default function BoardCard({ board }) {
    const navigate = useNavigate();

    return (
      <div className="p-6 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={() => navigate(`/board/${board.id}`)}>
        <p className="font-semibold text-white">{board.title}</p>
      </div>
    )
  }