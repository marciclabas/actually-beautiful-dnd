import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, useNotifiedState } from "framer-animations";
import { useAnimation, motion, MotionStyle, usePresence } from "framer-motion";
import { run as runAnimation } from "./animations/reorder";
import DragIcon from "./DragIcon";
import { useReorder, Config, Hook, Item } from "../reorder";
import { managedPromise } from "../util/promises";
import { update } from "ramda";

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

/**
 * - **Condider wrapping the component using this hook with `<AnimatePresence>`**
 * - Otherwise, if an animation is running and the component unmounts, `react-beautiful-dnd` will be kind enough to throw an ugly error
 * - Example:
 *    ```jsx
 *    import { AnimatePresence } from 'framer-motion' // already required by `framer-animations`
 *    import { useAnimatedReorder } from 'use-reorder/dist/animated'
 * 
 *    function ReorderComponent() {
 *      const { ... } = useAnimatedReorder()
 *    }
 * 
 *    function Parent() {
 *      return (
 *        <AnimatePresence initial={false}>  
 *          <ReorderComponent />
 *        </AnimatePresence>
 *      )
 *    }
 *    
 *    ```
 */
export function useAnimatedReorder(items: Item[], config?: AnimatedConfig): AnimatedHook {

  const { handIcon, modalStyle } = {...defaultCfg, ...config?.animation}
  const [modal, setModal] = useNotifiedState(false)
  const iconControls = useAnimation()

  const makeAnimated = useCallback(({ id, elem }: Item): Item => {
    return {
      id, elem: props => (
        <div style={{position: 'relative'}}>
          {elem(props)}
          <Modal show={modal} style={modalStyle}>
            <motion.div animate={iconControls} initial={{ scale: 1 }} style={{ y: '70%', x: '40%' }}>
              {handIcon}
            </motion.div>
          </Modal>
        </div>
      )
    }
  }, [handIcon, iconControls, modal, modalStyle])

  const [animatedIdx, setAnimated] = useState(0)

  const animatedItems: Item[] = useMemo(() => {
    if (items.length === 0)
      return items
    return update(animatedIdx, makeAnimated(items[animatedIdx]), items)
  }, [items, makeAnimated, animatedIdx])

  const { reorderer, api, order, ...hook } = useReorder(animatedItems, config)

  useEffect(() => {
    setAnimated(order[0])
  }, [order])

  const running = useRef({ promise: Promise.resolve(), resolve: () => {} })
  const [present, remove] = usePresence()

  useEffect(() => {
    if (!present)
      running.current.promise.then(() => remove?.())
  }, [present, remove])

  const run = useCallback(async () => {
    const api_ = await api.current.promise
    running.current = managedPromise()
    await runAnimation({ api: api_, iconControls, itemId: items[animatedIdx].id, setModal })
    running.current.resolve()
  }, [api, iconControls, items, setModal, animatedIdx])
  
  if (items.length === 0)
    return { reorderer, api, order, ...hook, run() {} }

  const animatedReorderer = (
    <>
      {reorderer}
      <Modal show={modal} style={modalStyle} />
    </>
  )

  return { order, api, run, reorderer: animatedReorderer, ...hook }
}