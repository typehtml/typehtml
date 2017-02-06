# Examples
* Add examples using eze

# Add Mobx
* devdep + peerdep `>=3.0.0`

# LifeCycle
* Add component lifecycle

# Mobx wasting renders
One idea is touse mobx.reaction around renders : https://github.com/mobxjs/mobx-react/blob/20bdcb39f43fc6466e050dca1711a64ad8d6252c/src/observer.js#L148

Alternatively components that are pure should simply mark their `renders` as `@computed`
