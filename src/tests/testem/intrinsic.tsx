import * as Th from '../../index';
import * as assert from 'assert';
import { observable, action } from 'mobx';

describe('render intrinsic', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can render a tag', () => {
    Th.render(() => <div>Hello World</div>, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can render children as props', () => {
    Th.render(() => <div children={["Hello World"]} />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can render nested children as props', () => {
    Th.render(() => <div children={<div>Hello World</div>} />, elm);
    assert.equal(elm.innerHTML, '<div><div>Hello World</div></div>');
  });

  it('can render text and vnodes children as props', () => {
    Th.render(() => <div children={[<div children="Hello" />, "Hello World"]} />, elm);
    assert.equal(elm.innerHTML, '<div><div>Hello</div>Hello World</div>');
  });

  it('can render a tag with an id', () => {
    Th.render(() => <div id="hello">Hello World</div>, elm);
    assert.equal(elm.innerHTML, '<div id="hello">Hello World</div>');
  });

  it('can render a tag with a class', () => {
    Th.render(() => <div className="hello">Hello World</div>, elm);
    assert.equal(elm.innerHTML, '<div class="hello">Hello World</div>');
  });

  it('can render a tag with multiple classes', () => {
    Th.render(() => <div className="hello world">Hello World</div>, elm);
    assert.equal(elm.innerHTML, '<div class="hello world">Hello World</div>');
  });

  it('can render a tag with styles', () => {
    Th.render(() => <div style={{ color: 'red', backgroundColor: 'blue' }}>Hello World</div>, elm);
    assert.equal(elm.innerHTML, '<div style="color: red; background-color: blue;">Hello World</div>');
  });

  it.skip('ref gets called', () => {
    let ref: HTMLDivElement;
    const setRef = (div: HTMLDivElement) => ref = div;
    const x = () => <div ref={setRef}>Hello World</div>;

    Th.render(x, elm);
    assert.equal(ref.tagName, 'DIV');
  });
})

describe('render intrinsic reactive', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  class State {
    @observable foo = 123;
    @action changeFoo() {
      this.foo = 456;
    }
  }
  let state = new State();
  beforeEach(() => state = new State());

  it('can re-render a tag', () => {
    Th.render(() => <div>{state.foo}</div>, elm);
    assert.equal(elm.innerHTML, '<div>123</div>');
    state.changeFoo();
    assert.equal(elm.innerHTML, '<div>456</div>');
  });
})
