import * as Th from '../../index';
import * as assert from 'assert';

describe('component function', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can render a tag', () => {
    const Sample = () => <div>Hello World</div>;
    Th.render(<Sample />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });
})
