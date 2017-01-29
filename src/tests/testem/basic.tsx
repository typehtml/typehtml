import * as Th from '../../index';
import * as assert from 'assert';

describe('h', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can render a tag', () => {
    const x = <div>Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
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
})
