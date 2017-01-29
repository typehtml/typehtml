import { patch } from '../vdom/patch';
import { VNode } from '../vdom/vnode';

export function render(input: VNode, dom: Element): VNode {
  /**
   * Since snabbdom replaces the input dom element with the vnode
   * vs.
   * React inserts the dom element into the provided vnode
   *
   * Add a dom node before giving to patch
   **/
  const renderTarget = document.createElement('div');
  dom.appendChild(renderTarget);
  return patch(renderTarget, input);
}
