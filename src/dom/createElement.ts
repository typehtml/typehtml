import * as types from '../types';


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

}
