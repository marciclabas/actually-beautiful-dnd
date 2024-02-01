import { ReactNode } from "react"
import { Direction } from "react-beautiful-dnd"

export type Item = {
    elem: ReactNode
    id: string
}

export type Config = {
    disabled?: boolean
    direction?: Direction
}

export type Hook = {
    reorderer: ReactNode
    order: number[]
    ordered: Item[]
}