import React, { HTMLProps, createContext, useContext } from "react"
import { DraggableProps, Draggable as DnDDraggable, DraggableStateSnapshot, DraggableRubric } from "react-beautiful-dnd"

const DraggableCtx = createContext<{
  snapshot: DraggableStateSnapshot
  rubric: DraggableRubric
}>({} as any)

export const useDraggableContext = () => useContext(DraggableCtx)

type DragProps = Omit<DraggableProps, 'children'>
export type Props = DragProps & HTMLProps<HTMLDivElement>
/** Exactly the same as `react-beautiful-dnd`'s `Draggable`, without the ugly render props.
 * - `children`: actual, normal children
 * - Supports any props you'd pass to a normal `<div>`, e.g `style` or `className`
 * - Want to use `snapshot` or `rubric`? Use `useDraggableContext`
 * 
 * ```jsx
 * import { Draggable, useDraggableContext } from 'use-beautiful-dnd'
 * 
 * function Child() {
 *   const { snapshot, rubric } = useDraggableContext()
 *   // ...
 * }
 * 
 * <Draggable draggableId='...' index={...}>
 *   <Child />
 * <Draggable />
 * ```
 */
export function Draggable({children, ...props}: Props) {
  const { draggableId, index, disableInteractiveElementBlocking, isDragDisabled, shouldRespectForcePress, ...divProps } = props
  const dragProps: DragProps = { draggableId, index, disableInteractiveElementBlocking, isDragDisabled, shouldRespectForcePress }
  return (
    <DnDDraggable {...dragProps}>
      {({ dragHandleProps, draggableProps, innerRef }, snapshot, rubric) => (
        <div ref={innerRef} {...dragHandleProps} {...draggableProps} {...divProps}>
          <DraggableCtx.Provider value={{snapshot, rubric}}>
            {children}
          </DraggableCtx.Provider>
        </div>
      )}
    </DnDDraggable>
  )
}

export default Draggable