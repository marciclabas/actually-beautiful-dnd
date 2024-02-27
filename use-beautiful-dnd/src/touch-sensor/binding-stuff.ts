type UnbindFn = () => void;
export type EventOptions = {
  passive?: boolean,
  capture?: boolean,
  // sometimes an event might only event want to be bound once
  once?: boolean,
};

export type EventBinding = {
  eventName: string,
  fn(e: TouchEvent): void,
  options?: EventOptions,
};

function getOptions(
  shared?: EventOptions,
  fromBinding?: EventOptions,
): EventOptions {
  return {
    ...shared,
    ...fromBinding,
  };
}

export default function bindEvents(
  el: HTMLElement | Window,
  bindings: EventBinding[],
  sharedOptions?: EventOptions,
): any {
  const unbindings: UnbindFn[] = bindings.map(
    (binding: EventBinding): UnbindFn => {
      const options: Object = getOptions(sharedOptions, binding.options);

      el.addEventListener(binding.eventName, binding.fn as any, options);

      return function unbind() {
        el.removeEventListener(binding.eventName, binding.fn as any, options);
      };
    },
  );

  // Return a function to unbind events
  return function unbindAll() {
    unbindings.forEach((unbind: UnbindFn) => {
      unbind();
    });
  };
}
