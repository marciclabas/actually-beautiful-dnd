import { delay } from "framer-animations"
import { AnimationControls } from "framer-motion"
import { SensorAPI } from "react-beautiful-dnd"

export type Params = {
  api: SensorAPI
  itemId: string
  setModal(show: boolean): Promise<void>
  iconControls: AnimationControls
}

export async function run({ api, itemId, iconControls, setModal }: Params) {
  const lock = api.tryGetLock(itemId)
  if (!lock)
    return false

  await setModal(true)
  const lift = lock.snapLift()
  await iconControls.start({ scale: 0.7 })
  await delay(0.1)
  lift.moveDown();
  await delay(0.3)
  await iconControls.start({ scale: 1 })
  await delay(0.3)
  setModal(false)
  lift.moveUp();
  await delay(0.1)
  lift.drop();
  return true
}
