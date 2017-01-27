/**
 * @module This is just an example of what the types would look like
 */
import * as types from './types';

// ----------------------------------------------------------------------
// Creation
// ----------------------------------------------------------------------

/** Return from creating a native dom element */
export interface DOMElement<P extends types.HTMLAttributes<T>, T extends Element> extends types.ThElement<P> {
  type: string;
  ref: types.Ref<T>;
}
/** Return from creating a Function component */
export interface ComponentFunctionElement<P> extends types.ThElement<P> {
  type: types.ComponentFunction<P>;
  ref: types.Ref<P>;
}
/** Return from creating a Class component */
export interface ComponentClassElement<P> extends types.ThElement<P> {
  type: types.ComponentClass<P>;
  ref: types.Ref<P>;
}

/** 
 * Takes JSX and returns a handle to the DOMElement
 **/
export function createElement<P extends types.HTMLAttributes<T>, T extends Element>(
  type: string,
  props?: types.ThAttributes<T> & P,
  ...children: types.ThNode[]): DOMElement<P, T>; // native dom element support
export function createElement<P>(
  type: types.ComponentFunction<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThNode[]): ComponentFunctionElement<P>;
export function createElement<P>(
  type: types.ComponentClass<P>,
  props?: types.ThAttributes<P> & P,
  ...children: types.ThNode[]): ComponentClassElement<P>;
