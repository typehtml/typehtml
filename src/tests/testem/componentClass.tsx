import * as Th from '../../index';
import * as assert from 'assert';

describe('component class', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can render a tag', () => {
    class Sample {
      render() {
        return <div>Hello World</div>;
      }
    }
    Th.render(<Sample />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });
});
