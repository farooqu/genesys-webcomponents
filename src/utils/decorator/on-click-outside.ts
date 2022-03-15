/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Build as BUILD, ComponentInterface, getElement } from '@stencil/core';

declare type OnClickOutsideDecorator = (
  target: ComponentInterface,
  propertyKey: string
) => void;

declare type OnClickOutsideCallback = (event: MouseEvent) => void;

declare interface OnClickOutsideOptions {
  triggerEvents?: string;
  exclude?: string;
}

const OnClickOutsideOptionsDefaults: OnClickOutsideOptions = {
  triggerEvents: 'click',
  exclude: ''
};

export function OnClickOutside(
  opt: OnClickOutsideOptions = OnClickOutsideOptionsDefaults
): OnClickOutsideDecorator {
  return (proto: ComponentInterface, methodName: string) => {
    // this is to resolve the 'compiler optimization issue':
    // lifecycle events not being called when not explicitly declared in at least one of components from bundle
    (BUILD as any).connectedCallback = true;
    (BUILD as any).disconnectedCallback = true;

    // eslint-disable-next-line
    const { connectedCallback, disconnectedCallback } = proto;

    proto.connectedCallback = function () {
      const host = getElement(this);
      const method = this[methodName];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      registerOnClickOutside(this, host, method, opt);
      return connectedCallback && connectedCallback.call(this);
    };

    proto.disconnectedCallback = function () {
      const host = getElement(this);
      const method = this[methodName];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      removeOnClickOutside(this, host, method, opt);
      return disconnectedCallback && disconnectedCallback.call(this);
    };
  };
}

export function registerOnClickOutside(
  component: ComponentInterface,
  element: HTMLElement,
  callback: OnClickOutsideCallback,
  opt: OnClickOutsideOptions = OnClickOutsideOptionsDefaults
): void {
  const excludedNodes = getExcludedNodes(opt);
  getTriggerEvents(opt).forEach(triggerEvent => {
    window.addEventListener(
      triggerEvent,
      (e: Event) => {
        initOnClickOutside(e, component, element, callback, excludedNodes);
      },
      false
    );
  });
}

export function removeOnClickOutside(
  component: ComponentInterface,
  element: HTMLElement,
  callback: OnClickOutsideCallback,
  opt: OnClickOutsideOptions = OnClickOutsideOptionsDefaults
): void {
  getTriggerEvents(opt).forEach(triggerEvent => {
    window.removeEventListener(
      triggerEvent,
      (e: Event) => {
        initOnClickOutside(e, component, element, callback);
      },
      false
    );
  });
}

function initOnClickOutside(
  event: Event,
  component: ComponentInterface,
  element: HTMLElement,
  callback: OnClickOutsideCallback,
  excludedNodes?: HTMLElement[]
) {
  const composedPath = event.composedPath();

  if (
    !composedPath.includes(element) &&
    !isExcluded(composedPath, excludedNodes)
  ) {
    callback.call(component, event);
  }
}

function getTriggerEvents(opt: OnClickOutsideOptions): string[] {
  if (opt.triggerEvents) {
    return opt.triggerEvents.split(',').map(e => e.trim());
  }
  return ['click'];
}

function getExcludedNodes(opt: OnClickOutsideOptions): HTMLElement[] {
  if (opt.exclude) {
    try {
      return Array.from(document.querySelectorAll(opt.exclude));
    } catch (err) {
      console.warn(
        `@OnClickOutside: Exclude: '${opt.exclude}' will not be evaluated. Check your exclude selector syntax.`,
        err
      );
    }
  }
  return;
}

function isExcluded(
  composedPath: EventTarget[],
  excudedNodes?: HTMLElement[]
): boolean {
  if (composedPath && excudedNodes) {
    return excudedNodes.some(excudedNode => composedPath.includes(excudedNode));
  }

  return false;
}
