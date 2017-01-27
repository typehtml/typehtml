import { VNode } from '../types';
export type Hook<T> = (item: T) => any | null;

export default {
  recyclingEnabled: true,

  /** Called on new VNode creation */
  createVNode: null as Hook<VNode<any>>,

  /** Other life cycle hooks */
  beforeRender: null,
	afterRender: null,
	afterMount: null,
	afterUpdate: null,
	beforeUnmount: null
};
