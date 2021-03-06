import { autorun } from 'mobx';
import { patch } from '../vdom/patch';
import { VNode } from '../types';

export function render(input: () => VNode, dom: Element): void {
  /**
   * Since snabbdom replaces the input dom element with the vnode
   * vs.
   * React inserts the dom element into the provided vnode
   *
   * Add a dom node before giving to patch
   **/
  const renderTarget = document.createElement('div');
  dom.appendChild(renderTarget);

  let lastVNode: VNode | Element = renderTarget;
  autorun(() => {
    const nextVNode = input();
    patch(lastVNode, nextVNode);
    lastVNode = nextVNode;
  });
}
