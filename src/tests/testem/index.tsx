import * as Th from '../../index';
import * as assert from 'assert';
import { patch } from '../../vdom/patch';

describe('h', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can create vnode with proper tag', () => {
    const x = <div>Hello World</div>;
    patch(elm, x);
    assert.equal(elm.innerHTML, 'Hello World');
  });
})
