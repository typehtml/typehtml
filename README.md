# TypeHtml

> I am just dreaming of a better world here 🌹

Imagine the following API for creating component using functions

```ts
const Heading = ({text}) => <h1>{text}</h1>
```

or using classes

```ts
class Heading {
  constructor(
    private props: {text:string}
  ) {}

  render() {
    return <h1 onClick={this.handleClick}>{this.props.text}</h1>
  }

  handleClick = () => console.log('hello')
}
```

* All state is powered by mobx.
* All code is written in and for TypeScript.

![](https://raw.githubusercontent.com/typehtml/typehtml.github.io/master/screens/demo.gif)

> Like to see this dream become a reality? [Go ahead and ⭐ it!](https://github.com/typehtml/typehtml/stargazers)

## Why?
I absolutely love react and [recently shared my love as well](https://medium.com/@basarat/typescript-developers-love-react-9871b494bc1a#.ybe5nkjvi). That said:

* Every single time I need to run `npm install react react-dom @type/react @types/react-dom` a part of me dies a little.
* Having external type definitions for a library is not enough. You need to think TypeScript first when designing the API.
* It also gives an opportunity for people to complain about TypeScript whereas in reality the alternative is really an non-analysed mess (if the compiler can't analyse it, neither can new dev to the code, have empathy).
* React has stuff I no longer need e.g. [setState](https://medium.com/@mweststrate/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e#.dbzy2qwoh) and [abstractions to support react native](https://www.youtube.com/watch?v=dRo_egw7tBc&feature=youtu.be&t=35m17s). Learn once and *rewrite* wastes human resources.
* Also the React codebase would benefit from [TypeScript / More type annotations](https://www.youtube.com/watch?v=dRo_egw7tBc&feature=youtu.be&t=20m42s)

# Key Differentiators

Beyond being in / for TypeScript, the following are a few other differentiators.

> It is nearly impossible to know yet if these ideas are good or bad. In a magical world where this idea performs well, it definitely results in less developer code.

* Components are pure.
  * They are always a side effect of a mobx observed change.
  * You wouldn't want a reaction to happen unless an observable changed, similarly you don't want a component re-render unless a prop (or local observable for classes) changes.
* Components using functions and classes have the same features (results in simpler code base + types + learning curve).
* Context is just a fancy global (and an untyped one at that). And there are better ways to handle globals, so removed it.
