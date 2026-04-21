import { useState } from "react"

interface Props {
    title: string
    placeholder: string
    onClose: () => void
    onSubmit: (title: string) => void
}


function CreateModal({ title, placeholder, onClose, onSubmit } : Props) {
    const [input, setInput] = useState("");

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-white">{title}</h2>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-500 rounded px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2 mt-3">
                    <button 
                        onClick={onClose} 
                        className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={!input}
                        onClick={() => onSubmit(input)} 
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateModal;