# What's Here
This is a fork of snabbdom. Reasons for fork:

* Needed to add our own VNode for `ComponentFunction` and `ComponentClass`

^ Since that need to be done we decided to diverge further for a leaner version

* No need for `selectors` (it complicates `renderToString`).
* Different life cycle event names

# Some docs

* The core patching algorithm is in `snabbdom.ts`.
