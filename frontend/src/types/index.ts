export interface Board {
    id: string
    title: string
    user_id: string
    created_at: string
}

export interface List {
    id: string
    title: string
    board_id: string
    position: number
}

export interface Card {
    id: string
    title: string
    list_id: string
    position: number
}