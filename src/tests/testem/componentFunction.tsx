import * as Th from '../../index';
import * as assert from 'assert';
import { observable, action } from 'mobx';

describe('component function', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  it('can render a tag', () => {
    const Sample = () => <div>Hello World</div>;
    Th.render(() => <Sample />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can take props', () => {
    const Sample = ({ text }) => <div>{text}</div>;
    Th.render(() => <Sample text="Hello World" />, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });

  it('can render children', () => {
    const Sample = ({ children }: { children?}) => <div>{children}</div>;
    Th.render(() => <Sample>Hello World</Sample>, elm);
    assert.equal(elm.innerHTML, '<div>Hello World</div>');
  });
})


describe('component function reactive', () => {
  let elm: HTMLDivElement;
  beforeEach(() => {
    elm = document.createElement('div');
  });

  class State {
    @observable foo = 123;
    @action changeFoo() {
      this.foo = 456;
    }
  }
  let state = new State();
  beforeEach(() => state = new State());

  it('can re-render a component', () => {
    const Sample = ({ }) => <div>{state.foo}</div>;
    Th.render(() => <Sample />, elm);
    assert.equal(elm.innerHTML, '<div>123</div>');
    state.changeFoo();
    assert.equal(elm.innerHTML, '<div>456</div>');
  });
})
