import { DropResult } from "react-beautiful-dnd"
import { reorder } from "./reorder"
import * as maps from './maps'
import { insert, remove } from "ramda"

export function multiReorder(multiOrder: Map<string, number[]>, result: DropResult): Map<string, number[]> {
  const { destination: dest, source: src } = result
  if (!dest)
    return multiOrder
  if (dest.droppableId === src.droppableId) {
    // reorder a single list
    const id = dest.droppableId
    const order = multiOrder.get(id)
    if (!order) {
      console.warn(`DroppableId '${id}' not found in 'multiOrder'!`)
      return multiOrder
    }
    const newOrder = reorder(order, src.index, dest.index)
    return maps.insert(multiOrder, id, newOrder)
  }
  else {
    // insert in dest, remove from src
    const from = multiOrder.get(src.droppableId)
    if (!from) {
      console.warn(`Source DroppableId '${src.droppableId}' not found in 'multiOrder'!`)
      return multiOrder
    }
    const to = multiOrder.get(dest.droppableId)
    if (!to) {
      console.warn(`Destination DroppableId '${dest.droppableId}' not found in 'multiOrder'!`)
      return multiOrder
    }
    const newTo = insert(dest.index, from[src.index], to)
    const newFrom = remove(src.index, 1, from)
    return maps.update(multiOrder, [[src.droppableId, newFrom], [dest.droppableId, newTo]])
  }
}
