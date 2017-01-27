import { VNode, VNodeFlags, ThChildren, ComponentClass } from '../types';

import {
  copyPropsTo
} from '../vdom/normalization';
import options from '../vdom/options';
import {
  EMPTY_OBJ,
  isArray,
  isNull,
  isObject,
  isStringOrNumber,
  isUndefined,
  throwError,
  warning
} from '../vdom/shared';
import { svgNS } from './constants';
import Lifecycle from './lifecycle';
import {
  mount,
  mountClassComponentCallbacks,
  mountElement,
  mountFunctionalComponentCallbacks,
  mountRef,
  mountText
} from './mounting';
import {
  patchEvent,
  patchProp
} from './patching';
import {
  createClassComponentInstance,
  createFunctionalComponentInput,
  replaceChild
} from './utils';
import processElement from './wrappers/processElement';

export function normalizeChildNodes(parentDom) {
  let dom = parentDom.firstChild;

  while (dom) {
    if (dom.nodeType === 8) {
      if (dom.data === '!') {
        const placeholder = document.createTextNode('');

        parentDom.replaceChild(placeholder, dom);
        dom = dom.nextSibling;
      } else {
        const lastDom = dom.previousSibling;

        parentDom.removeChild(dom);
        dom = lastDom || parentDom.firstChild;
      }
    } else {
      dom = dom.nextSibling;
    }
  }
}

function hydrateComponent(vNode: VNode<any>, dom: Element, lifecycle: Lifecycle, isSVG: boolean, isClass: number): Element {
  const type = vNode.type;
  const props = vNode.props || EMPTY_OBJ;
  const ref = vNode.ref;

  vNode.dom = dom;
  if (isClass) {
    const _isSVG = dom.namespaceURI === svgNS;
    const defaultProps = (type as any).defaultProps;

    if (!isUndefined(defaultProps)) {
      copyPropsTo(defaultProps, props);
      vNode.props = props;
    }
    const instance = createClassComponentInstance(vNode, type as ComponentClass<any>, props, _isSVG);
    // If instance does not have componentWillUnmount specified we can enable fastUnmount
    const prevFastUnmount = lifecycle.fastUnmount;
    const input = instance._lastInput;

    // we store the fastUnmount value, but we set it back to true on the lifecycle
    // we do this so we can determine if the component render has a fastUnmount or not
    lifecycle.fastUnmount = true;
    instance._vComponent = vNode;
    instance._vNode = vNode;
    hydrate(input, dom, lifecycle, _isSVG);
    // we now create a lifecycle for this component and store the fastUnmount value
    const subLifecycle = instance._lifecycle = new Lifecycle();

    // children lifecycle can fastUnmount if itself does need unmount callback and within its cycle there was none
    subLifecycle.fastUnmount = isUndefined(instance.componentWillUnmount) && lifecycle.fastUnmount;
    // higher lifecycle can fastUnmount only if previously it was able to and this children doesnt have any
    lifecycle.fastUnmount = prevFastUnmount && subLifecycle.fastUnmount;
    mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
    vNode.children = instance;
  } else {
    const input = createFunctionalComponentInput(vNode, type, props);
    hydrate(input, dom, lifecycle, isSVG);
    vNode.children = input;
    vNode.dom = input.dom;
    mountFunctionalComponentCallbacks(ref, dom, lifecycle);
  }
  return dom;
}

function hydrateElement(vNode: VNode<any>, dom: Element, lifecycle: Lifecycle, isSVG: boolean): Element {
  const tag = vNode.type;
  const children = vNode.children;
  const props = vNode.props;
  const events = vNode.events;
  const flags = vNode.flags;
  const ref = vNode.ref;

  if (isSVG || (flags & VNodeFlags.SvgElement)) {
    isSVG = true;
  }
  if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== tag) {
    if (process.env.NODE_ENV !== 'production') {
      warning('TypeHtml hydration: Server-side markup doesn\'t match client-side markup or Initial render target is not empty');
    }
    const newDom = mountElement(vNode, null, lifecycle, isSVG);

    vNode.dom = newDom;
    replaceChild(dom.parentNode, newDom, dom);
    return newDom as Element;
  }
  vNode.dom = dom;
  if (children) {
    hydrateChildren(children, dom, lifecycle, isSVG);
  }
  let hasControlledValue = false;
  if (!(flags & VNodeFlags.HtmlElement)) {
    hasControlledValue = processElement(flags, vNode, dom);
  }
  if (props) {
    for (let prop in props) {
      patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
    }
  }
  if (events) {
    for (let name in events) {
      patchEvent(name, null, events[name], dom);
    }
  }
  if (ref) {
    mountRef(dom, ref, lifecycle);
  }
  return dom;
}

function hydrateChildren(children: ThChildren, parentDom: Element, lifecycle: Lifecycle, isSVG: boolean): void {
  normalizeChildNodes(parentDom);
  let dom = parentDom.firstChild;

  if (isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (!isNull(child) && isObject(child)) {
        if (dom) {
          dom = hydrate(child as VNode<any>, dom as Element, lifecycle, isSVG);
          dom = dom.nextSibling;
        } else {
          mount(child as VNode<any>, parentDom, lifecycle, isSVG);
        }
      }
    }
  } else if (isStringOrNumber(children)) {
    if (dom && dom.nodeType === 3) {
      if (dom.nodeValue !== children) {
        dom.nodeValue = children as string;
      }
    } else if (children) {
      parentDom.textContent = children as string;
    }
    dom = dom.nextSibling;
  } else if (isObject(children)) {
    hydrate(children as VNode<any>, dom as Element, lifecycle, isSVG);
    dom = dom.nextSibling;
  }
  // clear any other DOM nodes, there should be only a single entry for the root
  while (dom) {
    const nextSibling = dom.nextSibling;
    parentDom.removeChild(dom);
    dom = nextSibling;
  }
}

function hydrateText(vNode: VNode<any>, dom: Element): Element {
  if (dom.nodeType !== 3) {
    const newDom = mountText(vNode, null);

    vNode.dom = newDom;
    replaceChild(dom.parentNode, newDom, dom);
    return newDom;
  }
  const text = vNode.children;

  if (dom.nodeValue !== text) {
    dom.nodeValue = text as string;
  }
  vNode.dom = dom;
  return dom;
}

function hydrateVoid(vNode: VNode<any>, dom: Element): Element {
  vNode.dom = dom;
  return dom;
}

function hydrate(vNode: VNode<any>, dom: Element, lifecycle: Lifecycle, isSVG: boolean): Element {
  const flags = vNode.flags;

  if (flags & VNodeFlags.Component) {
    return hydrateComponent(vNode, dom, lifecycle, isSVG, flags & VNodeFlags.ComponentClass);
  } else if (flags & VNodeFlags.Element) {
    return hydrateElement(vNode, dom, lifecycle, isSVG);
  } else if (flags & VNodeFlags.Text) {
    return hydrateText(vNode, dom);
  } else if (flags & VNodeFlags.Void) {
    return hydrateVoid(vNode, dom);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      throwError(`hydrate() expects a valid VNode, instead it received an object with the type "${typeof vNode}".`);
    }
    throwError();
  }
}

export default function hydrateRoot(input, parentDom: Node, lifecycle: Lifecycle) {
  let dom = parentDom && parentDom.firstChild as Element;

  if (dom) {
    hydrate(input, dom, lifecycle, false);
    dom = parentDom.firstChild as Element;
    // clear any other DOM nodes, there should be only a single entry for the root
    while (dom = dom.nextSibling as Element) {
      parentDom.removeChild(dom);
    }
    return true;
  }
  return false;
}
