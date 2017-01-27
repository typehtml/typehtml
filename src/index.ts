/**
 * @module This is just an example of what the types would look like
 */
import * as types from './types';

/** 
 * Takes JSX and returns a handle to the DOMElement
 **/
import { createElement } from './vdom/createElement';
export { createElement };

/** 
 * Takes JSX and renders it to a string
 */
import { renderToString } from './server/renderToString';
export { renderToString };