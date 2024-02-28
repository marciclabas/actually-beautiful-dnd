import React, { useEffect, useRef } from "react";
import { Modal, useNotifiedState } from "framer-animations";
import { useAnimation, motion, MotionStyle, usePresence } from "framer-motion";
import { run as runAnimation } from "./animations/reorder";
import DragIcon from "./DragIcon";
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

  function makeAnimated({ id, elem }: Item): Item {
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
  }

  const animatedItems: Item[] = items.length > 0
  ? [makeAnimated(items[0]), ...items.slice(1)]
  : items

  const { reorderer, api, ...hook } = useReorder(animatedItems, config)

  const running = useRef({ promise: Promise.resolve(), resolve: () => {} })
  const [present, remove] = usePresence()
  useEffect(() => {
    if (!present)
      running.current.promise.then(() => remove?.())
  }, [present, remove])

  if (items.length === 0)
    return { reorderer, api, ...hook, run() {} }

  async function run() {
    const api_ = await api.current.promise
    running.current = managedPromise()
    await runAnimation({ api: api_, iconControls, itemId: items[0].id, setModal })
    running.current.resolve()
  }

  const animatedReorderer = (
    <>
      {reorderer}
      <Modal show={modal} style={modalStyle} />
    </>
  )

  return { ...hook, api, run, reorderer: animatedReorderer }
}