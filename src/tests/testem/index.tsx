import * as Th from '../../index';
import * as assert from 'assert';

describe('h', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can create vnode with proper tag', () => {
    const x = <div/>;
    assert.equal(x.sel, 'div');
  });
})
