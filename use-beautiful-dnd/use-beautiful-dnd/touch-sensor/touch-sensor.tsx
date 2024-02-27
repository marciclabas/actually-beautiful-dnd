import { useRef, useCallback, useMemo } from 'react';
import type { Position } from 'css-box-model';
import { DraggableId, SensorAPI, PreDragActions, FluidDragActions } from 'react-beautiful-dnd';
import * as keyCodes from './keycodes';
// import supportedPageVisibilityEventName from './util/supported-page-visibility-event-name';
// import useLayoutEffect from '../../use-isomorphic-layout-effect';
import bindEvents, { EventBinding, EventOptions } from './binding-stuff';
import supportedEventName from './visibility-something/event-name';
import useIsomorphicLayoutEffect from './layout-effect';

function invariant(expr: boolean, msg?: string) {
  console.assert(expr, msg)
}

interface TouchWithForce extends Touch {
  force: number;
}

interface Idle {
  type: 'IDLE';
}

interface Pending {
  type: 'PENDING';
  point: Position;
  actions: PreDragActions;
  longPressTimerId: number; // TimeoutID in Flow is equivalent to number in TypeScript
}

interface Dragging {
  type: 'DRAGGING';
  actions: FluidDragActions;
  hasMoved: boolean;
}

type Phase = Idle | Pending | Dragging;

const idle: Idle = { type: 'IDLE' };

interface GetBindingArgs {
  cancel: () => void;
  completed: () => void;
  getPhase: () => Phase;
}

function getWindowBindings({ cancel, getPhase }: GetBindingArgs): EventBinding[] {
  return [
    {
      eventName: 'orientationchange',
      fn: cancel,
    },
    {
      eventName: 'resize',
      fn: cancel,
    },
    {
      eventName: 'contextmenu',
      fn: (event: Event) => {
        event.preventDefault();
      },
    },
    {
      eventName: 'keydown',
      fn: (event: any) => {
        if (getPhase().type !== 'DRAGGING') {
          cancel();
          return;
        }

        if (event.keyCode === keyCodes.escape) {
          event.preventDefault();
        }
        cancel();
      },
    },
    {
      eventName: supportedEventName,
      fn: cancel,
    },
  ];
}

function getHandleBindings({ cancel, completed, getPhase }: GetBindingArgs, forcePressThreshold = 0.15): EventBinding[] {
  return [
    {
      eventName: 'touchmove',
      options: { capture: false },
      fn: (event: TouchEvent) => {
        const phase: Phase = getPhase();
        if (phase.type !== 'DRAGGING') {
          cancel();
          return;
        }

        phase.hasMoved = true;
        const { clientX, clientY } = event.touches[0];
        const point: Position = { x: clientX, y: clientY };
        event.preventDefault();
        phase.actions.move(point);
      },
    },
    {
      eventName: 'touchend',
      fn: (event: TouchEvent) => {
        const phase: Phase = getPhase();
        if (phase.type !== 'DRAGGING') {
          cancel();
          return;
        }

        event.preventDefault();
        phase.actions.drop({ shouldBlockNextClick: true });
        completed();
      },
    },
    {
      eventName: 'touchcancel',
      fn: (event: TouchEvent) => {
        if (getPhase().type !== 'DRAGGING') {
          cancel();
          return;
        }

        event.preventDefault();
        cancel();
      },
    },
    {
      eventName: 'touchforcechange',
      fn: (event: TouchEvent) => {
        const phase = getPhase() as Dragging | Pending;
        invariant((phase as Phase).type !== 'IDLE');
        const touch: TouchWithForce | undefined = event.touches[0] as TouchWithForce | undefined;
        if (!touch) {
          return;
        }

        const isForcePress: boolean = touch.force >= forcePressThreshold;
        if (!isForcePress) {
          return;
        }

        const shouldRespect: boolean = phase.actions.shouldRespectForcePress();
        if (phase.type === 'PENDING') {
          if (shouldRespect) {
            cancel();
          }
          return;
        }

        if (shouldRespect) {
          if (phase.hasMoved) {
            event.preventDefault();
            return;
          }
          cancel();
          return;
        }

        event.preventDefault();
      },
    },
    {
      eventName: supportedEventName,
      fn: cancel,
    },
  ];
}

export type Config = {
  forcePressThreshold?: number
  timeForLongPress?: number
}
const defaultCfg: Required<Config> = {
  forcePressThreshold: 0.15,
  timeForLongPress: 150
}

/** Exactly the same as `react-beautiful-dnd`'s `useTouchSensor`, except `timeForLongPress` and `forcePressThreshold` are customizable */
export const useTouchSensor = (config?: Config) => (api: SensorAPI) => {
  const { forcePressThreshold, timeForLongPress } = {...defaultCfg, ...config}
  const phaseRef = useRef<Phase>(idle);
  const unbindEventsRef = useRef<() => void>(() => {});

  const getPhase = useCallback((): Phase => {
    return phaseRef.current;
  }, []);

  const setPhase = useCallback((phase: Phase) => {
    phaseRef.current = phase;
  }, []);

  const startCaptureBinding: EventBinding = useMemo(() => ({
    eventName: 'touchstart',
    fn: function onTouchStart(event: TouchEvent) {
      if (event.defaultPrevented) {
        return;
      }

      const draggableId = api.findClosestDraggableId(event);
      if (!draggableId) {
        return;
      }

      const actions = api.tryGetLock(draggableId, stop, { sourceEvent: event });
      if (!actions) {
        return;
      }

      const touch: Touch = event.touches[0];
      const { clientX, clientY } = touch;
      const point: Position = { x: clientX, y: clientY };
      unbindEventsRef.current();
      startPendingDrag(actions, point);
    },
  }), [api]);

  const listenForCapture = useCallback(() => {
    const options: EventOptions = { capture: true, passive: false };
    unbindEventsRef.current = bindEvents(window, [startCaptureBinding], options);
  }, [startCaptureBinding]);

  const stop = useCallback(() => {
    const current: Phase = phaseRef.current;
    if (current.type === 'IDLE') {
      return;
    }

    if (current.type === 'PENDING') {
      clearTimeout(current.longPressTimerId);
    }

    setPhase(idle);
    unbindEventsRef.current();
    listenForCapture();
  }, [listenForCapture, setPhase]);

  const cancel = useCallback(() => {
    const phase: Phase = phaseRef.current;
    stop();
    if (phase.type === 'DRAGGING') {
      phase.actions.cancel({ shouldBlockNextClick: true });
    }
    if (phase.type === 'PENDING') {
      phase.actions.abort();
    }
  }, [stop]);

  const bindCapturingEvents = useCallback(() => {
    const options: EventOptions = { capture: true, passive: false };
    const args: GetBindingArgs = { cancel, completed: stop, getPhase };
    const unbindTarget = bindEvents(window, getHandleBindings(args, forcePressThreshold), options);
    const unbindWindow = bindEvents(window, getWindowBindings(args), options);

    unbindEventsRef.current = function unbindAll() {
      unbindTarget();
      unbindWindow();
    };
  }, [cancel, getPhase, stop]);

  const startDragging = useCallback(() => {
    const phase = getPhase() as Pending;
    invariant(phase.type === 'PENDING', `Cannot start dragging from phase ${phase.type}`);

    const actions: FluidDragActions = phase.actions.fluidLift(phase.point);
    setPhase({ type: 'DRAGGING', actions, hasMoved: false });
  }, [getPhase, setPhase]);

  const startPendingDrag = useCallback((actions: PreDragActions, point: Position) => {
    invariant(getPhase().type === 'IDLE', 'Expected to move from IDLE to PENDING drag');

    const longPressTimerId: number = window.setTimeout(startDragging, timeForLongPress); // Adjust timeForLongPress as needed
    setPhase({ type: 'PENDING', point, actions, longPressTimerId });
    bindCapturingEvents();
  }, [bindCapturingEvents, getPhase, setPhase, startDragging]);

  useIsomorphicLayoutEffect(() => {
    listenForCapture();
    return () => {
      unbindEventsRef.current();
      const phase: Phase = getPhase();
      if (phase.type === 'PENDING') {
        clearTimeout(phase.longPressTimerId);
        setPhase(idle);
      }
    };
  }, [getPhase, listenForCapture, setPhase]);

  useIsomorphicLayoutEffect(() => {
    const unbind = bindEvents(window, [{
      eventName: 'touchmove',
      fn: () => {},
      options: { capture: false, passive: false },
    }]);

    return unbind;
  }, []);
}
