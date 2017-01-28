import { h } from '../../vdom/h';
import * as assert from 'assert';

describe('h', () => {
  var elm: HTMLDivElement;
  beforeEach(function() {
    elm = document.createElement('div');
  });

  it('can create vnode with proper tag', function() {
    assert.equal(h('div').sel, 'div');
    assert.equal(h('a').sel, 'a');
  });
})
