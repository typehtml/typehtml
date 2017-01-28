import { VNode } from './vnode';
import { init } from './snabbdom';
import { attributesModule } from './modules/attributes'; // for setting attributes on DOM elements
import { classModule } from './modules/class'; // makes it easy to toggle classes
import { propsModule } from './modules/props'; // for setting properties on DOM elements
import { styleModule } from './modules/style'; // handles styling on elements with support for animations
import { eventListenersModule } from './modules/eventlisteners'; // attaches event listeners

export const patch = init([ // Init patch function with choosen modules
  attributesModule,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
]) as (oldVNode: Element | VNode, vnode: VNode) => void;
