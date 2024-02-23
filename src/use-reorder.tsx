import React, { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Config, Hook, Item } from ".";
import { range, equals } from './util'

/** #### DOESN'T WORK WITH <React.StrictMode> */
export function useReorder(items: Item[], config?: Config): Hook {

  const startOrder = useMemo(() => [...range(items.length)], [items.length])
  const [order, setOrder] = useState(startOrder);
  const dirty = equals(order, startOrder)

  useEffect(() => {
    console.debug('Items', items)
    console.debug('Order', order)
  }, [items, order])

  function reset() {
    setOrder(startOrder)
  }

  const onDragEnd = (result: DropResult) => {
    if (result.destination?.index === undefined) {
      return;
    }
    const newItems = Array.from(order);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    setOrder(newItems);
  };

  const ordered = order.map((i) => items[i]);

  const reorderer = (
    <>
      <style>
      {`.use-reorder-card > * {
          display: inline-block;
        }`
      }
      </style>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {ordered.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={config?.disabled}>
                  {(provided) => (
                    <div className="use-reorder-card"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.elem(index)}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );

  return { reorderer, order, ordered, dirty, reset };
}
