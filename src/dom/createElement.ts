import * as types from '../types';
import { VNodeData } from '../vdom/vnode';
import { h } from '../vdom/h';

export function createElement<P extends types.HTMLAttributes<T>, T extends Element>(
  name: string,
  props?: types.ThAttributes<T> & P,
  ...children: types.ThChildren[]): types.DOMElement<T>;
export function createElement<P>(
  name: types.ComponentFunction<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThChildren[]): types.ComponentFunctionElement<P>;
export function createElement<P>(
  name: types.ComponentClass<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThChildren[]): types.ComponentClassElement<P>;
export function createElement(
  type: any,
  props?: any,
  ...children: any[]
): any {
  /** intrinsic elements */
  if (typeof name === 'string') {
    const { vnodeData, vnodeChildren } = mapPropsToHProps(props, children);
    return h(name, vnodeData, children);
  };
}

/**
 * Maps props to something that h likes
 */
function mapPropsToHProps(
  _props: types.ThAttributes<any>,
  children: types.ThChildren[]): { vnodeData: VNodeData, vnodeChildren: types.ThChildren[] } {

  /** Expand the type of props to be the most permissive */
  const props = _props as types.SVGAttributes<any>;

  /** Normalize children, preferring the props over nested */
  const vnodeChildren = props.children || children;

  const VNodeData: VNodeData = {
    key: props.key || null,
    class: props.className || null,
    hook: {
      create: props.ref || null
    }
  }

  return { vnodeChildren, vnodeData: {} };
}
