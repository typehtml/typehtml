import { VNode, VNodeFlags, ComponentClass } from '../types';
import {
  copyPropsTo
} from '../vdom/normalization';
import options from '../vdom/options';
import { cloneVNode, isVNode } from '../vdom/VNodes';
import {
  EMPTY_OBJ,
  isArray,
  isFunction,
  isInvalid,
  isNull,
  isNullOrUndef,
  isStringOrNumber,
  isUndefined,
  throwError
} from '../vdom/shared';
import { Lifecycle } from './lifecycle';
import {
  patchEvent,
  patchProp
} from './patching';
import {
  recycleComponent,
  recycleElement
} from './recycling';
import {
  appendChild,
  createClassComponentInstance,
  createFunctionalComponentInput,
  documentCreateElement,
  setTextContent
} from './utils';
import processElement from './wrappers/processElement';

export function mount(vNode: VNode<any>, parentDom: Element, lifecycle: Lifecycle, isSVG: boolean) {
  const flags = vNode.flags;

  if (flags & VNodeFlags.Element) {
    return mountElement(vNode, parentDom, lifecycle, isSVG);
  } else if (flags & VNodeFlags.Component) {
    return mountComponent(vNode, parentDom, lifecycle, isSVG, flags & VNodeFlags.ComponentClass);
  } else if (flags & VNodeFlags.Void) {
    return mountVoid(vNode, parentDom);
  } else if (flags & VNodeFlags.Text) {
    return mountText(vNode, parentDom);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof vNode === 'object') {
        throwError(`mount() received an object that's not a valid VNode, you should stringify it first. Object: "${JSON.stringify(vNode)}".`);
      } else {
        throwError(`mount() expects a valid VNode, instead it received an object with the type "${typeof vNode}".`);
      }
    }
    throwError();
  }
}

export function mountText(vNode: VNode<any>, parentDom: Element): any {
  const dom = document.createTextNode(vNode.children as string);

  vNode.dom = dom as any;
  if (parentDom) {
    appendChild(parentDom, dom);
  }
  return dom;
}

export function mountVoid(vNode: VNode<any>, parentDom: Element) {
  const dom = document.createTextNode('');

  vNode.dom = dom as any;
  if (parentDom) {
    appendChild(parentDom, dom);
  }
  return dom;
}

export function mountElement(vNode: VNode<any>, parentDom: Element, lifecycle: Lifecycle, isSVG: boolean) {
  if (options.recyclingEnabled) {
    const dom = recycleElement(vNode, lifecycle, isSVG);

    if (!isNull(dom)) {
      if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
      }
      return dom;
    }
  }
  const tag = vNode.type;
  const flags = vNode.flags;

  if (isSVG || (flags & VNodeFlags.SvgElement)) {
    isSVG = true;
  }
  const dom = documentCreateElement(tag, isSVG);
  const children = vNode.children;
  const props = vNode.props;
  const events = vNode.events;
  const ref = vNode.ref;

  vNode.dom = dom;
  if (!isNull(children)) {
    if (isStringOrNumber(children)) {
      setTextContent(dom, children as string | number);
    } else if (isArray(children)) {
      mountArrayChildren(children, dom, lifecycle, isSVG);
    } else if (isVNode(children as any)) {
      mount(children as VNode<any>, dom, lifecycle, isSVG);
    }
  }
  let hasControlledValue = false;
  if (!(flags & VNodeFlags.HtmlElement)) {
    hasControlledValue = processElement(flags, vNode, dom);
  }
  if (!isNull(props)) {
    for (let prop in props) {
      // do not add a hasOwnProperty check here, it affects performance
      patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
    }
  }
  if (!isNull(events)) {
    for (let name in events) {
      // do not add a hasOwnProperty check here, it affects performance
      patchEvent(name, null, events[name], dom);
    }
  }
  if (!isNull(ref)) {
    mountRef(dom, ref, lifecycle);
  }
  if (!isNull(parentDom)) {
    appendChild(parentDom, dom);
  }
  return dom;
}

export function mountArrayChildren(children, dom: Element, lifecycle: Lifecycle, isSVG: boolean) {
  for (let i = 0; i < children.length; i++) {
    let child = children[i];

    // TODO: Verify can string/number be here. might cause de-opt
    if (!isInvalid(child)) {
      if (child.dom) {
        children[i] = child = cloneVNode(child);
      }
      mount(children[i], dom, lifecycle, isSVG);
    }
  }
}

export function mountComponent(vNode: VNode<any>, parentDom: Element, lifecycle: Lifecycle, isSVG: boolean, isClass: number) {
  if (options.recyclingEnabled) {
    const dom = recycleComponent(vNode, lifecycle, isSVG);

    if (!isNull(dom)) {
      if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
      }
      return dom;
    }
  }
  const type = vNode.type;
  const props = vNode.props || EMPTY_OBJ;
  const defaultProps = (type as any).defaultProps;
  const ref = vNode.ref;
  let dom;

  if (!isUndefined(defaultProps)) {
    copyPropsTo(defaultProps, props);
    vNode.props = props;
  }
  if (isClass) {
    const instance = createClassComponentInstance(vNode, type as ComponentClass<any>, props, isSVG);
    // If instance does not have componentWillUnmount specified we can enable fastUnmount
    const input = instance._lastInput;
    const prevFastUnmount = lifecycle.fastUnmount;
    // we store the fastUnmount value, but we set it back to true on the lifecycle
    // we do this so we can determine if the component render has a fastUnmount or not
    lifecycle.fastUnmount = true;
    instance._vNode = vNode;
    vNode.dom = dom = mount(input, null, lifecycle, isSVG);
    // we now create a lifecycle for this component and store the fastUnmount value
    const subLifecycle = instance._lifecycle = new Lifecycle();

    // children lifecycle can fastUnmount if itself does need unmount callback and within its cycle there was none
    subLifecycle.fastUnmount = isUndefined(instance.componentWillUnmount) && lifecycle.fastUnmount;
    // higher lifecycle can fastUnmount only if previously it was able to and this children doesnt have any
    lifecycle.fastUnmount = prevFastUnmount && subLifecycle.fastUnmount;
    if (!isNull(parentDom)) {
      appendChild(parentDom, dom);
    }
    mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
    vNode.children = instance;
  } else {
    const input = createFunctionalComponentInput(vNode, type, props);

    vNode.dom = dom = mount(input, null, lifecycle, isSVG);
    vNode.children = input;
    mountFunctionalComponentCallbacks(ref, dom, lifecycle);
    if (!isNull(parentDom)) {
      appendChild(parentDom, dom);
    }
  }
  return dom;
}

export function mountClassComponentCallbacks(vNode: VNode<any>, ref, instance, lifecycle: Lifecycle) {
  if (ref) {
    if (isFunction(ref)) {
      ref(instance);
    } else {
      if (process.env.NODE_ENV !== 'production') {
        throwError(`a bad value for "ref" was used on component: "${JSON.stringify(ref)}"`);
      }
      throwError();
    }
  }
  const cDM = instance.componentDidMount;
  const afterMount = options.afterMount;

  if (!isUndefined(cDM) || !isNull(afterMount)) {
    lifecycle.addListener(() => {
      afterMount && afterMount(vNode);
      cDM && instance.componentDidMount();
    });
  }
}

export function mountFunctionalComponentCallbacks(ref, dom, lifecycle: Lifecycle) {
  if (ref) {
    if (!isNullOrUndef(ref.onComponentWillMount)) {
      ref.onComponentWillMount();
    }
    if (!isNullOrUndef(ref.onComponentDidMount)) {
      lifecycle.addListener(() => ref.onComponentDidMount(dom));
    }
    if (!isNullOrUndef(ref.onComponentWillUnmount)) {
      lifecycle.fastUnmount = false;
    }
  }
}

export function mountRef(dom: Element, ref, lifecycle: Lifecycle) {
  if (isFunction(ref)) {
    lifecycle.fastUnmount = false;
    lifecycle.addListener(() => ref(dom));
  } else {
    if (isInvalid(ref)) {
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      throwError(`a bad value for "ref" was used on component: "${JSON.stringify(ref)}"`);
    }
    throwError();
  }
}
