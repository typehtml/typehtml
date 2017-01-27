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
    const node = <a />;
    TH.render(node, container);
    assert.equal(container.innerHTML, '<a></a>')
  });
  it('should create an element which text children', () => {
    const node = <a>Hello world</a>;
    TH.render(node, container);
    assert.equal(container.innerHTML, '<a>Hello world</a>')
  });
})
