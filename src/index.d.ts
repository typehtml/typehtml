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

interface Attributes<T> {
  key?: Key;
  ref?: (t: T) => any;
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

interface HTMLAttributes<T> extends DOMAttributes<T> {
  // Standard HTML Attributes
  accept?: string;
  acceptCharset?: string;
  accessKey?: string;
  action?: string;
  allowFullScreen?: boolean;
  allowTransparency?: boolean;
  alt?: string;
  async?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  autoPlay?: boolean;
  capture?: boolean;
  cellPadding?: number | string;
  cellSpacing?: number | string;
  charSet?: string;
  challenge?: string;
  checked?: boolean;
  classID?: string;
  className?: string;
  cols?: number;
  colSpan?: number;
  content?: string;
  contentEditable?: boolean;
  contextMenu?: string;
  controls?: boolean;
  coords?: string;
  crossOrigin?: string;
  data?: string;
  dateTime?: string;
  default?: boolean;
  defer?: boolean;
  dir?: string;
  disabled?: boolean;
  download?: any;
  draggable?: boolean;
  encType?: string;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  frameBorder?: number | string;
  headers?: string;
  height?: number | string;
  hidden?: boolean;
  high?: number;
  href?: string;
  hrefLang?: string;
  htmlFor?: string;
  httpEquiv?: string;
  id?: string;
  inputMode?: string;
  integrity?: string;
  is?: string;
  keyParams?: string;
  keyType?: string;
  kind?: string;
  label?: string;
  lang?: string;
  list?: string;
  loop?: boolean;
  low?: number;
  manifest?: string;
  marginHeight?: number;
  marginWidth?: number;
  max?: number | string;
  maxLength?: number;
  media?: string;
  mediaGroup?: string;
  method?: string;
  min?: number | string;
  minLength?: number;
  multiple?: boolean;
  muted?: boolean;
  name?: string;
  nonce?: string;
  noValidate?: boolean;
  open?: boolean;
  optimum?: number;
  pattern?: string;
  placeholder?: string;
  playsInline?: boolean;
  poster?: string;
  preload?: string;
  radioGroup?: string;
  readOnly?: boolean;
  rel?: string;
  required?: boolean;
  reversed?: boolean;
  role?: string;
  rows?: number;
  rowSpan?: number;
  sandbox?: string;
  scope?: string;
  scoped?: boolean;
  scrolling?: string;
  seamless?: boolean;
  selected?: boolean;
  shape?: string;
  size?: number;
  sizes?: string;
  span?: number;
  spellCheck?: boolean;
  src?: string;
  srcDoc?: string;
  srcLang?: string;
  srcSet?: string;
  start?: number;
  step?: number | string;
  style?: any;
  summary?: string;
  tabIndex?: number;
  target?: string;
  title?: string;
  type?: string;
  useMap?: string;
  value?: string | string[] | number;
  width?: number | string;
  wmode?: string;
  wrap?: string;

  // RDFa Attributes
  about?: string;
  datatype?: string;
  inlist?: any;
  prefix?: string;
  property?: string;
  resource?: string;
  typeof?: string;
  vocab?: string;

  // Non-standard Attributes
  autoCapitalize?: string;
  autoCorrect?: string;
  autoSave?: string;
  color?: string;
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
  itemID?: string;
  itemRef?: string;
  results?: number;
  security?: string;
  unselectable?: boolean;
}

interface HTMLProps<T> extends HTMLAttributes<T>, Attributes<T> {
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
export function createElement<P extends DOMAttributes<T>, T extends Element>(
    type: string,
    props?: Attributes<T> & P,
    ...children: ThNode[]): DOMElement<P, T>;

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