/**
 * https://github.com/yelouafi/snabbdom-jsx/blob/5c358839cb208bf76023ea2c0967091a52f9bc70/snabbdom-jsx.js
 *
 * // TODO: consider bringing in https://github.com/yelouafi/snabbdom-jsx/pull/9/files
 */
import { VNode, TextType } from '../vdom/vnode';
import * as types from '../types';

const SVGNS = 'http://www.w3.org/2000/svg';
const modulesNS = ['hook', 'on', 'style', 'class', 'props', 'attrs', 'dataset'];

function isPrimitive(val: any): val is TextType {
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

function buildFromStringTag(nsURI, defNS, modules, tag: string, attrs, children: types.CreateElementChildren): VNode {
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

function buildFromFunctionComponent(nsURI, defNS, modules, tag: types.ComponentFunction<any>, attrs, children: types.CreateElementChildren) {
  const props = Object.assign({}, attrs, { children });
  const res = tag(props);
  res.key = attrs.key;
  return res;
}


function buildVnode(nsURI, defNS, modules, tag, attrs, children: types.CreateElementChildren): VNode {
  attrs = attrs || {};
  if (typeof tag === 'string') {
    return buildFromStringTag(nsURI, defNS, modules, tag, attrs, children);
  }
  else if (typeof tag === 'function') {
    return buildFromFunctionComponent(nsURI, defNS, modules, tag, attrs, children);
  }
  else {
    throw new Error("JSX tag must be either a string, a function or an object with 'view' or 'render' methods");
  }
}

export const html = (tag, attrs, children: types.CreateElementChildren) => {
  return buildVnode(undefined, 'props', modulesNS, tag, attrs, children);
};
export const svg = (tag, attrs, children: types.CreateElementChildren) => {
  return buildVnode(SVGNS, 'attrs', modulesNS, tag, attrs, children);
};
