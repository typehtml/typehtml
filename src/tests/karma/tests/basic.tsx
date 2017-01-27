import * as assert from 'assert';
import { innerHTML } from '../../../tools/utils';
import * as TH from '../../../index';

describe('createElement', () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = document.createElement('div');
  });
  afterEach(function() {
    container.innerHTML = '';
  });

  it('should create an element', () => {
    TH.render(<a />, container);
    assert.equal(container.innerHTML, innerHTML('<a></a>'))
  });
  it('should create an element which text children', () => {
    TH.render(<a>Hello world</a>, container);
    assert.equal(container.innerHTML, innerHTML('<a>Hello world</a>'))
  });
})
