# What's Here
This is a fork of snabbdom. Reasons for fork:

* Needed to add our own VNode for `ComponentFunction` and `ComponentClass`

^ Since that need to be done we decided to diverge further for a leaner version

* No need for `selectors` (it complicates `renderToString`).
* Different life cycle event names

# Some docs

* The core patching algorithm is in `snabbdom.ts`.


## VNode
Just an object. A creator does exit in `vnode.ts` but doesn't have to be used.

* `vnode.sel` in snabbdom means `tag+id+classes`. Based on our `createElement` is always just `tag`

VNode equality (for patching) is in `snabbdom.ts` and simply:

```ts
function sameVnode(vnode1: VNode, vnode2: VNode): boolean {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
```

If its the same then the call eventually comes to

```ts
patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
```

The `patchVnode` really delegates most of the hard work to the module hooks. The only thing it handles internally is changes to the `text` property of a vnode.

> This means we can use `sel` to store our component function and component classes too!
