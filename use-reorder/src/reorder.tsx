import React, { ReactNode,  useMemo, useState } from "react";
import { Direction, DragDropContext, DropResult, SensorAPI } from "react-beautiful-dnd";
import { useAnimationSensor, Draggable, Droppable, useDraggableContext } from "use-beautiful-dnd";
import { range, equals } from './util/arrays'

export type ItemProps = {
  idx: number
  dragging: boolean
}
export type Item = {
  elem(props: ItemProps): ReactNode
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
  reorderer: JSX.Element
  order: number[]
  setOrder(order: number[]): void
  ordered: Item[]
  dirty: boolean
  animate: SensorAPI | null
}

function wrapper(idx: number, elem: Item['elem']) {
  const { snapshot } = useDraggableContext()
  snapshot.
}

/** #### DOESN'T WORK WITH <React.StrictMode> */
export function useReorder(items: Item[], config?: Config): Hook {

  const startOrder = useMemo(() => [...range(items.length)], [items.length])
  const [order, setOrder] = useState(startOrder);
  const dirty = equals(order, startOrder)

  const onDragEnd = (result: DropResult) => {
    console.log('Drag result', result)
    if (result.destination?.index === undefined)
      return
    const newItems = Array.from(order);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    console.log('new order:', newItems)
    setOrder(newItems);
  };

  const ordered = order.map((i) => items[i]);
  const { sensor, api } = useAnimationSensor()

  const reorderer = (
    <DragDropContext onDragEnd={onDragEnd} sensors={[sensor]}>
      <Droppable droppableId='whatever'>
        {ordered.map((item, i) => (
          <Draggable key={item.id} draggableId={item.id} index={i} isDragDisabled={config?.disabled}>
            {item.elem(i)}
          </Draggable>
        ))}
      </Droppable>
    </DragDropContext>
  );

  return { reorderer, order, ordered, dirty, setOrder, animate: api };
}
