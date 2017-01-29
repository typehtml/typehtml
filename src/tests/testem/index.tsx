import * as Th from '../../index';
import * as assert from 'assert';

describe('h', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can create vnode with proper tag', () => {
    const x = <div>Hello World</div>;
    Th.render(x, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });
})
