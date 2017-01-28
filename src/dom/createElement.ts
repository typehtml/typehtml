import * as types from '../types';
import { VNodeData } from '../vdom/vnode';
import { h } from '../vdom/h';
import { html, svg } from './jsx';

export function createElement<P extends types.HTMLAttributes<T>, T extends Element>(
  type: string,
  props?: types.ThAttributes<T> & P,
  ...children: types.ThChildren[]): types.DOMElement<T>;
export function createElement<P>(
  type: types.ComponentFunction<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThChildren[]): types.ComponentFunctionElement<P>;
export function createElement<P>(
  type: types.ComponentClass<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThChildren[]): types.ComponentClassElement<P>;
export function createElement(
  type: any,
  props?: any,
  ...children: any[]
): any {
  /** intrinsic elements */
  if (typeof type === 'string') {
    return html(type, props, children);
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

  /** Normalize children, preferring the props version over nested */
  const vnodeChildren = props != null && props.children ? props.children : children;

  /** Map our props to VNode Data */
  const VNodeData: VNodeData
    = props != null
      ? {
        key: props.key || null,
        hook: {
          create: props.ref || null
        },
        props: {
          /** TODO all other props */
        },
        on: {
          /** TODO event props */
        },
        class: ''/** TODO: class names */
      }
      : null;

  return { vnodeChildren, vnodeData: {} };
}
