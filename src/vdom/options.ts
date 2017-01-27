export default {
  recyclingEnabled: true,

  /** Called on new VNode creation */
  createVNode: null,

  /** Other life cycle hooks */
	beforeRender: null,
	afterRender: null,
	afterMount: null,
	afterUpdate: null,
	beforeUnmount: null
};
