import { useTouchAnimation, TouchConfig } from "framer-animations"
import { useEffect, useRef } from "react"
import { SensorAPI } from "react-beautiful-dnd"
import { useAnimationSensor } from "use-beautiful-dnd"
import { managedPromise } from "../util/promises"
import { animate } from "./animations/multi-reorder"

export type Hook = {
  run(): void
  sensor(s: SensorAPI): void
  animation: JSX.Element
}
export type Config = {
  icon?: TouchConfig
}

/** Dragging hint animation for `useMultiReorder` (or any `react-beautiful-based` multilist)
 * - **Requires installing `framer-animations`**
 * 
 * ```jsx
 * import { useMultiReorder, MultiItem } from 'use-reorder'
 * import { useMultiAnimation } from 'use-reorder/dist/animated'
 * 
 * const { animation, run, sensor } = useMultiAnimation('animated-item')
 * 
 * const items = [
 *  { id: 'some-item', elem: () => <div>...</div> },
 *  { id: 'animated-item', elem: () => <div style={{position: 'relative'}}>...{animation}</div> } // inject the animation to the animated item
 * ]
 * 
 * const { onDragEnd, .., } = useMultiReorder(items, ...)
 * 
 * return (
 *  <DragDropContext onDragEnd={onDragEnd} sensors={[sensor]}>
 *  ...
 * ```
 * 
*/
export function useMultiAnimation(itemId: string, config?: Config): Hook {
  const { animate: animateIcon, animation } = useTouchAnimation(config?.icon)
  const { sensor, api } = useAnimationSensor()
  
  const apiPromise = useRef(managedPromise<SensorAPI>())
  useEffect(() => {
    if (api)
      apiPromise.current.resolve(api)
  }, [api])

  async function run() {
    const api = await apiPromise.current.promise
    animate({ api, itemId, animateIcon })
  }

  return { animation, run, sensor }
}