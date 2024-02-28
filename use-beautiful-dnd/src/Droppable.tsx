import React, { HTMLProps, ReactNode, createContext, useContext } from "react"
import { DroppableProps, Droppable as DnDDroppable, DroppableStateSnapshot } from "react-beautiful-dnd"

const DroppableCtx = createContext<DroppableStateSnapshot>({} as any)
export const useDroppableSnapshot = () => useContext(DroppableCtx)

type DropProps = Omit<DroppableProps, 'children'>
export type Props = DropProps & {
  children?: ReactNode
  divProps?: HTMLProps<HTMLDivElement>
}
/** Exactly the same as `react-beautiful-dnd`'s `Droppable`, without the ugly render props.
 * - `children`: actual, normal children
 * - `divProps`: passed to the droppable `<div>` element,, e.g `style` or `className`
 * - Want to use `snapshot`? Use `useDroppableSnapshot`
 * 
 * ```jsx
 * import { Droppable, useDroppableSnapshot } from 'use-beautiful-dnd'
 * 
 * function Child() {
 *   const snapshot = useDroppableSnapshot()
 *   // ...
 * }
 * 
 * <Droppable droppableId='...'>
 *   <Child />
 * <Droppable>
 */
export function Droppable({children, divProps, ...props}: Props) {
  return (
    <DnDDroppable {...props}>
      {({ droppableProps, innerRef, placeholder }, snapshot) => (
        <div {...divProps} {...droppableProps} ref={innerRef}>
          <DroppableCtx.Provider value={snapshot}>
            {children}
          </DroppableCtx.Provider>
          {placeholder}
        </div>
      )}
    </DnDDroppable>
  )
}

export default Droppable