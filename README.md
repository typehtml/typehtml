# TypeHtml

> I am just dreaming of a better world here 🌹

Imagine the following API for pure function components

```tsx
const Heading = ({text}) => <h1>{text}</h1>
```

or pure function components created using classes 

```tsx
class Heading {
  props: {text:string}

  render() {
    return <h1 onClick={this.handleClick}>{this.props.text}</h1>
  }

  handleClick = () => console.log('hello')
}
```

* All state is powered by mobx. 
* All code is written in and for TypeScript. 

## Why?
I absolutely love react and [recently shared my love as well](https://medium.com/@basarat/typescript-developers-love-react-9871b494bc1a#.ybe5nkjvi). That said:

* Every single time I need to run `npm install react react-dom @type/react @types/react-dom` a part of me dies a little. 
* Having external type definitions for a library is not enough. You need to think TypeScript first when designing the API.
* It also gives an opportunity for people to complain about TypeScript whereas in reality the alternative is really an non-analysed mess (if the compiler can't analyse it, neither can new dev to the code, have empathy).
* React has stuff I no longer need e.g. [setState](https://medium.com/@mweststrate/3-reasons-why-i-stopped-using-react-setstate-ab73fc67a42e#.dbzy2qwoh) and [abstractions to support react native](https://www.youtube.com/watch?v=dRo_egw7tBc&feature=youtu.be&t=35m17s). Learn once and *rewrite* wastes human resources.
* Also the React codebase would benefit from [TypeScript / More type annotations](https://www.youtube.com/watch?v=dRo_egw7tBc&feature=youtu.be&t=20m42s)