/**
 * @module This is just an example of what the types would look like
 */

// ----------------------------------------------------------------------
// Elements
// ----------------------------------------------------------------------

type Key = string | number;
type Ref<T> = string | ((instance: T) => any);


interface ThElement<P> {
  type: string | ComponentClass<P> | StatelessComponent<P>;
  props: P;
  key: Key | null;
}

interface StatelessComponent<P> {
  (props: P & { children?: ThNode }, context?: any): ThElement<any>;
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
  props: Readonly<{ children?: ThNode }> & Readonly<P>;
}

interface ComponentLifecycle<P> {
  componentWillMount?(): void;
  componentDidMount?(): void;
  componentWillReceiveProps?(nextProps: P): void;
  componentWillUpdate?(nextProps: P): void;
  componentDidUpdate?(prevProps: P): void;
  componentWillUnmount?(): void;
}


// ----------------------------------------------------------------------
// Event System
// ----------------------------------------------------------------------

interface SyntheticEventBase<CURRENT, TARGET> {
  bubbles: boolean;
  currentTarget: EventTarget & CURRENT;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  nativeEvent: Event;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  target: EventTarget & TARGET;
  timeStamp: Date;
  type: string;
}

interface SyntheticEvent<T> extends SyntheticEventBase<T, EventTarget> {
}

interface ClipboardEvent<T> extends SyntheticEvent<T> {
  clipboardData: DataTransfer;
}

// ----------------------------------------------------------------------
// Event Handler Types
// ----------------------------------------------------------------------

interface EventHandler<E extends SyntheticEvent<any>> {
  (event: E): void;
}

type ReactEventHandler<T> = EventHandler<SyntheticEvent<T>>;

type ClipboardEventHandler<T> = EventHandler<ClipboardEvent<T>>;

// ----------------------------------------------------------------------
// Core Nodes
// ----------------------------------------------------------------------

/** Everything that can be rendered */
type ThNode = /** TODO: remove any */ any | null | undefined;

/** TODO: define all the dom attributes we support */
export interface DOMAttributes<T> {
  children?: ThNode;
  dangerouslySetInnerHTML?: {
    __html: string;
  };

  // Clipboard Events
  onCopy?: ClipboardEventHandler<T>;
  onCopyCapture?: ClipboardEventHandler<T>;
  onCut?: ClipboardEventHandler<T>;
  onCutCapture?: ClipboardEventHandler<T>;
  onPaste?: ClipboardEventHandler<T>;
  onPasteCapture?: ClipboardEventHandler<T>;
}

/** DOM element is what createElement returns */
export interface DOMElement<P extends DOMAttributes<T>, T extends Element> extends ThElement<P> {
  type: string;
  ref: Ref<T>;
}

// ----------------------------------------------------------------------
// Creation
// ----------------------------------------------------------------------

/** Takes JSX and returns a handle to the DOMElement */
export function createElement(node: any): DOMElement<any, any>;


//////////////////////
// JSX
//////////////////////
declare global {
  namespace JSX {
    interface Element extends ThElement<any> { }
  }
}