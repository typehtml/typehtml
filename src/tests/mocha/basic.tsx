/**
 * Used as a sample what the code can look like.
 * It will not work without us actually writing the code
 */
import * as Th from '../../index'

/** Create component as a function */
const FunctionExample = ({ text }: { text: string }) => <div>{text}</div>

/** Or as a class */
class ClassExample {
  constructor(private props: { text: string }) { }

  render() {
    return <div>{this.props.text}</div>
  }
}

/** Use native */
let nativeExample = <div>Hello world</div>

/** Use a function */
let functionExample = <FunctionExample text={"Hello world"} />

/** Use a class */
let classExample = <ClassExample text={"Hello world"} />

import * as assert from 'assert';
describe('Server rendering', () => {
  it('should render function component to string', () => {
    // assert.equal(TH.renderToString(functionExample), '<div>Hello world</div>');
  });

  it('should render class component to string', () => {
    // assert.equal(TH.renderToString(classExample), '<div>Hello world</div>');
  });
});
