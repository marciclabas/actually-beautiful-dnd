import React, { MutableRefObject, ReactNode,  useMemo, useState } from "react";
import { Direction, DragDropContext, DropResult, SensorAPI, useKeyboardSensor, useMouseSensor } from "react-beautiful-dnd";
import { useAnimationSensor, Draggable, Droppable, useDraggableContext, useTouchSensor, TouchConfig, DraggableContext } from "use-beautiful-dnd";
import { range, equals } from './util/arrays'
import { reorder } from "./util/reorder";

export type ItemProps = DraggableContext & {
  idx: number
}
export type Item = {
  elem(props: ItemProps): ReactNode
  id: string
}

export type Config = TouchConfig & {
  disabled?: boolean
  direction?: Direction
}

/**
* - `reorderer`: actual reorder component
* - `order`: current order, 0-indexed respect to parameter `items`
* - `ordered`: `items` in the current order
* - `dirty`: whether `items != ordered` (ie., whether the order has changed)
* - `api`: `SensorAPI` to programmatically animate items
*/
export type Hook = {
  reorderer: JSX.Element
  order: number[]
  setOrder(order: number[]): void
  ordered: Item[]
  dirty: boolean
  api: MutableRefObject<{ promise: Promise<SensorAPI> }>
}

const withContext = (idx: number) => (Elem: Item['elem']) => {
  const ctx = useDraggableContext()
  return <Elem idx={idx} {...ctx} />
}

/** #### DOESN'T WORK WITH <React.StrictMode> */
export function useReorder(items: Item[], config?: Config): Hook {

  const startOrder = useMemo(() => range(items.length), [items.length])
  const [order, setOrder] = useState(startOrder);
  const dirty = equals(order, startOrder)

  const onDragEnd = (result: DropResult) => {
    if (result.destination?.index === undefined)
      return
    const newOrder = reorder(order, result.source.index, result.destination.index)
    setOrder(newOrder)
  };

  const ordered = order.map((i) => items[i]);
  const { sensor, apiRef } = useAnimationSensor()

  const touch = useTouchSensor(config)

  const reorderer = (
    <DragDropContext onDragEnd={onDragEnd} sensors={[sensor, touch, useKeyboardSensor, useMouseSensor]} enableDefaultSensors={false}>
      <Droppable droppableId='whatever'>
        {ordered.map((item, i) => (
          <Draggable key={item.id} draggableId={item.id} index={i} isDragDisabled={config?.disabled}>
            {withContext(i)(item.elem)}
          </Draggable>
        ))}
      </Droppable>
    </DragDropContext>
  );

  return { reorderer, order, ordered, dirty, setOrder, api: apiRef };
}
