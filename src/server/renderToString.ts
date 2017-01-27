import { VNodeFlags, VNode, ComponentClass, ComponentFunction } from '../types';
import {
  copyPropsTo
} from '../vdom/normalization';
import { isUnitlessNumber } from '../dom/constants';
import {
  isArray,
  isFunction,
  isInvalid,
  isNull,
  isNullOrUndef,
  isNumber,
  isStringOrNumber,
  isTrue,
  throwError,
  EMPTY_OBJ,
} from '../vdom/shared';
import {
  escapeText,
  isVoidElement as _isVoidElement,
  toHyphenCase
} from './utils';

function renderStylesToString(styles) {
  if (isStringOrNumber(styles)) {
    return styles;
  } else {
    let renderedString = '';

    for (let styleName in styles) {
      const value = styles[styleName];
      const px = isNumber(value) && !isUnitlessNumber[styleName] ? 'px' : '';

      if (!isNullOrUndef(value)) {
        renderedString += `${toHyphenCase(styleName)}:${escapeText(value)}${px};`;
      }
    }
    return renderedString;
  }
}

function renderVNodeToString(vNode: VNode, firstChild: boolean): string {
  const flags = vNode.flags;
  const type = vNode.type;
  const props = vNode.props || EMPTY_OBJ;
  const children = vNode.children;

  if (flags & VNodeFlags.Component) {
    // Primitive node doesn't have defaultProps, only Component
    const type = vNode.type as (ComponentClass<any> | ComponentFunction<any>);
    if (!isNullOrUndef(type.defaultProps)) {
      copyPropsTo(type.defaultProps, props);
      vNode.props = props;
    }

    const isClass = flags & VNodeFlags.ComponentClass;
    if (isClass) {
      const type = vNode.type as (ComponentClass<any>);
      const instance = new type(props);

      if (instance.props === EMPTY_OBJ) {
        instance.props = props;
      }
      instance._pendingSetState = true;
      instance._unmounted = false;
      if (isFunction(instance.componentWillMount)) {
        instance.componentWillMount();
      }
      const nextVNode = instance.render();

      instance._pendingSetState = false;
      // In case render returns invalid stuff
      if (isInvalid(nextVNode)) {
        return '<!--!-->';
      }
      return renderVNodeToString(nextVNode as any, true);
    } else {
      const type = vNode.type as (ComponentFunction<any>);
      const nextVNode = type(props);

      if (isInvalid(nextVNode)) {
        return '<!--!-->';
      }
      return renderVNodeToString(nextVNode as any, true);
    }
  } else if (flags & VNodeFlags.Element) {
    let renderedString = `<${type}`;
    let html;
    const isVoidElement = _isVoidElement(type);

    if (!isNull(props)) {
      for (let prop in props) {
        const value = props[prop];

        if (prop === 'dangerouslySetInnerHTML') {
          html = value.__html;
        } else if (prop === 'style') {
          renderedString += ` style="${renderStylesToString((props as any).style)}"`;
        } else if (prop === 'className' && !isNullOrUndef(value)) {
          renderedString += ` class="${escapeText(value)}"`;
        } else if (prop === 'children') {
          // Ignore children as prop.
        } else {
          if (isStringOrNumber(value)) {
            renderedString += ` ${prop}="${escapeText(value)}"`;
          } else if (isTrue(value)) {
            renderedString += ` ${prop}`;
          }
        }
      }
    }
    if (isVoidElement) {
      renderedString += `>`;
    } else {
      renderedString += `>`;
      if (!isInvalid(children)) {
        if (isArray(children)) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (isStringOrNumber(child)) {
              renderedString += escapeText(child);
            } else if (!isInvalid(child)) {
              renderedString += renderVNodeToString(child as VNode, i === 0);
            }
          }
        } else if (isStringOrNumber(children)) {
          renderedString += escapeText(children);
        } else {
          renderedString += renderVNodeToString(children as VNode, true);
        }
      } else if (html) {
        renderedString += html;
      }
      if (!isVoidElement) {
        renderedString += `</${type}>`;
      }
    }
    return renderedString;
  } else if (flags & VNodeFlags.Text) {
    return (firstChild ? '' : '<!---->') + escapeText(children);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof vNode === 'object') {
        throwError(`renderToString() received an object that's not a valid VNode, you should stringify it first. Object: "${JSON.stringify(vNode)}".`);
      } else {
        throwError(`renderToString() expects a valid VNode, instead it received an object with the type "${typeof vNode}".`);
      }
    }
    throwError();
  }
}

export function renderToString(input: any): string {
  return renderVNodeToString(input, true);
}

export function renderToStaticMarkup(input: any): string {
  return renderVNodeToString(input, true);
}