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
    Th.render(() => <Sample />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can take props', () => {
    class Sample {
      constructor(public props: { text: string }) { }
      render() {
        return <div>{this.props.text}</div>;
      }
    }
    Th.render(() => <Sample text="Hello World" />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can take children', () => {
    class Sample {
      constructor(public props: { children?: any }) { }
      render() {
        return <div>{this.props.children}</div>;
      }
    }
    Th.render(() => <Sample>Hello World</Sample>, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });
});
