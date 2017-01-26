/**
 * @module This is just an example of what the types would look like
 */
import * as types from './types';

// ----------------------------------------------------------------------
// Elements
// ----------------------------------------------------------------------
interface ThElement<P> {
  type: string | ComponentClass<P> | ComponentFunction<P>;
  props: P;
  key: types.Key | null;
}

interface ComponentFunction<P> {
  (props: P & { children?: types.ThNode }): ThElement<any>;
  defaultProps?: P;
  displayName?: string;
}

interface ComponentClass<P> {
  new (props?: P): Component<P>;
  defaultProps?: P;
  displayName?: string;
}

// Base component interface JS classes
interface Component<P> {
  props: Readonly<{ children?: types.ThNode }> & Readonly<P>;
  constructor(props?: P);
  render(): JSX.Element | null;

  /**
   * LifeCycle
   */
  componentWillMount?(): void;
  componentDidMount?(): void;
  componentWillReceiveProps?(nextProps: P): void;
  componentWillUpdate?(nextProps: P): void;
  componentDidUpdate?(prevProps: P): void;
  componentWillUnmount?(): void;
}


// ----------------------------------------------------------------------
// Creation
// ----------------------------------------------------------------------

/** Return from creating a native dom element */
export interface DOMElement<P extends types.HTMLAttributes<T>, T extends Element> extends ThElement<P> {
  type: string;
  ref: types.Ref<T>;
}
/** Return from creating a Function component */
export interface ComponentFunctionElement<P> extends ThElement<P> {
  type: ComponentFunction<P>;
  ref: types.Ref<P>;
}
/** Return from creating a Class component */
export interface ComponentClassElement<P> extends ThElement<P> {
  type: ComponentClass<P>;
  ref: types.Ref<P>;
}

/** 
 * Takes JSX and returns a handle to the DOMElement
 **/
export function createElement<P extends types.HTMLAttributes<T>, T extends Element>(
  type: string,
  props?: types.IntrinsicAttributes<T> & P,
  ...children: types.ThNode[]): DOMElement<P, T>; // native dom element support
export function createElement<P>(
  type: ComponentFunction<P>,
  props?: types.IntrinsicAttributes<P> & P,
  ...children: types.ThNode[]): ComponentFunctionElement<P>;
export function createElement<P>(
  type: ComponentClass<P>,
  props?: types.IntrinsicAttributes<P> & P,
  ...children: types.ThNode[]): ComponentClassElement<P>;

// ----------------------------------------------------------------------
// JSX
// ----------------------------------------------------------------------
declare global {
  namespace JSX {
    interface Element extends ThElement<any> { }
    interface ElementAttributesProperty { props: {}; }
    interface IntrinsicAttributes extends types.IntrinsicAttributes<void> { }
    interface IntrinsicClassAttributes<T> extends types.IntrinsicAttributes<T> { }
    interface IntrinsicElements {
      // HTML
      a: types.HTMLAttributes<HTMLAnchorElement>;
      abbr: types.HTMLAttributes<HTMLElement>;
      address: types.HTMLAttributes<HTMLElement>;
      area: types.HTMLAttributes<HTMLAreaElement>;
      article: types.HTMLAttributes<HTMLElement>;
      aside: types.HTMLAttributes<HTMLElement>;
      audio: types.HTMLAttributes<HTMLAudioElement>;
      b: types.HTMLAttributes<HTMLElement>;
      base: types.HTMLAttributes<HTMLBaseElement>;
      bdi: types.HTMLAttributes<HTMLElement>;
      bdo: types.HTMLAttributes<HTMLElement>;
      big: types.HTMLAttributes<HTMLElement>;
      blockquote: types.HTMLAttributes<HTMLElement>;
      body: types.HTMLAttributes<HTMLBodyElement>;
      br: types.HTMLAttributes<HTMLBRElement>;
      button: types.HTMLAttributes<HTMLButtonElement>;
      canvas: types.HTMLAttributes<HTMLCanvasElement>;
      caption: types.HTMLAttributes<HTMLElement>;
      cite: types.HTMLAttributes<HTMLElement>;
      code: types.HTMLAttributes<HTMLElement>;
      col: types.HTMLAttributes<HTMLTableColElement>;
      colgroup: types.HTMLAttributes<HTMLTableColElement>;
      data: types.HTMLAttributes<HTMLElement>;
      datalist: types.HTMLAttributes<HTMLDataListElement>;
      dd: types.HTMLAttributes<HTMLElement>;
      del: types.HTMLAttributes<HTMLElement>;
      details: types.HTMLAttributes<HTMLElement>;
      dfn: types.HTMLAttributes<HTMLElement>;
      dialog: types.HTMLAttributes<HTMLElement>;
      div: types.HTMLAttributes<HTMLDivElement>;
      dl: types.HTMLAttributes<HTMLDListElement>;
      dt: types.HTMLAttributes<HTMLElement>;
      em: types.HTMLAttributes<HTMLElement>;
      embed: types.HTMLAttributes<HTMLEmbedElement>;
      fieldset: types.HTMLAttributes<HTMLFieldSetElement>;
      figcaption: types.HTMLAttributes<HTMLElement>;
      figure: types.HTMLAttributes<HTMLElement>;
      footer: types.HTMLAttributes<HTMLElement>;
      form: types.HTMLAttributes<HTMLFormElement>;
      h1: types.HTMLAttributes<HTMLHeadingElement>;
      h2: types.HTMLAttributes<HTMLHeadingElement>;
      h3: types.HTMLAttributes<HTMLHeadingElement>;
      h4: types.HTMLAttributes<HTMLHeadingElement>;
      h5: types.HTMLAttributes<HTMLHeadingElement>;
      h6: types.HTMLAttributes<HTMLHeadingElement>;
      head: types.HTMLAttributes<HTMLHeadElement>;
      header: types.HTMLAttributes<HTMLElement>;
      hgroup: types.HTMLAttributes<HTMLElement>;
      hr: types.HTMLAttributes<HTMLHRElement>;
      html: types.HTMLAttributes<HTMLHtmlElement>;
      i: types.HTMLAttributes<HTMLElement>;
      iframe: types.HTMLAttributes<HTMLIFrameElement>;
      img: types.HTMLAttributes<HTMLImageElement>;
      input: types.HTMLAttributes<HTMLInputElement>;
      ins: types.HTMLAttributes<HTMLModElement>;
      kbd: types.HTMLAttributes<HTMLElement>;
      keygen: types.HTMLAttributes<HTMLElement>;
      label: types.HTMLAttributes<HTMLLabelElement>;
      legend: types.HTMLAttributes<HTMLLegendElement>;
      li: types.HTMLAttributes<HTMLLIElement>;
      link: types.HTMLAttributes<HTMLLinkElement>;
      main: types.HTMLAttributes<HTMLElement>;
      map: types.HTMLAttributes<HTMLMapElement>;
      mark: types.HTMLAttributes<HTMLElement>;
      menu: types.HTMLAttributes<HTMLElement>;
      menuitem: types.HTMLAttributes<HTMLElement>;
      meta: types.HTMLAttributes<HTMLMetaElement>;
      meter: types.HTMLAttributes<HTMLElement>;
      nav: types.HTMLAttributes<HTMLElement>;
      noindex: types.HTMLAttributes<HTMLElement>;
      noscript: types.HTMLAttributes<HTMLElement>;
      object: types.HTMLAttributes<HTMLObjectElement>;
      ol: types.HTMLAttributes<HTMLOListElement>;
      optgroup: types.HTMLAttributes<HTMLOptGroupElement>;
      option: types.HTMLAttributes<HTMLOptionElement>;
      output: types.HTMLAttributes<HTMLElement>;
      p: types.HTMLAttributes<HTMLParagraphElement>;
      param: types.HTMLAttributes<HTMLParamElement>;
      picture: types.HTMLAttributes<HTMLElement>;
      pre: types.HTMLAttributes<HTMLPreElement>;
      progress: types.HTMLAttributes<HTMLProgressElement>;
      q: types.HTMLAttributes<HTMLQuoteElement>;
      rp: types.HTMLAttributes<HTMLElement>;
      rt: types.HTMLAttributes<HTMLElement>;
      ruby: types.HTMLAttributes<HTMLElement>;
      s: types.HTMLAttributes<HTMLElement>;
      samp: types.HTMLAttributes<HTMLElement>;
      script: types.HTMLAttributes<HTMLElement>;
      section: types.HTMLAttributes<HTMLElement>;
      select: types.HTMLAttributes<HTMLSelectElement>;
      small: types.HTMLAttributes<HTMLElement>;
      source: types.HTMLAttributes<HTMLSourceElement>;
      span: types.HTMLAttributes<HTMLSpanElement>;
      strong: types.HTMLAttributes<HTMLElement>;
      style: types.HTMLAttributes<HTMLStyleElement>;
      sub: types.HTMLAttributes<HTMLElement>;
      summary: types.HTMLAttributes<HTMLElement>;
      sup: types.HTMLAttributes<HTMLElement>;
      table: types.HTMLAttributes<HTMLTableElement>;
      tbody: types.HTMLAttributes<HTMLTableSectionElement>;
      td: types.HTMLAttributes<HTMLTableDataCellElement>;
      textarea: types.HTMLAttributes<HTMLTextAreaElement>;
      tfoot: types.HTMLAttributes<HTMLTableSectionElement>;
      th: types.HTMLAttributes<HTMLTableHeaderCellElement>;
      thead: types.HTMLAttributes<HTMLTableSectionElement>;
      time: types.HTMLAttributes<HTMLElement>;
      title: types.HTMLAttributes<HTMLTitleElement>;
      tr: types.HTMLAttributes<HTMLTableRowElement>;
      track: types.HTMLAttributes<HTMLTrackElement>;
      u: types.HTMLAttributes<HTMLElement>;
      ul: types.HTMLAttributes<HTMLUListElement>;
      var: types.HTMLAttributes<HTMLElement>;
      video: types.HTMLAttributes<HTMLVideoElement>;
      wbr: types.HTMLAttributes<HTMLElement>;
    }
  }
}