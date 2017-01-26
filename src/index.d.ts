/**
 * @module This is just an example of what the types would look like
 */
import * as types from './types';

// ----------------------------------------------------------------------
// Elements
// ----------------------------------------------------------------------

type Key = string | number;
type Ref<T> = (instance: T) => any;

interface ThElement<P> {
  type: string | ComponentClass<P> | ComponentFunction<P>;
  props: P;
  key: Key | null;
}

interface ComponentFunction<P> {
  (props: P & { children?: types.ThNode }, context?: any): ThElement<any>;
  defaultProps?: P;
  displayName?: string;
}

interface ComponentClass<P> {
  new (props?: P, context?: any): Component<P>;
  defaultProps?: P;
  displayName?: string;
}

// Base component interface JS classes
interface Component<P> extends ComponentLifecycle<P> {
  constructor(props?: P, context?: any);
  forceUpdate(callBack?: () => any): void;
  render(): JSX.Element | null;
  props: Readonly<{ children?: types.ThNode }> & Readonly<P>;
}

interface ComponentLifecycle<P> {
  componentWillMount?(): void;
  componentDidMount?(): void;
  componentWillReceiveProps?(nextProps: P): void;
  componentWillUpdate?(nextProps: P): void;
  componentDidUpdate?(prevProps: P): void;
  componentWillUnmount?(): void;
}

interface Attributes<T> {
  key?: Key;
  ref?: (t: T) => any;
}

// ----------------------------------------------------------------------
// Core Nodes
// ----------------------------------------------------------------------
interface HTMLProps<T> extends types.HTMLAttributes<T>, Attributes<T> {
}

// ----------------------------------------------------------------------
// Creation
// ----------------------------------------------------------------------

/** Return from creating a native dom element */
export interface DOMElement<P extends types.DOMAttributes<T>, T extends Element> extends ThElement<P> {
  type: string;
  ref: Ref<T>;
}
/** Return from creating a Function component */
export interface ComponentFunctionElement<P> extends ThElement<P> {
  type: ComponentFunction<P>;
  ref: Ref<P>;
}
/** Return from creating a Class component */
export interface ComponentClassElement<P> extends ThElement<P> {
  type: ComponentClass<P>;
  ref: Ref<P>;
}

/** 
 * Takes JSX and returns a handle to the DOMElement
 **/
export function createElement<P extends types.DOMAttributes<T>, T extends Element>(
  type: string,
  props?: Attributes<T> & P,
  ...children: types.ThNode[]): DOMElement<P, T>; // native dom element support
export function createElement<P>(
  type: ComponentFunction<P>,
  props?: Attributes<P> & P,
  ...children: types.ThNode[]): ComponentFunctionElement<P>;
export function createElement<P>(
  type: ComponentClass<P>,
  props?: Attributes<P> & P,
  ...children: types.ThNode[]): ComponentClassElement<P>;

//////////////////////
// JSX
//////////////////////
declare global {
  namespace JSX {
    interface Element extends ThElement<any> { }
    interface ElementAttributesProperty { props: {}; }
    interface IntrinsicAttributes extends Attributes<void> { }
    interface IntrinsicClassAttributes<T> extends Attributes<T> { }
    interface IntrinsicElements {
      div: HTMLProps<HTMLDivElement>;
    }
  }
}