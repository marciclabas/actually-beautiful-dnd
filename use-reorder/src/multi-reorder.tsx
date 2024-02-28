import React, { HTMLProps, useEffect, useState } from "react"
import { Draggable, DraggableContext, Droppable, useDraggableContext } from "use-beautiful-dnd"
import { DropResult, DroppableId } from "react-beautiful-dnd"
import { range } from "./util/arrays"
import { multiReorder } from "./util/multi-reorder"

export type ItemProps = DraggableContext & {
  idx: number
  list: number
}

export type Item = {
  elem(props: ItemProps): JSX.Element
  id: string
  draggableProps?: HTMLProps<HTMLDivElement>
}
export type List = {
  id: string
  droppableProps?: HTMLProps<HTMLDivElement>
}

export type IdOrder = Map<DroppableId, number[]>
export type IdxOrder = number[][]

export type Config<Order = IdOrder> = {
  startOrder?: Order
  droppableProps?: HTMLProps<HTMLDivElement>
  draggableProps?: HTMLProps<HTMLDivElement>
}

export type Hook<Order = IdOrder> = {
  onDragEnd(result: DropResult): void
  lists: JSX.Element[]
  order: Order
}

const withContext = (list: number, idx: number) => (Elem: Item['elem']) => {
  const ctx = useDraggableContext()
  return <Elem idx={idx} list={list} {...ctx} />
}

function emptyOrder(numItems: number, listIds: DroppableId[]): IdOrder {
  return new Map([
    [listIds[0], range(numItems)],
    ...listIds.slice(1).map((id): [string, number[]] => [id, []])
  ])
}

type DivProps = HTMLProps<HTMLDivElement>
function droppableProps(listProps?: DivProps, configProps?: DivProps): DivProps {
  const {style, ...props} = {...listProps, ...configProps}
  return {...props, style: { width: '100%', height: '100%', ...style}}
}

/** #### DOESN'T WORK WITH <React.StrictMode>
 * 
 * ```jsx
 * import { DragDropContext } from 'react-beautiful-dnd'
 * import { useMultiReorder } from 'use-reorder'
 * 
 * const items = [
 *   { id: 'item1', item: (...) => <div>...</div> },
 *   { id: 'item2', item: (...) => <div>...</div> },
 *   ...
 * ]
 * const listIds = [{id: 'list1'}, {id: 'list2'}, ...]
 * const { onDragEnd, lists, order } = useMultiReorder(items, listIds)
 * 
 * return (
 *   <DragDropContext onDragEnd={onDragEnd}>
 *      ...
 *      {lists.map(list => (
 *        <div>{list}</div>
 *      ))}
 *   </DragDropContext>
 * )
 * ```
 */
export function useMultiReorder(items: Item[], listIds: List[], config?: Config): Hook {

  const startOrder = config?.startOrder ?? emptyOrder(items.length, listIds.map(l => l.id))
  const [order, setOrder] = useState(startOrder)

  function onDragEnd(r: DropResult) {
    setOrder(order => multiReorder(order, r))
  }

  const lists = listIds.map((list, listIdx) => (
    <Droppable droppableId={list.id}
      divProps={droppableProps(list.droppableProps, config?.droppableProps)}
    >
      {order.get(list.id)!.map((i, idx) => (
        <Draggable key={items[i].id} draggableId={items[i].id} index={idx}
          divProps={{...items[i].draggableProps, ...config?.draggableProps}}
        >
          {withContext(listIdx, idx)(items[i].elem)}
        </Draggable>
      ))}
    </Droppable>
  ))

  return { lists, order, onDragEnd }
}

/** #### DOESN'T WORK WITH <React.StrictMode>
 * 
 * ```jsx
 * import { DragDropContext } from 'react-beautiful-dnd'
 * import { useMultiReorder } from 'use-reorder'
 * 
 * const items = [
 *   { id: 'item1', item: (...) => <div>...</div> },
 *   { id: 'item2', item: (...) => <div>...</div> },
 *   ...
 * ]
 * const numLists = 5
 * const { onDragEnd, lists, order } = useMultiReorder(items, numLists)
 * 
 * return (
 *   <DragDropContext onDragEnd={onDragEnd}>
 *      ...
 *      {lists.map(list => (
 *        <div>{list}</div>
 *      ))}
 *   </DragDropContext>
 * )
 * ```
*/
export function useMultiReorderIdx(items: Item[], numLists: number, config?: Config<IdxOrder>): Hook<IdxOrder> {
  const listIds = range(numLists).map(i => ({ id: `${i}` }))
  const newOrder = config?.startOrder && new Map(config.startOrder.map((idxs, list) => [`${list}`, idxs]))
  console.log('start order:', newOrder)
  const { order: idOrder, ...hook } = useMultiReorder(items, listIds, {...config, startOrder: newOrder})
  const order = listIds.map(list => idOrder.get(list.id)!)
  return { order, ...hook }
}
