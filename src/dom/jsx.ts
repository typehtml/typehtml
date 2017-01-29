/**
 * https://github.com/yelouafi/snabbdom-jsx/blob/5c358839cb208bf76023ea2c0967091a52f9bc70/snabbdom-jsx.js
 *
 * // TODO: consider bringing in https://github.com/yelouafi/snabbdom-jsx/pull/9/files
 */
import * as types from '../types';
import { VNode, TextType } from '../types';

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

function normalizeAttrs(attrs, nsURI, defNS, modules): types.VNodeData {
  var map = { ns: nsURI };
  for (var i = 0, len = modules.length; i < len; i++) {
    var mod = modules[i];
    if (attrs[mod])
      map[mod] = attrs[mod];
  }
  for (var key in attrs) {
    if (key !== 'key') {
      /**
       * We use `-` to identify the module that should handle it
       * So {on-click:foo} => {on : {click: foo}}
       **/
      var idx = key.indexOf('-');
      if (idx > 0) {
        addAttr(key.slice(0, idx), key.slice(idx + 1), attrs[key]);
      }
      else if (!map[key]) {
        addAttr(defNS, key, attrs[key]);
      }
    }
  }
  return map;

  function addAttr(namespace, key, val) {
    var ns = map[namespace] || (map[namespace] = {});
    ns[key] = val;
  }
}

function buildFromStringTag(nsURI, defNS, modules, tag: string, attrs, children: types.CreateElementChildren): VNode {
  /**
   * TODO: add ref support
   **/
  return {
    sel: tag,
    data: normalizeAttrs(attrs, nsURI, defNS, modules),
    children: children.map(function(c) {
      return isPrimitive(c) ? { text: c } : c;
    }),
    key: attrs.key
  };
}

export function buildFromComponentClass(tag: types.ComponentClass<any>, attrs, children: types.CreateElementChildren) {
  const props = Object.assign({}, attrs, { children });
  /**
   * TODO:
   * - Don't create a component instance *here*. Instead store the class in VNode
   * - component lifecycle
   **/

   /**
    * This isn't quite right as we should reuse the last instance if any
    * All this logic needs to be inside the vdom patch algorithm.
    */
  const instance = new tag(props);
  if (props.ref) {
    props.ref(instance);
  }
  const res = instance.render();

  res.key = attrs.key;
  return res;
}
export function buildFromComponentFunction(tag: types.ComponentFunction<any>, attrs, children: types.CreateElementChildren) {
  const props = Object.assign({}, attrs, { children });
  const res = tag(props);
  res.key = attrs.key;
  return res;
}
export const html = (tag: string, attrs, children: types.CreateElementChildren) => {
  return buildFromStringTag(undefined, 'props', modulesNS, tag, attrs, children);
}
export const svg = (tag, attrs, children: types.CreateElementChildren) => {
  return buildFromStringTag(SVGNS, 'attrs', modulesNS, tag, attrs, children);
}
