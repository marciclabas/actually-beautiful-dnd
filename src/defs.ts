import { ReactNode } from "react"

export type Item = {
    elem(idx: number): ReactNode
    id: string
}

export type Config = {
    disabled?: boolean
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
    reset(): void
}