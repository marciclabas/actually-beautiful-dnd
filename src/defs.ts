import { ReactNode } from "react"
import { Direction } from "react-beautiful-dnd"

export type Item = {
    elem(idx: number): ReactNode
    id: string
}

/**
 * - `reset`: whether to reset the order whenever inputs change
 */
export type Config = {
    disabled?: boolean
    reset?: boolean
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