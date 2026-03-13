export interface Option {
    id: number
    poll_id: number
    label: string
    votes: number
}

export interface Poll {
    id: number
    question: string
    options: Option[]
}
