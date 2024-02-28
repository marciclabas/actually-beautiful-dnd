import { delay } from "framer-animations"
import { Action } from "framer-animations/dist/touch"
import { SensorAPI } from "react-beautiful-dnd"

export type Params = {
  api: SensorAPI
  itemId: string
  animateIcon(action: Action): Promise<void>
}

export async function animate({ api, itemId, animateIcon }: Params) {
  const lock = api.tryGetLock(itemId)
  if (!lock)
    return false

  await animateIcon('show')
  const lift = lock.snapLift()
  animateIcon('press')
  await delay(0.3)
  lift.moveRight();
  lift.moveDown();
  await delay(0.3)
  animateIcon('lift')
  await delay(0.3)
  animateIcon('hide')
  lift.moveUp();
  lift.moveLeft();
  await delay(0.1)
  lift.drop();
  return true
}