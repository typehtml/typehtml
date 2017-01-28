/**
 * @module This is just an example of what the types would look like
 */
import * as types from './types';
export { types };

/**
 * Takes JSX and returns a handle to the DOMElement
 **/
import { createElement } from './dom/createElement';
export { createElement };

/**
 * Takes JSX and renders it to a string
 */
export declare function renderToString(input: types.VNode): string;


/**
 * Takes JSX and renders it to a dom element
 */
export declare function render(input: types.VNode, parentDom: Element): void;
