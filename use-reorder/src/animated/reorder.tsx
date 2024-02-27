import React, { useEffect, useRef, useState } from "react";
import { Modal } from "framer-animations";
import { useAnimation, motion, MotionStyle } from "framer-motion";
import { run as runAnimation } from "./animation";
import DragIcon from "./DragIcon";
import { SensorAPI } from "react-beautiful-dnd";
import { useReorder, Config, Hook, Item } from "../reorder";
import { managedPromise } from "../util/promises";

export type AnimationConfig = {
  handIcon?: JSX.Element
  modalStyle?: MotionStyle
}
const defaultCfg: Required<AnimationConfig> = {
  modalStyle: { backgroundColor: '#3334', borderRadius: '1rem' },
  handIcon: <DragIcon svg={{ width: '4rem', height: '4rem' }} path={{ fill: 'white' }} />
}
export type AnimatedConfig = Config & { animation?: AnimationConfig }
export type AnimatedHook = Hook & {
  run(): void
}
export function useAnimatedReorder(items: Item[], config?: AnimatedConfig): AnimatedHook {

  const { handIcon, modalStyle } = {...defaultCfg, ...config?.animation}
  const [modal, setModal] = useState(false)
  const iconControls = useAnimation()

  function makeAnimated({ id, elem }: Item): Item {
    return {
      id, elem: props => (
        <div>
          {elem(props)}
          <Modal show={modal} style={modalStyle}>
            <motion.div animate={iconControls} initial={{ scale: 1 }} style={{ y: '70%', x: '40%' }}>
              {handIcon}
            </motion.div>
          </Modal>
        </div>
      )
    }
  }

  const animatedItems: Item[] = items.length > 0
  ? [makeAnimated(items[0]), ...items.slice(1)]
  : items

  const { reorderer, animate, ...hook } = useReorder(animatedItems, config)
  const apiPromise = useRef(managedPromise<SensorAPI>())
  useEffect(() => {
    if (animate)
      apiPromise.current.resolve(animate)
  }, [animate])


  if (items.length === 0)
    return { reorderer, animate, ...hook, run() {} }

  async function run() {
    const api = await apiPromise.current.promise
    runAnimation({ api, iconControls, itemId: items[0].id, setModal })
  }

  const animatedReorderer = (
    <>
      {reorderer}
      <Modal show={modal} style={modalStyle} />
    </>
  )

  return { ...hook, animate, run, reorderer: animatedReorderer }
}