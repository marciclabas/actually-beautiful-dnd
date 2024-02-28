import { useTouchAnimation, TouchConfig } from "framer-animations"
import { useCallback, useEffect, useRef } from "react"
import { SensorAPI } from "react-beautiful-dnd"
import { useAnimationSensor } from "use-beautiful-dnd"
import { managedPromise } from "../util/promises"
import { animate } from "./animations/multi-reorder"
import { usePresence } from "framer-motion"

export type Hook = {
  run(): void
  sensor(s: SensorAPI): void
  animation: JSX.Element
}
export type Config = {
  icon?: TouchConfig
}

/** Dragging hint animation for `useMultiReorder` (or any `react-beautiful-based` multilist)
 * - Requires installing `framer-animations`
 * - **Condider wrapping the component using this hook with `<AnimatePresence>`**
 * - Otherwise, if an animation is running and the component unmounts, `react-beautiful-dnd` will be kind enough to throw an ugly error
 * - Example:
 *    ```jsx
 *    import { AnimatePresence } from 'framer-motion' // already required by `framer-animations`
 *    import { useMultiReorder, MultiItem } from 'use-reorder'
 *    import { useMultiAnimation } from 'use-reorder/dist/animated'
 *    
 * 
 *    function ReorderComponent() {
 *      const { animation, run, sensor } = useMultiAnimation('animated-item')
 *    
 *      const items = [
 *       { id: 'some-item', elem: () => <div>...</div> },
 *       { id: 'animated-item', elem: () => <div style={{position: 'relative'}}>...{animation}</div> } // inject the animation to the animated item
 *      ]
 *    
 *      const { onDragEnd, .., } = useMultiReorder(items, ...)
 *    
 *      return (
 *        <DragDropContext onDragEnd={onDragEnd} sensors={[sensor]}>
 *          ...
 *        </DragDropContext>
 *       )
 *     }
 * 
 *    function Parent() {
 *      return (
 *        <AnimatePresence initial={false}>  
 *          <ReorderComponent />
 *        </AnimatePresence>
 *      )
 *    }
 *    ```
 * 
*/
export function useMultiAnimation(itemId: string, config?: Config): Hook {
  const { animate: animateIcon, animation } = useTouchAnimation(config?.icon)
  const { sensor, apiRef } = useAnimationSensor()
  
  const running = useRef({ promise: Promise.resolve(), resolve: () => {} })
  const [present, remove] = usePresence()
  useEffect(() => {
    if (!present)
      running.current.promise.then(() => remove?.())
  }, [present, remove])

  const run = useCallback(async () => {
    const api = await apiRef.current.promise
    running.current = managedPromise()
    await animate({ api, itemId, animateIcon })
    running.current.resolve()
  }, [animateIcon, apiRef, itemId])

  return { animation, run, sensor }
}