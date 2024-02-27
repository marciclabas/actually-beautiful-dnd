import { useState } from "react"
import { SensorAPI } from "react-beautiful-dnd"

export type Hook = {
  sensor(api: SensorAPI): void
  api: SensorAPI | null
}
/** Uses the `SensorAPI` to programmatically animate a `<DragDropContext>`
 * 
 * ```jsx
 * const { sensor, api } = useAnimationSensor()
 * 
 * function animate() {
 *   if (!api)
 *     return
 *   const lock = api.tryGetLock('<draggableId>')
 *   const lift = lock.snapLift();
 *   lift.moveDown();
 *   // ...
 * }
 * 
 * <DragDropContext sensors={[sensor]}>...
 * ```
 */
export function useAnimationSensor(): Hook {
  const [api, setApi] = useState<SensorAPI|null>(null)
  return { sensor: setApi, api }
}