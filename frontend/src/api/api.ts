const BASE_URL = import.meta.env.VITE_API_URL

//BOARDS
export const createBoard = async (title: string, userId: string) => {
    const res = await fetch(`${BASE_URL}/boards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, user_id: userId })
    })
    return res.json();
}

export const getBoards = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/boards?user_id=${userId}`);
  return res.json();
}