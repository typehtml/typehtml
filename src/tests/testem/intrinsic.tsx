import * as Th from '../../index';
import * as assert from 'assert';

describe('render intrinsic', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can render a tag', () => {
    const x = <div>Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can render children as props', () => {
    const x = <div children={["Hello World"]} />;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can render nested children as props', () => {
    const x = <div children={<div>Hello World</div>} />;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div><div>Hello World</div></div>');
  });

  it('can render text and vnodes children as props', () => {
    const x = <div children={[<div children="Hello" />, "Hello World"]} />;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div><div>Hello</div>Hello World</div>');
  });

  it('can render a tag with an id', () => {
    const x = <div id="hello">Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div id="hello">Hello World</div>');
  });

  it('can render a tag with a class', () => {
    const x = <div className="hello">Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div class="hello">Hello World</div>');
  });

  it('can render a tag with multiple classes', () => {
    const x = <div className="hello world">Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div class="hello world">Hello World</div>');
  });

  it('can render a tag with styles', () => {
    const x = <div style={{ color: 'red', backgroundColor: 'blue' }}>Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div style="color: red; background-color: blue;">Hello World</div>');
  });

  it.only('ref gets called', () => {
    let ref: HTMLDivElement;
    const setRef = (div: HTMLDivElement) => ref = div;
    const x = <div ref={setRef}>Hello World</div>;

    Th.render(x, elm);
    assert.equal(ref.tagName, 'DIV');
  });
})
