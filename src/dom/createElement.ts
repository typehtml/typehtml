import * as types from '../types';
import { VNodeData, VNode } from '../types';
import { h } from '../vdom/h';
import { html, svg, buildFromComponentFunction, buildFromComponentClass } from './jsx';

export function isComponentFunction(t: types.CreateElementTag<any>): t is types.ComponentFunction<any> {
  return typeof t === 'function';
}

export function isComponentClass(t: any): t is types.ComponentClass<any> {
  return (t.prototype !== undefined) && (t.prototype.render !== undefined);
}

export function createElement<P extends types.HTMLAttributes<T>, T extends Element>(
  tag: string,
  props?: types.ThAttributes<T> & P,
  ...children: types.CreateElementChildrenRaw[]): VNode;
export function createElement<P>(
  tag: types.ComponentFunction<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.CreateElementChildrenRaw[]): VNode;
export function createElement<P>(
  tag: types.ComponentClass<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.CreateElementChildrenRaw[]): VNode;
export function createElement(
  tag: types.CreateElementTag<any>,
  props?: any
): any {
  /** Normalize the children */
  let children: types.CreateElementChildren = null;
  if (arguments.length > 3 || !Array.isArray(children)) {
    children = Array.prototype.slice.call(arguments, 2);
    children = NormalizeChildren.maybeFlatten(children);
  }

  /** Normalize the props */
  props = props || {};

  /** intrinsic elements */
  if (typeof tag === 'string') {
    /** TODO: svg */
    return html(tag, props, children);
  }
  /** class component */
  else if (isComponentClass(tag)) {
    return buildFromComponentClass(tag, props, children);
  }
  /** function component */
  else if (isComponentFunction(tag)) {
    return buildFromComponentFunction(tag, props, children);
  }
  else {
    throw new Error("JSX tag must be either a string | function | class with a `render` prototype method");
  }
}

/**
 * Flatten the nested children structure into a single array
 * From :
 * https://github.com/yelouafi/snabbdom-jsx/blob/5c358839cb208bf76023ea2c0967091a52f9bc70/snabbdom-jsx.js
 */
namespace NormalizeChildren {
  function flatten(nested, start: number, flat): void {
    for (var i = start, len = nested.length; i < len; i++) {
      var item = nested[i];
      if (Array.isArray(item)) {
        flatten(item, 0, flat);
      } else {
        flat.push(item);
      }
    }
  }
  export function maybeFlatten(array?: types.CreateElementChildrenRaw): types.CreateElementChildren {
    if (array) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (Array.isArray(array[i])) {
          var flat = array.slice(0, i);
          flatten(array, i, flat);
          array = flat;
          break;
        }
      }
    }
    return array as any;
  }
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
