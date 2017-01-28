# Examples
* Add examples using eze

# Add Mobx
* devdep + peerdep `>=3.0.0`
* Use mobx.reaction around renders : https://github.com/mobxjs/mobx-react/blob/20bdcb39f43fc6466e050dca1711a64ad8d6252c/src/observer.js#L148

# Moving off of inferno
First off inferno is fantastic and works as advertised. That said,

* There is a bit of VNode mutation that feels scary (e.g. `.children` can actually be an instance of the class component and its mutated with `_` prefixed properties to track the internal lifecycle.
* Is focused on performance and does take shortctus here and there that are difficult to reason about after the fact.
* The code base is not very idiomatic TS (lots of type assertions and a vast number of implicitAnys). I guess mostly an indication of a JS -> TS code base in migration and I can empathise.

So will try and create the API off of snabbdom next and come back here if there is a need.
