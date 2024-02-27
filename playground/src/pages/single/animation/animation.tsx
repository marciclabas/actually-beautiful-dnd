import { lazy, useMemo, useState } from "react";
import { SensorAPI } from "react-beautiful-dnd";
import { delay } from "../../../util/promises";
import { useAnimation, motion, MotionStyle } from "framer-motion";
import { Modal } from "framer-animations";
const DragIcon = lazy(() => import('./DragIcon'))

export type Hook = {
  backgroundAnimation: JSX.Element
  itemAnimation: JSX.Element
  run(api: SensorAPI): void
  modal: boolean
}
export type Config = {
  modalStyle?: MotionStyle
  handIcon?: JSX.Element
}
const defaultCfg: Required<Config> = {
  modalStyle: { backgroundColor: '#3334', borderRadius: '1rem' },
  handIcon: <DragIcon svg={{ width: '4rem', height: '4rem' }} path={{ fill: 'white' }} />
}
export function useReorderAnimation(itemId: string, config?: Config): Hook {

  const { modalStyle, handIcon } = { ...defaultCfg, ...config }

  const [modal, setModal] = useState(false)
  const controls = useAnimation()
  const modalControls = useAnimation()

  async function run(api: SensorAPI) {
    const lock = api.tryGetLock(itemId)
    if (!lock)
      return false

    controls.start({ scale: 1, opacity: 1, zIndex: 1 })
    setModal(true)
    const lift = lock.snapLift()
    await delay(0.2)
    await controls.start({ scale: 0.7 })
    await delay(0.1)
    lift.moveDown();
    await delay(0.3)
    await controls.start({ scale: 1 })
    await delay(0.3)
    modalControls.start({ opacity: 0 })
    setModal(false)
    lift.moveUp();
    await delay(0.1)
    lift.drop();
    return true
  }

  const itemAnimation = (
    <motion.div animate={controls} initial={{ scale: 1 }} style={{ y: '70%', x: '40%' }}>
      {handIcon}
    </motion.div>
  )
  const backgroundAnimation = <Modal show={modal} style={modalStyle} />

  return { itemAnimation, backgroundAnimation, run, modal }
}