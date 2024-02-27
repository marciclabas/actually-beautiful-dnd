import React, { HTMLProps, createContext, useContext } from "react"
import { DroppableProps, Droppable as DnDDroppable, DroppableStateSnapshot } from "react-beautiful-dnd"

const DroppableCtx = createContext<DroppableStateSnapshot>({} as any)
export const useDroppableSnapshot = () => useContext(DroppableCtx)

type DropProps = Omit<DroppableProps, 'children'>
export type Props = DropProps & HTMLProps<HTMLDivElement>
/** Exactly the same as `react-beautiful-dnd`'s `Droppable`, without the ugly render props.
 * - `children`: actual, normal children
 * - Supports any props you'd pass to a normal `<div>`, e.g `style` or `className`
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
export function Droppable({children, ...props}: Props) {
  const {
    droppableId, direction, getContainerForClone, ignoreContainerClipping,
    isCombineEnabled, isDropDisabled, mode, renderClone, type, ...divProps
  } = props
  const dropProps: DropProps = { droppableId, direction, getContainerForClone, ignoreContainerClipping, isCombineEnabled, isDropDisabled, mode, renderClone, type }
  return (
    <DnDDroppable {...dropProps}>
      {({ droppableProps, innerRef, placeholder }, snapshot) => (
        <div {...droppableProps} ref={innerRef} {...divProps}>
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