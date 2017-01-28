/**
 * https://github.com/yelouafi/snabbdom-jsx/blob/5c358839cb208bf76023ea2c0967091a52f9bc70/snabbdom-jsx.js
 */
import { VNode } from '../vdom/vnode';
import * as types from '../types';

const SVGNS = 'http://www.w3.org/2000/svg';
const modulesNS = ['hook', 'on', 'style', 'class', 'props', 'attrs', 'dataset'];

function isPrimitive(val: any) {
  return typeof val === 'string' ||
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    typeof val === 'symbol' ||
    val === null ||
    val === undefined;
}

function normalizeAttrs(attrs, nsURI, defNS, modules) {
  var map = { ns: nsURI };
  for (var i = 0, len = modules.length; i < len; i++) {
    var mod = modules[i];
    if (attrs[mod])
      map[mod] = attrs[mod];
  }
  for (var key in attrs) {
    if (key !== 'key' && key !== 'classNames' && key !== 'selector') {
      var idx = key.indexOf('-');
      if (idx > 0)
        addAttr(key.slice(0, idx), key.slice(idx + 1), attrs[key]);
      else if (!map[key])
        addAttr(defNS, key, attrs[key]);
    }
  }
  return map;

  function addAttr(namespace, key, val) {
    var ns = map[namespace] || (map[namespace] = {});
    ns[key] = val;
  }
}

function buildFromStringTag(nsURI, defNS, modules, tag, attrs, children): VNode {
  if (attrs.selector) {
    tag = tag + attrs.selector;
  }
  if (attrs.classNames) {
    var cns = attrs.classNames;
    tag = tag + '.' + (
      Array.isArray(cns) ? cns.join('.') : cns.replace(/\s+/g, '.')
    );
  }

  return {
    sel: tag,
    data: normalizeAttrs(attrs, nsURI, defNS, modules),
    children: children.map(function(c) {
      return isPrimitive(c) ? { text: c } : c;
    }),
    key: attrs.key
  };
}

function buildFromComponent(nsURI, defNS, modules, tag, attrs, children) {
  var res;
  if (typeof tag === 'function')
    res = tag(attrs, children);
  else if (tag && typeof tag.view === 'function')
    res = tag.view(attrs, children);
  else if (tag && typeof tag.render === 'function')
    res = tag.render(attrs, children);
  else
    throw "JSX tag must be either a string, a function or an object with 'view' or 'render' methods";
  res.key = attrs.key;
  return res;
}


namespace NormalizeChildren {
  function flatten<T>(nested: T[], start: number, flat: T[]): void {
    for (var i = start, len = nested.length; i < len; i++) {
      var item = nested[i];
      if (Array.isArray(item)) {
        flatten(item, 0, flat);
      } else {
        flat.push(item);
      }
    }
  }
  export function maybeFlatten<T>(array?: T[] | T[][]): T[] {
    if (array) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (Array.isArray(array[i])) {
          var flat = array.slice(0, i);
          flatten<T>(array as any, i, flat as any);
          array = flat;
          break;
        }
      }
    }
    return array as any;
  }
}

function buildVnode(nsURI, defNS, modules, tag, attrs, children: types.CreateElementChildren) {
  attrs = attrs || {};
  children = NormalizeChildren.maybeFlatten(children);
  if (typeof tag === 'string') {
    return buildFromStringTag(nsURI, defNS, modules, tag, attrs, children)
  } else {
    return buildFromComponent(nsURI, defNS, modules, tag, attrs, children)
  }
}

function JSX(nsURI?, defNS?, modules?) {
  return function jsxWithCustomNS(tag, attrs, children: types.CreateElementChildren) {
    return buildVnode(nsURI, defNS || 'props', modules || modulesNS, tag, attrs, children);
  };
}

export const html = JSX(undefined);
export const svg = JSX(SVGNS, 'attrs');
