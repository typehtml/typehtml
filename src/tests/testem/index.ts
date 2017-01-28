import { h } from '../../vdom/h';
import * as assert from 'assert';

describe('h', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can create vnode with proper tag', () => {
    assert.equal(h('div').sel, 'div');
    assert.equal(h('a').sel, 'a');
  });
})
