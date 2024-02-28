import { MutableRefObject, useCallback, useRef } from "react"
import { SensorAPI } from "react-beautiful-dnd"
import { managedPromise } from "./util/promises"

export type Hook = {
  sensor(api: SensorAPI): void
  apiRef: MutableRefObject<{ promise: Promise<SensorAPI> }>
}
/** Uses the `SensorAPI` to programmatically animate a `<DragDropContext>`
 * 
 * ```jsx
 * const { sensor, apiRef } = useAnimationSensor()
 * 
 *  async function animate() {
 *    const api = await apiRef.current.promise
 *    const lock = api.tryGetLock('<draggableId>')
 *    const lift = lock.snapLift();
 *    lift.moveDown();
 *    // ...
 * }
 * 
 * <DragDropContext sensors={[sensor]}>...
 * ```
 */
export function useAnimationSensor(): Hook {
  const apiRef = useRef(managedPromise<SensorAPI>())
  const sensor = useCallback((api: SensorAPI) => {
    apiRef.current.resolve(api)
  }, [])
  return { sensor, apiRef }
}