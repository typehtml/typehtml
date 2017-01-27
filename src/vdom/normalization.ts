import { VNode, ThChildren, VNodeFlags, VNodeProps } from '../types';
import {
  isArray,
  isInvalid,
  isNull,
  isNullOrUndef,
  isNumber,
  isString,
  isStringOrNumber,
  isUndefined,
  warning
} from './shared';
import { cloneVNode, createTextVNode, isVNode } from './VNodes';

function applyKey(key: string, vNode: VNode<any>) {
  vNode.key = key;

  return vNode;
}

function applyKeyIfMissing(key: string | number, vNode: VNode<any>): VNode<any> {
  if (isNumber(key)) {
    key = `.${key}`;
  }
  if (isNull(vNode.key) || vNode.key[0] === '.') {
    return applyKey(key as string, vNode);
  }
  return vNode;
}

function applyKeyPrefix(key: string, vNode: VNode<any>): VNode<any> {
  vNode.key = key + vNode.key;

  return vNode;
}

function _normalizeVNodes(nodes: any[], result: VNode<any>[], index: number, currentKey) {
  for (; index < nodes.length; index++) {
    let n = nodes[index];
    const key = `${currentKey}.${index}`;

    if (!isInvalid(n)) {
      if (isArray(n)) {
        _normalizeVNodes(n, result, 0, key);
      } else {
        if (isStringOrNumber(n)) {
          n = createTextVNode(n);
        } else if (isVNode(n) && n.dom || (n.key && n.key[0] === '.')) {
          n = cloneVNode(n);
        }
        if (isNull(n.key) || n.key[0] === '.') {
          n = applyKey(key, n as VNode<any>);
        } else {
          n = applyKeyPrefix(currentKey, n as VNode<any>);
        }

        result.push(n);
      }
    }
  }
}

export function normalizeVNodes(nodes: any[]): VNode<any>[] {
  let newNodes;

  // we assign $ which basically means we've flagged this array for future note
  // if it comes back again, we need to clone it, as people are using it
  // in an immutable way
  // tslint:disable
  if (nodes['$']) {
    nodes = nodes.slice();
  } else {
    nodes['$'] = true;
  }
  // tslint:enable
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];

    if (isInvalid(n) || isArray(n)) {
      const result = (newNodes || nodes).slice(0, i) as VNode<any>[];

      _normalizeVNodes(nodes, result, i, ``);
      return result;
    } else if (isStringOrNumber(n)) {
      if (!newNodes) {
        newNodes = nodes.slice(0, i) as VNode<any>[];
      }
      newNodes.push(applyKeyIfMissing(i, createTextVNode(n)));
    } else if ((isVNode(n) && n.dom) || (isNull(n.key) && !(n.flags & VNodeFlags.HasNonKeyedChildren))) {
      if (!newNodes) {
        newNodes = nodes.slice(0, i) as VNode<any>[];
      }
      newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
    } else if (newNodes) {
      newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
    }
  }

  return newNodes || nodes as VNode<any>[];
}

function normalizeChildren(children: ThChildren | null) {
  if (isArray(children)) {
    return normalizeVNodes(children);
  } else if (isVNode(children as VNode<any>) && (children as VNode<any>).dom) {
    return cloneVNode(children as VNode<any>);
  }

  return children;
}

function normalizeProps(vNode: VNode<any>, props: VNodeProps, children: ThChildren) {
  if (!(vNode.flags & VNodeFlags.Component) && isNullOrUndef(children) && !isNullOrUndef(props.children)) {
    vNode.children = props.children;
  }
  if (props.ref) {
    vNode.ref = props.ref;
    delete props.ref;
  }
  if (props.events) {
    vNode.events = props.events;
  }
  if (!isNullOrUndef(props.key)) {
    vNode.key = props.key;
    delete props.key;
  }
}

export function copyPropsTo(copyFrom: VNodeProps, copyTo: VNodeProps) {
  for (let prop in copyFrom) {
    if (isUndefined(copyTo[prop])) {
      copyTo[prop] = copyFrom[prop];
    }
  }
}

function normalizeElement(type: string, vNode: VNode<any>) {
  if (type === 'svg') {
    vNode.flags = VNodeFlags.SvgElement;
  } else if (type === 'input') {
    vNode.flags = VNodeFlags.InputElement;
  } else if (type === 'select') {
    vNode.flags = VNodeFlags.SelectElement;
  } else if (type === 'textarea') {
    vNode.flags = VNodeFlags.TextareaElement;
  } else if (type === 'media') {
    vNode.flags = VNodeFlags.MediaElement;
  } else {
    vNode.flags = VNodeFlags.HtmlElement;
  }
}

export function normalize(vNode: VNode<any>): void {
  const props = vNode.props;
  const hasProps = !isNull(props);
  const type = vNode.type;
  let children = vNode.children;

  // convert a wrongly created type back to element
  if (isString(type) && (vNode.flags & VNodeFlags.Component)) {
    normalizeElement(type as string, vNode);
    if (hasProps && props.children) {
      vNode.children = props.children;
      children = props.children;
    }
  }
  if (hasProps) {
    normalizeProps(vNode, props, children);
  }
  if (!isInvalid(children)) {
    vNode.children = normalizeChildren(children);
  }
  if (hasProps && !isInvalid(props.children)) {
    props.children = normalizeChildren(props.children);
  }

  if (process.env.NODE_ENV !== 'production') {

    // This code will be stripped out from production CODE
    // It will help users to track errors in their applications.

    const verifyKeys = function(vNodes) {
      const keyValues = vNodes.map(function(vnode) { return vnode.key; });
      keyValues.some(function(item, idx) {
        const hasDuplicate = keyValues.indexOf(item) !== idx;

        if (hasDuplicate) {
          warning(true, 'Inferno normalisation(...): Encountered two children with same key, all keys must be unique within its siblings. Duplicated key is:' + item);
        }

        return hasDuplicate;
      });
    };

    if (vNode.children && Array.isArray(vNode.children)) {
      verifyKeys(vNode.children);
    }
  }
}
