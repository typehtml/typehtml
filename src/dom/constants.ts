export type Defaults<T extends string | true> = {
  [key: string]: T
}
function constructDefaults<T extends string | true>(keys: string, value: T) {
  const object: Defaults<T> = {};
  keys.split(',').forEach((i) => object[i] = value);
  return object;
}

export const xlinkNS = 'http://www.w3.org/1999/xlink';
export const xmlNS = 'http://www.w3.org/XML/1998/namespace';
export const svgNS = 'http://www.w3.org/2000/svg';

/**
 * Other HTML props we kebabize before calling
 * dom.setAttribute
 */
export const dehyphenProps = {
  httpEquiv: 'http-equiv',
  acceptCharset: 'accept-charset'
};

/**
 * SVG props that we change from fooH to foo-h
 */
export const probablyKebabProps = /^(accentH|arabicF|capH|font[FSVW]|glyph[NO]|horiz[AO]|panose1|renderingI|strikethrough[PT]|underline[PT]|v[AHIM]|vert[AO]|xH|alignmentB|baselineS|clip[PR]|color[IPR]|dominantB|enableB|fill[OR]|flood[COF]|imageR|letterS|lightingC|marker[EMS]|pointerE|shapeR|stop[CO]|stroke[DLMOW]|text[ADR]|unicodeB|wordS|writingM).*/;
export function kebabizeMatch(_, smallLetter, largeLetter): string {
  return `${smallLetter}-${largeLetter.toLowerCase()}`;
}
export function kebabize(prop: string): string {
  return prop.replace(/([a-z])([A-Z]|1)/g, kebabizeMatch);
}

/**
 * Events that are passed through event delegation
 */
export const delegatedProps =
  constructDefaults('onClick,onMouseDown,onMouseUp,onMouseMove,onSubmit,onDblClick,onKeyDown,onKeyUp,onKeyPress', true);

export const namespaces: Defaults<string> = Object.assign({},
  constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', xlinkNS),
  constructDefaults('xml:base,xml:lang,xml:space', xmlNS)
);

export const strictProps = constructDefaults('volume,defaultValue,defaultChecked', true);
export const skipProps = constructDefaults('children,childrenType,ref,key,selected,checked,multiple', true);
export const booleanProps = constructDefaults('muted,scoped,loop,open,checked,default,capture,disabled,readOnly,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate,hidden', true);
export const isUnitlessNumber = constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', true);
