/**
 * @module This is just an example of what the types would look like
 */
import * as types from './types';
export { types };

/**
 * Takes JSX and returns a handle to the DOMElement
 **/
export declare function createElement<P extends types.HTMLAttributes<T>, T extends Element>(
  name: string,
  props?: types.ThAttributes<T> & P,
  ...children: types.ThChildren[]): types.DOMElement<T>;
export declare function createElement<P>(
  name: types.ComponentFunction<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThChildren[]): types.ComponentFunctionElement<P>;
export declare function createElement<P>(
  name: types.ComponentClass<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThChildren[]): types.ComponentClassElement<P>;

/**
 * Takes JSX and renders it to a string
 */
export declare function renderToString(input: types.VNode): string;


/**
 * Takes JSX and renders it to a dom element
 */
export declare function render(input: types.VNode, parentDom: Element): void;
