import { delay } from "framer-animations"
import { AnimationControls } from "framer-motion"
import { SensorAPI } from "react-beautiful-dnd"

export type Params = {
  api: SensorAPI
  itemId: string
  setModal(show: boolean): void
  iconControls: AnimationControls
}

export async function run({ api, itemId, iconControls, setModal }: Params) {
  const lock = api.tryGetLock(itemId)
  if (!lock)
    return false

  iconControls.start({ scale: 1, opacity: 1, zIndex: 1 })
  setModal(true)
  const lift = lock.snapLift()
  await delay(0.2)
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
