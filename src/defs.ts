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

/**
 * - `reorderer`: actual reorder component
 * - `order`: current order, 0-indexed respect to parameter `items`
 * - `ordered`: `items` in the current order
 * - `dirty`: whether `items != ordered` (ie., whether the order has changed)
 */
export type Hook = {
    reorderer: ReactNode
    order: number[]
    ordered: Item[]
    dirty: boolean
}