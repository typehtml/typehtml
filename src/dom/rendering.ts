import { VNode, ThChildren, VNodeFlags } from '../types';

import {
  isBrowser,
  isInvalid,
  isNull,
  isNullOrUndef,
  NO_OP,
  throwError,
  warning
} from '../vdom/shared';

import { cloneVNode } from '../vdom/VNodes';
import { hydrateRoot } from './hydration';
import { Lifecycle } from './lifecycle';
import { mount } from './mounting';
import { patch } from './patching';
import { unmount } from './unmounting';

// rather than use a Map, like we did before, we can use an array here
// given there shouldn't be THAT many roots on the page, the difference
// in performance is huge: https://esbench.com/bench/5802a691330ab09900a1a2da
interface Root {
  dom: Element;
  input: VNode<any>;
  lifecycle: Lifecycle;
}
const roots: Root[] = [];
function getRoot(dom: Element): Root | null {
  for (const root of roots) {
    if (root.dom === dom) {
      return root;
    }
  }
  return null;
}
function addRoot(dom: Element, input: VNode<any>, lifecycle: Lifecycle): Root {
  const root: Root = {
    dom,
    input,
    lifecycle
  };

  roots.push(root);
  return root;
}
function removeRoot(root: Root): void {
  for (let i = 0; i < roots.length; i++) {
    if (roots[i] === root) {
      roots.splice(i, 1);
      return;
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  if (isBrowser && document.body === null) {
    warning('TypeHtml warning: you cannot initialize without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
  }
}

const documentBody = isBrowser ? document.body : null;

export function render(input: VNode<any> | NO_OP, parentDom?: Element): ThChildren {
  if (documentBody === parentDom) {
    if (process.env.NODE_ENV !== 'production') {
      throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
    }
    throwError();
  }
  if (input === NO_OP) {
    return;
  }
  let root = getRoot(parentDom);

  /** If there is no root means we are mounting for the first time */
  if (isNull(root)) {
    const lifecycle = new Lifecycle();

    if (!isInvalid(input)) {
      if (input.dom) {
        input = cloneVNode(input);
      }
      /** Hydrate or mount */
      if (!hydrateRoot(input, parentDom, lifecycle)) {
        mount(input, parentDom, lifecycle, false);
      }
      root = addRoot(parentDom, input, lifecycle);
      lifecycle.trigger();
    }
  } else {
    const lifecycle = root.lifecycle;

    if (isNullOrUndef(input)) {
      unmount(root.input, parentDom, lifecycle, false, false);
      removeRoot(root);
    } else {
      if (input.dom) {
        input = cloneVNode(input);
      }
      patch(root.input, input, parentDom, lifecycle, false, false);
    }
    lifecycle.trigger();
    root.input = input;
  }
  if (root) {
    const rootInput: VNode<any> = root.input;

    if (rootInput && (rootInput.flags & VNodeFlags.Component)) {
      return rootInput.children;
    }
  }
}

export function createRenderer(_parentDom) {
  let parentDom = _parentDom || null;

  return function renderer(lastInput, nextInput) {
    if (!parentDom) {
      parentDom = lastInput;
    }
    render(nextInput, parentDom);
  };
}
