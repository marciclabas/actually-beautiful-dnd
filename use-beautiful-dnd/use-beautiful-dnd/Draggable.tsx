import React, { HTMLProps, ReactNode, createContext, useContext } from "react"
import { DraggableProps, Draggable as DnDDraggable, DraggableStateSnapshot, DraggableRubric } from "react-beautiful-dnd"

export type DraggableContext = {
  snapshot: DraggableStateSnapshot
  rubric: DraggableRubric
}

const DraggableCtx = createContext<DraggableContext>({} as any)

export const useDraggableContext = () => useContext(DraggableCtx)

type DragProps = Omit<DraggableProps, 'children'>
export type Props = DragProps & {
  divProps?: HTMLProps<HTMLDivElement>
  children?: ReactNode
}
/** Exactly the same as `react-beautiful-dnd`'s `Draggable`, without the ugly render props.
 * - `children`: actual, normal children
 * - `divProps`: passed to the draggable `<div>` element, e.g `style` or `className`
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
export function Draggable({children, divProps, ...props}: Props) {
  return (
    <DnDDraggable {...props}>
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