/** Everything that can be rendered */
export type ThNode = /** TODO: remove any */ any | null | undefined;
export type ThChildren = ThNode;


// ----------------------------------------------------------------------
// VNode
// ----------------------------------------------------------------------
export type Type = string | Function | null;

export type VNodeProps = {
	children?: ThChildren;
	ref?: Ref<any>;
	key?: Key;
	events?: Object | null;
}

export const enum VNodeFlags {
  Text = 1,
  HtmlElement = 1 << 1,

  ComponentClass = 1 << 2,
  ComponentFunction = 1 << 3,
  ComponentUnknown = 1 << 4,

  HasKeyedChildren = 1 << 5,
  HasNonKeyedChildren = 1 << 6,

  SvgElement = 1 << 7,
  MediaElement = 1 << 8,
  InputElement = 1 << 9,
  TextareaElement = 1 << 10,
  SelectElement = 1 << 11,
  Void = 1 << 12,
  Element = HtmlElement | SvgElement | MediaElement | InputElement | TextareaElement | SelectElement,
  Component = ComponentFunction | ComponentClass | ComponentUnknown
}

export interface VNode {
  children: ThChildren;
  dom: Element | null;
  events: Object | null;
  flags: VNodeFlags;
  key: Key;
  props: VNodeProps | null; // TODO: props
  ref: Ref<any>;
  type: Type;
  parentVNode?: VNode;
}

// ----------------------------------------------------------------------
// Event System
// ----------------------------------------------------------------------

export interface SyntheticEventBase<CURRENT, TARGET> {
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

export interface SyntheticEvent<T> extends SyntheticEventBase<T, EventTarget> {
}

export interface ClipboardEvent<T> extends SyntheticEvent<T> {
  clipboardData: DataTransfer;
}



// ----------------------------------------------------------------------
// Event Handler Types
// ----------------------------------------------------------------------

export interface EventHandler<E extends SyntheticEvent<any>> {
  (event: E): void;
}

export type ReactEventHandler<T> = EventHandler<SyntheticEvent<T>>;

export type ClipboardEventHandler<T> = EventHandler<ClipboardEvent<T>>;

// ----------------------------------------------------------------------
// Key and Ref
// ----------------------------------------------------------------------
export type Key = string | number;
export type Ref<T> = (instance: T) => any;

// ----------------------------------------------------------------------
// Attributes
// ----------------------------------------------------------------------

/**
 * The core attributes on all things
 */
export interface IntrinsicAttributes<T> {
  key?: Key;
  ref?: Ref<T>;
}

export interface HTMLAttributes<T> extends IntrinsicAttributes<T> {
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

  // Other attributes we support
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

  /** TODO: define all the dom attributes we support */
}

/**
 * The three broad type categories are (in order of restrictiveness):
 * - "number | string"
 * - "string"
 * - union of string literals
 */
export interface SVGAttributes<T> extends HTMLAttributes<T> {
  accentHeight?: number | string;
  accumulate?: "none" | "sum";
  additive?: "replace" | "sum";
  alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit";
  allowReorder?: "no" | "yes";
  alphabetic?: number | string;
  amplitude?: number | string;
  arabicForm?: "initial" | "medial" | "terminal" | "isolated";
  ascent?: number | string;
  attributeName?: string;
  attributeType?: string;
  autoReverse?: number | string;
  azimuth?: number | string;
  baseFrequency?: number | string;
  baselineShift?: number | string;
  baseProfile?: number | string;
  bbox?: number | string;
  begin?: number | string;
  bias?: number | string;
  by?: number | string;
  calcMode?: number | string;
  capHeight?: number | string;
  clip?: number | string;
  clipPath?: string;
  clipPathUnits?: number | string;
  clipRule?: number | string;
  colorInterpolation?: number | string;
  colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit";
  colorProfile?: number | string;
  colorRendering?: number | string;
  contentScriptType?: number | string;
  contentStyleType?: number | string;
  cursor?: number | string;
  cx?: number | string;
  cy?: number | string;
  d?: string;
  decelerate?: number | string;
  descent?: number | string;
  diffuseConstant?: number | string;
  direction?: number | string;
  display?: number | string;
  divisor?: number | string;
  dominantBaseline?: number | string;
  dur?: number | string;
  dx?: number | string;
  dy?: number | string;
  edgeMode?: number | string;
  elevation?: number | string;
  enableBackground?: number | string;
  end?: number | string;
  exponent?: number | string;
  externalResourcesRequired?: number | string;
  fill?: string;
  fillOpacity?: number | string;
  fillRule?: "nonzero" | "evenodd" | "inherit";
  filter?: string;
  filterRes?: number | string;
  filterUnits?: number | string;
  floodColor?: number | string;
  floodOpacity?: number | string;
  focusable?: number | string;
  fontFamily?: string;
  fontSize?: number | string;
  fontSizeAdjust?: number | string;
  fontStretch?: number | string;
  fontStyle?: number | string;
  fontVariant?: number | string;
  fontWeight?: number | string;
  format?: number | string;
  from?: number | string;
  fx?: number | string;
  fy?: number | string;
  g1?: number | string;
  g2?: number | string;
  glyphName?: number | string;
  glyphOrientationHorizontal?: number | string;
  glyphOrientationVertical?: number | string;
  glyphRef?: number | string;
  gradientTransform?: string;
  gradientUnits?: string;
  hanging?: number | string;
  horizAdvX?: number | string;
  horizOriginX?: number | string;
  ideographic?: number | string;
  imageRendering?: number | string;
  in2?: number | string;
  in?: string;
  intercept?: number | string;
  k1?: number | string;
  k2?: number | string;
  k3?: number | string;
  k4?: number | string;
  k?: number | string;
  kernelMatrix?: number | string;
  kernelUnitLength?: number | string;
  kerning?: number | string;
  keyPoints?: number | string;
  keySplines?: number | string;
  keyTimes?: number | string;
  lengthAdjust?: number | string;
  letterSpacing?: number | string;
  lightingColor?: number | string;
  limitingConeAngle?: number | string;
  local?: number | string;
  markerEnd?: string;
  markerHeight?: number | string;
  markerMid?: string;
  markerStart?: string;
  markerUnits?: number | string;
  markerWidth?: number | string;
  mask?: string;
  maskContentUnits?: number | string;
  maskUnits?: number | string;
  mathematical?: number | string;
  mode?: number | string;
  numOctaves?: number | string;
  offset?: number | string;
  opacity?: number | string;
  operator?: number | string;
  order?: number | string;
  orient?: number | string;
  orientation?: number | string;
  origin?: number | string;
  overflow?: number | string;
  overlinePosition?: number | string;
  overlineThickness?: number | string;
  paintOrder?: number | string;
  panose1?: number | string;
  pathLength?: number | string;
  patternContentUnits?: string;
  patternTransform?: number | string;
  patternUnits?: string;
  pointerEvents?: number | string;
  points?: string;
  pointsAtX?: number | string;
  pointsAtY?: number | string;
  pointsAtZ?: number | string;
  preserveAlpha?: number | string;
  preserveAspectRatio?: string;
  primitiveUnits?: number | string;
  r?: number | string;
  radius?: number | string;
  refX?: number | string;
  refY?: number | string;
  renderingIntent?: number | string;
  repeatCount?: number | string;
  repeatDur?: number | string;
  requiredExtensions?: number | string;
  requiredFeatures?: number | string;
  restart?: number | string;
  result?: string;
  rotate?: number | string;
  rx?: number | string;
  ry?: number | string;
  scale?: number | string;
  seed?: number | string;
  shapeRendering?: number | string;
  slope?: number | string;
  spacing?: number | string;
  specularConstant?: number | string;
  specularExponent?: number | string;
  speed?: number | string;
  spreadMethod?: string;
  startOffset?: number | string;
  stdDeviation?: number | string
  stemh?: number | string;
  stemv?: number | string;
  stitchTiles?: number | string;
  stopColor?: string;
  stopOpacity?: number | string;
  strikethroughPosition?: number | string;
  strikethroughThickness?: number | string;
  string?: number | string;
  stroke?: string;
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeLinecap?: "butt" | "round" | "square" | "inherit";
  strokeLinejoin?: "miter" | "round" | "bevel" | "inherit";
  strokeMiterlimit?: string;
  strokeOpacity?: number | string;
  strokeWidth?: number | string;
  surfaceScale?: number | string;
  systemLanguage?: number | string;
  tableValues?: number | string;
  targetX?: number | string;
  targetY?: number | string;
  textAnchor?: string;
  textDecoration?: number | string;
  textLength?: number | string;
  textRendering?: number | string;
  to?: number | string;
  transform?: string;
  type?: string;
  u1?: number | string;
  u2?: number | string;
  underlinePosition?: number | string;
  underlineThickness?: number | string;
  unicode?: number | string;
  unicodeBidi?: number | string;
  unicodeRange?: number | string;
  unitsPerEm?: number | string;
  vAlphabetic?: number | string;
  values?: string;
  vectorEffect?: number | string;
  version?: string;
  vertAdvY?: number | string;
  vertOriginX?: number | string;
  vertOriginY?: number | string;
  vHanging?: number | string;
  vIdeographic?: number | string;
  viewBox?: string;
  viewTarget?: number | string;
  visibility?: number | string;
  vMathematical?: number | string;
  widths?: number | string;
  wordSpacing?: number | string;
  writingMode?: number | string;
  x1?: number | string;
  x2?: number | string;
  x?: number | string;
  xChannelSelector?: string;
  xHeight?: number | string;
  xlinkActuate?: string;
  xlinkArcrole?: string;
  xlinkHref?: string;
  xlinkRole?: string;
  xlinkShow?: string;
  xlinkTitle?: string;
  xlinkType?: string;
  xmlBase?: string;
  xmlLang?: string;
  xmlns?: string;
  xmlnsXlink?: string;
  xmlSpace?: string;
  y1?: number | string;
  y2?: number | string;
  y?: number | string;
  yChannelSelector?: string;
  z?: number | string;
  zoomAndPan?: string;
}