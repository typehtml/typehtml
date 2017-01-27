import * as types from '../types';

/**
 * NO_OP is used to denote that nothing should be done
 * e.g. the last render was the same as the new one.
 */
export const NO_OP = '$NO_OP';
export type NO_OP = typeof NO_OP;

export const ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';

export const isBrowser = typeof window !== 'undefined' && window.document;

// this is MUCH faster than .constructor === Array and instanceof Array
// in Node 7 and the later versions of V8, slower in older versions though
export const isArray = Array.isArray;

export function isStatefulComponent(o: any): o is types.ComponentClass<any> {
  return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}

export function isStringOrNumber(obj: any): obj is string | number {
  return isString(obj) || isNumber(obj);
}

export function isNullOrUndef(obj: any): obj is null | undefined {
  return isUndefined(obj) || isNull(obj);
}

export function isInvalid(obj: any): boolean {
  return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
}

export function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}

export function isAttrAnEvent(attr: string): boolean {
  return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}

export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

export function isNumber(obj: any): obj is number {
  return typeof obj === 'number';
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isTrue(obj: any): obj is true {
  return obj === true;
}

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isObject(o: any): boolean {
  return typeof o === 'object';
}

export function throwError(message?: string) {
  if (!message) {
    message = ERROR_MSG;
  }
  throw new Error(`TypeHtml Error: ${message}`);
}

export function warning(message: string) {
  console.error(message);
}

export const EMPTY_OBJ = {};
