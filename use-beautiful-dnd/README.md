# Use Beautiful DND

> Like `react-beautiful-dnd`, without the ugly code (ehem render props).

## Usage

> Same as `react-beautiful-dnd`, except we handle the render props for you

```jsx
import { DragDropContext } from 'react-beautiful-dnd'
import { Droppable, Draggable, useDraggableContext } from 'use-beautiful-dnd'

function Demo() {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='...'>
        <Draggable key='...' draggableId='...' index={0}>
          <Component />
        </Draggable>
      </Droppable>
    </DragDropContext>
  )
}

function Component() {
  const { snapshot, rubric } = useDraggableContext()

  // ...
}
```